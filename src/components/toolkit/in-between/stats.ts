import { id2label } from "@/lib/cards";

const id2value = (id: number) => {
  const label = id2label[id]
  // const shape = label.slice(-1)
  const num = label.substring(0, label.length - 1);
  const valueMap: Record<string, number> = { 'A': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 9, 'J': 10, 'Q': 11, 'K': 12 }
  return valueMap[num]
}
export interface RemainingCards {
  winRemaining: number,
  loseRemaining: number,
  penaltyRemaining: number
}

export const getRate = (remainingCards: RemainingCards) => {

  const totalCardsLeft = remainingCards.loseRemaining + remainingCards.penaltyRemaining + remainingCards.winRemaining
  const winRate = remainingCards.winRemaining / totalCardsLeft
  const loseRate = remainingCards.loseRemaining / totalCardsLeft
  const penaltyRate = remainingCards.penaltyRemaining / totalCardsLeft

  return { winRate, loseRate, penaltyRate }
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