import { MooResultData, id2value, mirrorMutatorCard } from "./calculator"
import { id2label } from "@/lib/cards"
import * as Table from '@/components/park-ui/table'
import { RoboflowObjectDetectionData } from "@/lib/roboflow-utils"

interface MooResultProps {
  data: MooResultData[]
  detection: RoboflowObjectDetectionData
}

const sumOf = (data: number[]) => data.reduce((acc, value) => acc + value, 0)

export const MooResult = ({ data, detection }: MooResultProps) => {
  const sorted = data.sort((a, b) => sumOf(b.pointer.map(id => id2value(id))) - sumOf(a.pointer.map(id => id2value(id))))
  const { predictions } = detection
  const holdings = [...new Set(predictions.map(pred => pred.class_id))]

  const displayCard = (id: number) => {
    if (holdings.includes(id)) {
      return id2label[id]
    }
    return id2label[mirrorMutatorCard(id)]
  }

  return (
    <Table.Root textAlign="center">
      <Table.Head>
        <Table.Row>
          <Table.Header textAlign="center">Combination</Table.Header>
          <Table.Header textAlign="center">Pointer</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sorted.map(({ combination, pointer }) => (
          <Table.Row>
            <Table.Cell>
              {combination.map(displayCard).join(' ')}
            </Table.Cell>
            <Table.Cell>
              {pointer.map(displayCard).join(' ')}
            </Table.Cell>
          </Table.Row>)
        )}
      </Table.Body>
    </Table.Root>
  )
}