import { RoboflowObjectDetectionData } from "@/lib/roboflow-utils"
import { RemainingCards } from "./stats"
import cv from "@techstark/opencv-js";

export interface InBetweenState {
  status: 'idle' | 'loaded' | 'detected' | 'calculated'
  stats?: RemainingCards
  detection?: RoboflowObjectDetectionData,
  image?: cv.Mat
}

export const initInBetweenState: InBetweenState = {
  status: 'idle',
  stats: undefined,
  detection: undefined,
  image: undefined
}