import { useEffect, useRef, useState } from 'react'
import { css } from 'styled-system/css';
import { center, vstack } from 'styled-system/patterns'
import { Camera } from '@/components/camera';
import axios from 'axios';
import cv from "@techstark/opencv-js";
import { RoboflowObjectDetectionData, yolo2coco } from '@/lib/roboflow-utils';
import { Setting } from '@/components/setting';
import { Heading } from '@/components/park-ui/heading';
import { HStack } from 'styled-system/jsx';
import { getRemainingStats } from '@/components/toolkit/in-between/stats';
import { createToaster } from '@ark-ui/react';
import * as Toast from '@/components/park-ui/toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/park-ui/icon-button';

const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

interface ImageResizeParams {
  image: cv.Mat
  width?: number
  height?: number
}

const imageResize = ({
  image,
  width,
  height
}: ImageResizeParams) => {
  const dst = new cv.Mat()
  let dim = undefined
  const { height: h, width: w } = image.size()

  if (!width && !height) {
    return image
  }

  if (height) {
    const r = height / h
    dim = new cv.Size(w * r, height)
  } else if (width) {
    const r = width / w
    dim = new cv.Size(width, h * r)
  } else {
    return image
  }

  cv.resize(image, dst, dim, cv.INTER_AREA)

  if (w > h) {
    cv.rotate(dst, dst, cv.ROTATE_90_CLOCKWISE)
  }

  return dst
}

const image = center({
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: "sm",
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  minW: 300,
  minH: 500,
  mx: 2,
  p: 2
})

interface RemainingCards {
  winRemaining: number,
  loseRemaining: number,
  penaltyRemaining: number
}

const getRate = (remainingCards: RemainingCards) => {
  const totalCardsLeft = remainingCards.loseRemaining + remainingCards.penaltyRemaining + remainingCards.winRemaining
  const winRate = remainingCards.winRemaining / totalCardsLeft
  const loseRate = remainingCards.loseRemaining / totalCardsLeft
  const penaltyRate = remainingCards.penaltyRemaining / totalCardsLeft

  return { winRate, loseRate, penaltyRate }
}

function App() {
  const [source, setSource] = useState("")
  const imageRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState("idle")
  const [data, setData] = useState<RoboflowObjectDetectionData | null>(null)
  const [remainingCards, setRemainingCards] = useState<RemainingCards | undefined>(undefined)
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
    if (status === "completed") {
      if (imageRef.current) {
        const ctx = imageRef.current.getContext("2d")
        if (ctx) {
          data?.predictions.forEach(prediction => {
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
        }
        const holdings = [...new Set(data?.predictions.map(pred => pred.class_id))]
        const calculateRemaining = new Promise<RemainingCards>((resolve, reject) => {
          try {
            resolve(getRemainingStats(holdings))
          } catch (error) {
            reject(error)
          }
        })
        calculateRemaining
          .then(stats => setRemainingCards(stats))
          .catch((error) => toast.create({ title: 'Required 2 cards only', description: (error as Error).message }))
      }
    }
  }, [status, data, toast])

  return (
    <main className={vstack({ alignItems: 'center', gap: 0 })}>
      <HStack justifyContent="space-between" w="full" pl={4}>
        <Heading as="h1" fontWeight="bold" color="accent.default">CNY Toolkit</Heading>
        <Setting />
      </HStack>
      {source &&
        <img className={css({ display: 'none' })} src={source} alt="snap" role="presentation" onLoad={(e) => {
          if (imageRef.current) {
            const ctx = imageRef.current.getContext("2d")
            if (ctx) {
              ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height)
            }

            const image = cv.imread(e.currentTarget)
            const { height: h, width: w } = image.size()
            const resizeParams = {
              image,
              width: w > h ? 800 : undefined,
              height: h > w ? 800 : undefined
            }
            const resizedImage = imageResize(resizeParams)
            cv.imshow(imageRef.current, resizedImage);
            const base64out = imageRef.current.toDataURL()
            // setData(twoCardsResponse)
            axios({
              method: "POST",
              url: "https://detect.roboflow.com/playing-cards-ow27d/4",
              params: {
                api_key: "2oyw5t39LaDRwByh6M9J"
              },
              data: base64out,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            })
              .then(function (response) {
                toast.create({ title: 'Required 2 cards only', description: 'hi' })
                console.log(response.data);
                setData(response.data)
              })
              .catch(function (error) {
                console.log(error.message);
              })
              .finally(() => setStatus("completed"));

          }
        }} />
      }
      <div className={image}>
        <canvas className={css({ w: "full" })} ref={imageRef} />
      </div>
      <div>
        {remainingCards && JSON.stringify(getRate(remainingCards))}
      </div>
      <Camera onCapture={async (data) => { setSource(data.source) }} />
      <Toaster />
    </main>
  )
}

export default App
