import { useEffect, useRef, useState } from 'react'
import { css } from 'styled-system/css';
import { center, container, vstack } from 'styled-system/patterns'
import { Camera } from '@/components/camera';
import cv from "@techstark/opencv-js";
import { getRoboflowSingleDetection, yolo2coco } from '@/lib/roboflow-utils';
import { Setting } from '@/components/setting';
import { Heading } from '@/components/park-ui/heading';
import { HStack } from 'styled-system/jsx';
import { getRemainingStats, RemainingCards } from '@/components/toolkit/in-between/stats';
import { createToaster } from '@ark-ui/react';
import * as Toast from '@/components/park-ui/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/park-ui/icon-button';
import { imageResize } from './lib/image-utils';
import { InBetweenResult } from './components/toolkit/in-between/result';
import { InBetweenState, initInBetweenState } from './components/toolkit/in-between/state';

const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const image = center({
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: "sm",
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  minW: 300,
  minH: 400,
  mx: 2,
  p: 2
})

function App() {
  const [source, setSource] = useState("")
  const imageRef = useRef<HTMLCanvasElement>(null)
  const [inBetweenState, setInBetweenState] = useState<InBetweenState>(initInBetweenState)

  const [Toaster, toast] = createToaster({
    placement: 'bottom-end',
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
        const base64out = imageRef.current.toDataURL()
        getRoboflowSingleDetection(base64out).then(function (response) {
          setInBetweenState(prev => ({ ...prev, detection: response.data, stats: undefined }))
        }).catch(function (error) {
          console.log(error.message);
        }).finally(() => setInBetweenState(prev => ({ ...prev, status: 'detected' })));
      }

      if (status === 'detected' && inBetweenState.detection && ctx) {
        const {predictions} = inBetweenState.detection
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

  }, [inBetweenState, toast])

  return (
    <main className={vstack({ alignItems: 'center', gap: 0 })}>
      <HStack justifyContent="space-between" w="full" pl={4}>
        <Heading as="h1" fontWeight="bold" color="accent.default">CNY Toolkit</Heading>
        <Setting />
      </HStack>
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
      <div className={image}>
        <canvas className={css({ w: "full" })} ref={imageRef} />
      </div>
      <div className={css({w: 'full', mt: 4})}>
        <InBetweenResult state={inBetweenState}/>
      </div>
      <Camera onCapture={async (data) => { setSource(data.source) }} />
      <Toaster />
    </main>
  )
}

export default App
