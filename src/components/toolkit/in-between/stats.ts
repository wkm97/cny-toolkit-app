const categories = ['10c', '10d', '10h', '10s', '2c', '2d', '2h', '2s', '3c', '3d', '3h', '3s', '4c', '4d', '4h', '4s', '5c', '5d', '5h', '5s', '6c', '6d', '6h', '6s', '7c', '7d', '7h', '7s', '8c', '8d', '8h', '8s', '9c', '9d', '9h', '9s', 'Ac', 'Ad', 'Ah', 'As', 'Jc', 'Jd', 'Jh', 'Js', 'Kc', 'Kd', 'Kh', 'Ks', 'Qc', 'Qd', 'Qh', 'Qs']

const label2id = Object.fromEntries(
  categories.map((label, index) => [label, index])
);

const id2label = Object.fromEntries(
  categories.map((label, index) => [index, label])
);

const id2value = (id: number) => {
  const label = id2label[id]
  // const shape = label.slice(-1)
  const num = label.substring(0, label.length - 1);
  const valueMap: Record<string, number> = { 'A': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12 }
  return valueMap[num]
}

export const getRemainingStats = (holding: number[]) => {
  if (holding.length !== 2) {
    throw new Error('Holding hand must consist only 2 cards.')
  }

  let highValue = 0
  let lowValue = 0
  const holdingValues = holding.map(id2value)

  if (holdingValues[0] === holdingValues[1]) {
    throw new Error('Same value cards with penalty.')
  }

  if (holdingValues[0] > holdingValues[1]) {
    highValue = holdingValues[0]
    lowValue = holdingValues[1]
  } else {
    highValue = holdingValues[1]
    lowValue = holdingValues[0]
  }

  const allCards = Array.from({ length: 52 }, (_, index) => index);
  const deck = allCards.filter(id => !holding.includes(id)).map(id2value)
  const stats = deck.reduce((acc, curr) => {
    
    if(curr > lowValue && curr < highValue){
      return {
        ...acc,
        winRemaining: acc.winRemaining + 1
      }
    } else if(curr === lowValue || curr === highValue){
      return {
        ...acc,
        penaltyRemaining: acc.penaltyRemaining + 1
      }
    } else {
      return {
        ...acc,
        loseRemaining: acc.loseRemaining + 1
      }
    }
  }, {
    winRemaining: 0,
    loseRemaining: 0,
    penaltyRemaining: 0
  })

  return stats
}