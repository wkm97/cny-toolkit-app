import { vstack } from 'styled-system/patterns'
import { Setting } from '@/components/setting';
import { Heading } from '@/components/park-ui/heading';
import { HStack } from 'styled-system/jsx';
import { InBetweenToolkit } from './components/toolkit/in-between';
import { useSetting } from './contexts/setting';
import { BlackjackToolkit } from './components/toolkit/blackjack';
import { MooToolkit } from './components/toolkit/moo';

function App() {

  const { state } = useSetting()

  return (
    <main className={vstack({ gap: 2 })}>
      <HStack justifyContent="space-between" w="full" pl={2}>
        <Heading as="h1" fontWeight="bold" color="accent.default">CNY Toolkit</Heading>
        <Setting />
      </HStack>
      {state.toolkit === "in-between" && <InBetweenToolkit />}
      {state.toolkit === "blackjack" && <BlackjackToolkit />}
      {state.toolkit === "moo" && <MooToolkit />}
    </main>
  )
}

export default App
