import { IconButton } from "@/components/park-ui/icon-button"
import { RemainingCards, getRange, getRate, value2symbol } from "./stats"
import * as Table from '@/components/park-ui/table'
import { MinusIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { hstack } from "styled-system/patterns"
import { useState } from "react"
import { Button } from "@/components/park-ui/button"
import { HStack } from "styled-system/jsx"
import { RoboflowObjectDetectionData } from "@/lib/roboflow-utils"

interface InBetweenResultProps {
  stats: RemainingCards
  detection: RoboflowObjectDetectionData
}

export const InBetweenResult = ({ stats, detection }: InBetweenResultProps) => {

  const [remaining, setRemaining] = useState<RemainingCards>(stats)
  const holdings = [...new Set(detection.predictions.map(pred => pred.class_id))]
  const [low, high] = getRange(holdings)
  const rates = getRate(remaining)
  const formatRate = (rate: number) => (rate * 100).toFixed(2) + '%'

  return <div>
    <Table.Root textAlign="center">
      <Table.Head>
        <Table.Row>
          <Table.Header textAlign="center">Type</Table.Header>
          <Table.Header textAlign="center">Probability</Table.Header>
          <Table.Header textAlign="center">Count</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell fontWeight="medium">Win</Table.Cell>
          <Table.Cell>{formatRate(rates.winRate)}</Table.Cell>
          <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, winRemaining: Math.max(prev.winRemaining - 1, 0) }))}>
              <MinusIcon />
            </IconButton>
            {remaining.winRemaining}
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, winRemaining: Math.max(prev.winRemaining + 1, 0) }))}>
              <PlusIcon />
            </IconButton>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell fontWeight="medium">Lose</Table.Cell>
          <Table.Cell>{formatRate(rates.loseRate)}</Table.Cell>
          <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining - 1, 0) }))}>
              <MinusIcon />
            </IconButton>
            {remaining.loseRemaining}
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining + 1, 0) }))}>
              <PlusIcon />
            </IconButton>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell fontWeight="medium">Penalty</Table.Cell>
          <Table.Cell>{formatRate(rates.penaltyRate)}</Table.Cell>
          <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining - 1, 0) }))}>
              <MinusIcon />
            </IconButton>
            {remaining.penaltyRemaining}
            <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining + 1, 0) }))}>
              <PlusIcon />
            </IconButton>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>
            <Button colorPalette="accent" variant="outline" onClick={() => setRemaining(stats)}>
              Reset
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
    <HStack p={4} mt={8} justifyContent="space-evenly">
      <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining - 1, 0) }))}>
        <ChevronLeftIcon />
      </IconButton>
      <Button colorPalette="accent" variant="ghost" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining - 1, 0) }))}>
        {value2symbol[low]}
      </Button>
      <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, winRemaining: Math.max(prev.winRemaining - 1, 0) }))}>
        <ChevronRightIcon />
        <ChevronLeftIcon />
      </IconButton>
      <Button colorPalette="accent" variant="ghost" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining - 1, 0) }))}>
        {value2symbol[high]}
      </Button>
      <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining - 1, 0) }))}>
        <ChevronRightIcon />
      </IconButton>
    </HStack>
  </div>
}