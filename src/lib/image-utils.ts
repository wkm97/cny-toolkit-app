import cv from "@techstark/opencv-js";

export interface ImageResizeParams {
  image: cv.Mat
  width?: number
  height?: number
}

export const imageResize = ({
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