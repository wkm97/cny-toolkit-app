import { useEffect, useRef, useState } from 'react'
import { css } from '../styled-system/css';
import { center, vstack } from '../styled-system/patterns'
import { Camera } from './components/camera';
import axios from 'axios';
import cv from "@techstark/opencv-js";
import { RoboflowObjectDetectionData, yolo2coco } from './roboflow-utils';

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

  return dst
}

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
    <main className={vstack({ alignItems: 'center' })}>
      <h1 className={css({ textStyle: 'heading/L1', color: 'brand.primary' })}>CNY Toolkit</h1>
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
                  console.log(response.data);
                  setData(response.data)
                })
                .catch(function (error) {
                  console.log(error.message);
                }).finally(() => setStatus("completed"));

            }
          }} />
          <canvas className={css({ w: 300 })} ref={imageRef} />
        </div>
      }
      <div>{JSON.stringify(data, null, 2)}</div>
      <Camera onCapture={async (data) => { setSource(data.source); setStatus("loading") }} />
    </main>
  )
}

export default App
