import { useEffect, useRef, useState } from 'react'
import { css } from 'styled-system/css';
import { center, vstack } from 'styled-system/patterns'
import { Camera } from '@/components/camera';
import cv from "@techstark/opencv-js";
import { getRoboflowSingleDetection, yolo2coco } from '@/lib/roboflow-utils';
import { getRemainingStats, RemainingCards } from '@/components/toolkit/in-between/stats';
import { createToaster } from '@ark-ui/react';
import * as Toast from '@/components/park-ui/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/park-ui/icon-button';
import { imageResize } from '@/lib/image-utils';
import { InBetweenResult } from '@/components/toolkit/in-between/result';
import { InBetweenState, initInBetweenState } from '@/components/toolkit/in-between/state';
import * as Tabs from '@/components/park-ui/tabs';
import { Button } from '@/components/park-ui/button';


const image = center({
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: "sm",
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  minW: 300,
  minH: 400,
  maxW: 1024,
  mx: 2,
  p: 2,
})

const spinner = css({
  position: 'absolute',
  border: '2px solid',
  borderColor: 'bg.default',
  borderTop: '2px solid',
  borderTopColor: 'fg.default',
  borderRadius: '50%',
  width: 10,
  height: 10,
  animation: 'spin',
})

export const InBetweenToolkit = () => {
  const [source, setSource] = useState("")
  const imageRef = useRef<HTMLCanvasElement>(null)
  const [inBetweenState, setInBetweenState] = useState<InBetweenState>(initInBetweenState)
  const [value, setValue] = useState<string>('image')

  const [Toaster, toast] = createToaster({
    placement: 'top-end',
    render(toast) {
      return (
        <Toast.Root>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.CloseTrigger asChild>
            <IconButton size="sm" variant="link">
              <XMarkIcon />
            </IconButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      )
    },
  });

  useEffect(() => {
    const { status } = inBetweenState
    if (imageRef.current) {
      const ctx = imageRef.current.getContext("2d")
      if (status === 'loaded' && inBetweenState.image) {
        if (ctx) {
          ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height)
        }
        cv.imshow(imageRef.current, inBetweenState.image);
        setValue('image')
        const base64out = imageRef.current.toDataURL()
        getRoboflowSingleDetection(base64out).then(function (response) {
          setInBetweenState(prev => ({ ...prev, detection: response.data, stats: undefined }))
        }).catch(function (error) {
          console.log(error.message);
        }).finally(() => setInBetweenState(prev => ({ ...prev, stats: undefined, status: 'detected' })));
      }

      if (status === 'detected' && inBetweenState.detection && ctx) {
        const { predictions } = inBetweenState.detection
        predictions.forEach(prediction => {
          const { x, y, width, height } = yolo2coco(
            prediction.x,
            prediction.y,
            prediction.width,
            prediction.height
          )
          ctx.beginPath();
          ctx.lineWidth = 6;
          ctx.strokeStyle = "red";
          ctx.rect(x, y, width, height);
          ctx.font = "bold 30px Nunito";
          ctx.fillStyle = "red";
          ctx.fillText(prediction.class, x - 10, y - 10, 140)
          ctx.stroke();
        })
        const holdings = [...new Set(predictions.map(pred => pred.class_id))]
        const calculateRemaining = new Promise<RemainingCards>((resolve, reject) => {
          try {
            resolve(getRemainingStats(holdings))
          } catch (error) {
            reject(error)
          }
        })
        calculateRemaining
          .then(stats => setInBetweenState(prev => ({ ...prev, stats, status: 'calculated' })))
          .catch((error) => {
            toast.create({ title: 'Required 2 cards only', description: (error as Error).message })
          })
      }
    }

  }, [inBetweenState])

  return (
    <>
      {source &&
        <img className={css({ display: 'none' })} src={source} alt="snap" role="presentation" onLoad={(e) => {
          if (imageRef.current) {
            const image = cv.imread(e.currentTarget)
            const { height: h, width: w } = image.size()
            const resizeParams = {
              image,
              width: w > h ? 800 : undefined,
              height: h > w ? 800 : undefined
            }
            const resizedImage = imageResize(resizeParams)
            setInBetweenState(prev => ({ ...prev, image: resizedImage, status: 'loaded' }))
          }
        }} />
      }
      <Tabs.Root value={value} onValueChange={(e) => setValue(e.value)}>
        <Tabs.List boxShadow='none'>
          <Tabs.Trigger value="image">
            Image
          </Tabs.Trigger>
          <Tabs.Trigger value="result">
            Result
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="image" pt={0}>
          <div className={vstack()}>
            <div className={image}>
              {inBetweenState.status === 'loaded' && <div className={spinner} />}
              <canvas className={css({ w: "full" })} ref={imageRef} />
            </div>
            {inBetweenState.stats &&
              <Button mr={2} mt={2} colorPalette="accent" variant="outline" onClick={() => setValue('result')}>
                View Result
              </Button>}
          </div>
        </Tabs.Content>
        <Tabs.Content value="result" pt={0}>
          {inBetweenState.stats ? <InBetweenResult stats={inBetweenState.stats} /> :
            <div className={css({ ml: 4 })}>No results</div>}
        </Tabs.Content>
      </Tabs.Root>
      <Camera onCapture={async (data) => {
        setInBetweenState(initInBetweenState)
        setSource(data.source)
      }} />
      <Toaster />
    </>
  )
}
