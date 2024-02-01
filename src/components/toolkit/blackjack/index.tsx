import { useEffect, useRef, useState } from 'react'
import { css } from 'styled-system/css';
import { center } from 'styled-system/patterns'
import { Camera } from '@/components/camera';
import cv from "@techstark/opencv-js";
import { RoboflowObjectDetectionData, getRoboflowSingleDetection, yolo2coco } from '@/lib/roboflow-utils';
import { imageResize } from '@/lib/image-utils';
import { getPoint } from './calculator';
import { VStack } from 'styled-system/jsx';


const image = center({
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: "sm",
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  minW: 300,
  minH: 400,
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

interface BlackjackState {
  status: 'idle' | 'loaded' | 'detected' | 'calculated'
  detection?: RoboflowObjectDetectionData,
  image?: cv.Mat
  point?: number
}

const initBlackjackState: BlackjackState = {
  status: 'idle',
  detection: undefined,
  image: undefined,
  point: undefined
}

export const BlackjackToolkit = () => {
  const [source, setSource] = useState("")
  const imageRef = useRef<HTMLCanvasElement>(null)
  const [blackjackState, setBlackjackState] = useState<BlackjackState>(initBlackjackState)

  useEffect(() => {
    if (imageRef.current) {
      const { status } = blackjackState
      const ctx = imageRef.current.getContext("2d")
      if (status === 'loaded' && blackjackState.image) {
        if (ctx) {
          ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height)
        }
        cv.imshow(imageRef.current, blackjackState.image);
        const base64out = imageRef.current.toDataURL()
        getRoboflowSingleDetection(base64out).then(function (response) {
          setBlackjackState(prev => ({ ...prev, detection: response.data, point: undefined }))
        }).catch(function (error) {
          console.log(error.message);
        }).finally(() => setBlackjackState(prev => ({ ...prev, point: undefined, status: 'detected' })));
      }

      if (status === 'detected' && blackjackState.detection && ctx) {
        const { predictions } = blackjackState.detection
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
        setBlackjackState(prev => ({ ...prev, point: getPoint(holdings), status: 'calculated' }))
      }
    }

  }, [blackjackState])

  return (
    <VStack maxW={1024}>
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
            setBlackjackState(prev => ({ ...prev, image: resizedImage, status: 'loaded' }))
          }
        }} />
      }
      <div className={image}>
        {blackjackState.status === 'loaded' && <div className={spinner} />}
        <canvas className={css({ w: "full" })} ref={imageRef} />
      </div>
      <span>{blackjackState.point || 0} points</span>
      <Camera onCapture={async (data) => {
        setBlackjackState(initBlackjackState)
        setSource(data.source)
      }} />
    </VStack>
  )
}
