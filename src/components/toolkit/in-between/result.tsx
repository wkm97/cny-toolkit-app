import { IconButton } from "@/components/park-ui/icon-button"
import { InBetweenState } from "./state"
import { getRate } from "./stats"
import * as Table from '@/components/park-ui/table'
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { hstack } from "styled-system/patterns"

interface InBetweenResultProps {
  state?: InBetweenState
}

export const InBetweenResult = ({ state }: InBetweenResultProps) => {
  if (!state?.stats) {
    return 'No results'
  }

  const rates = getRate(state.stats)

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
        <Table.Cell>{rates?.winRate}</Table.Cell>
        <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
          <IconButton variant="ghost" size="md" color="accent.default">
            <MinusIcon />
          </IconButton>
          {state.stats.winRemaining}
          <IconButton variant="ghost" size="md" color="accent.default">
            <PlusIcon />
          </IconButton>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell fontWeight="medium">Lose</Table.Cell>
        <Table.Cell>{rates?.loseRate}</Table.Cell>
        <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
          <IconButton variant="ghost" size="md" color="accent.default">
            <MinusIcon />
          </IconButton>
          {state.stats.loseRemaining}
          <IconButton variant="ghost" size="md" color="accent.default">
            <PlusIcon />
          </IconButton>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell fontWeight="medium">Penalty</Table.Cell>
        <Table.Cell>{rates?.penaltyRate}</Table.Cell>
        <Table.Cell className={hstack({ w: 'full', justifyContent: 'space-around' })}>
          <IconButton variant="ghost" size="md" color="accent.default">
            <MinusIcon />
          </IconButton>
          {state.stats.penaltyRemaining}
          <IconButton variant="ghost" size="md" color="accent.default">
            <PlusIcon />
          </IconButton>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table.Root>
}