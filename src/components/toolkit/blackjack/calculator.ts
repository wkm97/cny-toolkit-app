import { id2label } from "@/lib/cards";

export const id2value = (id: number) => {
  const label = id2label[id]
  // const shape = label.slice(-1)
  const num = label.substring(0, label.length - 1);
  const valueMap: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 }
  return valueMap[num]
}

export const getPoint = (holdings: number[]) => {
  const values = holdings.map(id2value).sort((a,b) => a - b)
  const points = values.reduce((prev, curr)=>{
    if([10, 11, 12, 13].includes(curr)){
      return prev + 10
    }

    // The value of Ace changes with the number of cards in hand. 
    // If one has a total of 2 cards in hand, Ace can be 10 or 11. 
    // If one has a total of 3 cards in hand, Ace can be 10 or 1. 
    // If one has more than 4 cards in hand, Ace is equalled to 1.
    if(curr === 14){
      if(holdings.length === 2){
        return prev + 11 > 21 ? prev + 10: prev + 11
      } else if (holdings.length === 3){
        return prev + 10 > 21 ? prev + 1: prev + 10
      } else {
        return prev + 1
      }
    }

    return prev + curr
  }, 0)
  return points
}