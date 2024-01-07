
export interface RoboflowObjectDetectionData {
    time: number
    image: {
        width: number
        height: number
    },
    predictions: Array<{
        x: number,
        y: number,
        width: number,
        height: number,
        confidence: number,
        class: string,
        class_id: number
    }>
}

export const twoCardsResponse: RoboflowObjectDetectionData = {
    "time": 0.07786183999996865,
    "image": {
        "width": 600,
        "height": 800
    },
    "predictions": [
        {
            "x": 148,
            "y": 464.5,
            "width": 48,
            "height": 59,
            "confidence": 0.8124814033508301,
            "class": "5H",
            "class_id": 18
        },
        {
            "x": 259.5,
            "y": 364,
            "width": 31,
            "height": 64,
            "confidence": 0.8027207851409912,
            "class": "KD",
            "class_id": 45
        },
        {
            "x": 473.5,
            "y": 535,
            "width": 33,
            "height": 66,
            "confidence": 0.793393611907959,
            "class": "KD",
            "class_id": 45
        }
    ]
  }

export const exampleResponse: RoboflowObjectDetectionData = {
  "time": 0.07786183999996865,
  "image": {
      "width": 600,
      "height": 800
  },
  "predictions": [
      {
          "x": 148,
          "y": 464.5,
          "width": 48,
          "height": 59,
          "confidence": 0.8124814033508301,
          "class": "5H",
          "class_id": 18
      },
      {
          "x": 104.5,
          "y": 582,
          "width": 59,
          "height": 56,
          "confidence": 0.8075759410858154,
          "class": "3D",
          "class_id": 9
      },
      {
          "x": 259.5,
          "y": 364,
          "width": 31,
          "height": 64,
          "confidence": 0.8027207851409912,
          "class": "KD",
          "class_id": 45
      },
      {
          "x": 473.5,
          "y": 535,
          "width": 33,
          "height": 66,
          "confidence": 0.793393611907959,
          "class": "KD",
          "class_id": 45
      }
  ]
}

export const getUniquePredictions = (predictions: RoboflowObjectDetectionData['predictions']) => {
    return predictions.filter
}

export const yolo2coco = (cx: number, cy: number, width: number, height: number) => {
    const x = cx - (width * 0.5)
    const y = cy - (height * 0.5)

    return {x, y, width, height}
}