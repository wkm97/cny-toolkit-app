import { useEffect, useRef, useState } from 'react'
import { css } from 'styled-system/css';
import { box, center, container, vstack } from 'styled-system/patterns'
import { Camera } from '@/components/camera';
import axios from 'axios';
import cv from "@techstark/opencv-js";
import { RoboflowObjectDetectionData, yolo2coco } from './roboflow-utils';
import { Setting } from '@/components/setting';
import { Heading } from '@/components/park-ui/heading';
import { HStack } from 'styled-system/jsx';

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

  if(w > h) {
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

function App() {
  const [source, setSource] = useState("")
  const imageRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState("idle")
  const [data, setData] = useState<RoboflowObjectDetectionData | null>(null)

  useEffect(() => {
    if (imageRef.current) {
      const ctx = imageRef.current.getContext("2d")
      if (ctx) {
        if (status === "completed") {
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

        if (status === "loading") {
          ctx.clearRect(0, 0, imageRef.current.width, imageRef.current.height)
        }
      }
    }
  }, [status, data])

  return (
    <main className={vstack({ alignItems: 'center', gap: 0 })}>
      <HStack justifyContent="space-between" w="full" pl={4}>
        <Heading as="h1" fontWeight="bold" color="accent.default">CNY Toolkit</Heading>
        <Setting />
      </HStack>
      {source &&
        <div className={center({ h: '1/2', w: '100%' })}>
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
              cv.imshow(imageRef.current, resizedImage);
              const base64out = imageRef.current.toDataURL()
              // axios({
              //   method: "POST",
              //   url: "https://detect.roboflow.com/playing-cards-ow27d/4",
              //   params: {
              //     api_key: "2oyw5t39LaDRwByh6M9J"
              //   },
              //   data: base64out,
              //   headers: {
              //     "Content-Type": "application/x-www-form-urlencoded"
              //   }
              // })
              //   .then(function (response) {
              //     console.log(response.data);
              //     setData(response.data)
              //   })
              //   .catch(function (error) {
              //     console.log(error.message);
              //   }).finally(() => setStatus("completed"));
              setStatus("completed")

            }
          }} />
        </div>
      }
      <div className={image}>
        <canvas className={css({w: "full"})}ref={imageRef} />
      </div>
      <Camera onCapture={async (data) => { setSource(data.source); setStatus("loading") }} />
    </main>
  )
}

export default App
