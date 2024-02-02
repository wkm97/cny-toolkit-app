import { id2label, label2id } from "@/lib/cards";

export const id2value = (id: number) => {
  const label = id2label[id]
  // const shape = label.slice(-1)
  const num = label.substring(0, label.length - 1);
  const valueMap: Record<string, number> = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 }
  return valueMap[num]
}

const generateCombinations = (cards: number[], size: number, callback: (cards: number[]) => void) => {
  const combine = (start: number, size: number, combination: number[]) => {
    if (size === 0) {
      callback(combination)
      return;
    }
    for (let i = start; i <= cards.length - size; i++) {
      combine(i + 1, size - 1, combination.concat(cards[i]));
    }
  }

  combine(0, size, []);
}

const getFlattenCombinations = (combinations: (number | number[])[]) => {
  return combinations.reduce((result: number[][], currentElement: number | number[]) => {
    const newCombinations = [];

    if (Array.isArray(currentElement)) {
      currentElement.forEach((value) => {
        result.forEach((combination) => {
          newCombinations.push([...combination, value]);
        });
      });
    } else {
      newCombinations.push(...result.map((combination) => [...combination, currentElement]));
    }

    return newCombinations;
  }, [[]]);
}

export const getPoint = (holdings: number[]) => {
  const values = holdings.map(id2value).sort((a, b) => a - b)
  const points = values.reduce((prev, curr) => {
    return prev + curr
  }, 0)
  return points
}

export const isMutatorCard = (id: number) => {
  if ([3, 6].includes(id2value(id))) {
    return true
  }
  return false
}

export const mirrorMutatorCard = (id: number) => {
  const value = id2value(id)
  if (value === 3) {
    const label = id2label[id]
    const shape = label.slice(-1)
    return label2id['6' + shape]
  }
  if (value === 6) {
    const label = id2label[id]
    const shape = label.slice(-1)
    return label2id['3' + shape]
  }
  return id
}

export interface MooResultData {
  combination: number[]
  pointer: number[]
}

export const getMooResults = (holdings: number[]): MooResultData[] => {
  if (holdings.length !== 5) {
    throw new Error('Holding hand must consist only 5 cards.')
  }
  const allowedCombinations: number[][] = [];

  generateCombinations(holdings, 3, (combination) => {
    const ruleApplied = combination.map(id => [3, 6].includes(id2value(id)) ? [id, mirrorMutatorCard(id)] : id)
    const allCombinations = getFlattenCombinations(ruleApplied)
    allCombinations.forEach(combination => {
      const values = combination.map(id2value)
      const sum = values.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      }, 0);
      if (sum % 10 === 0) {
        allowedCombinations.push(combination)
      }
    })
  });

  const results = allowedCombinations.reduce((acc, combination) => {
    const actualCombination = combination.map(card => {
      if(holdings.includes(card)){
        return card
      }
      return mirrorMutatorCard(card)
    })
    const pointer = holdings.filter(card => !actualCombination.includes(card))
    const key = pointer.map(id=>id2label[id]).join()
    return {...acc, [key]: {combination, pointer }}

  }, {})

  return Object.values(results);
}