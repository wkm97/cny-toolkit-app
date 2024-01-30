import { IconButton } from "@/components/park-ui/icon-button"
import { RemainingCards, getRate } from "./stats"
import * as Table from '@/components/park-ui/table'
import { MinusIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline"
import { hstack } from "styled-system/patterns"
import { useState } from "react"
import { Button } from "@/components/park-ui/button"

interface InBetweenResultProps {
  stats: RemainingCards
}

export const InBetweenResult = ({ stats }: InBetweenResultProps) => {

  const [remaining, setRemaining] = useState<RemainingCards>(stats)

  if (!remaining) {
    return 'No results'
  }

  const rates = getRate(remaining)
  const formatRate = (rate: number) => (rate * 100).toFixed(2) + '%'

  return <Table.Root textAlign="center">
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
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, winRemaining: Math.max(prev.winRemaining + 1, 0) }))}>
            <ArrowUturnLeftIcon />
          </IconButton>
          {remaining.winRemaining}
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, winRemaining: Math.max(prev.winRemaining - 1, 0) }))}>
            <MinusIcon />
          </IconButton>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell fontWeight="medium">Lose</Table.Cell>
        <Table.Cell>{formatRate(rates.loseRate)}</Table.Cell>
        <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining + 1, 0) }))}>
            <ArrowUturnLeftIcon />
          </IconButton>
          {remaining.loseRemaining}
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, loseRemaining: Math.max(prev.loseRemaining - 1, 0) }))}>
            <MinusIcon />
          </IconButton>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell fontWeight="medium">Penalty</Table.Cell>
        <Table.Cell>{formatRate(rates.penaltyRate)}</Table.Cell>
        <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining + 1, 0) }))}>
            <ArrowUturnLeftIcon />
          </IconButton>
          {remaining.penaltyRemaining}
          <IconButton variant="ghost" size="md" color="accent.default" onClick={() => setRemaining(prev => ({ ...prev, penaltyRemaining: Math.max(prev.penaltyRemaining - 1, 0) }))}>
            <MinusIcon />
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
}