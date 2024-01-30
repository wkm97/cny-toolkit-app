import { vstack } from 'styled-system/patterns'
import { Setting } from '@/components/setting';
import { Heading } from '@/components/park-ui/heading';
import { HStack } from 'styled-system/jsx';
import { InBetweenToolkit } from './components/toolkit/in-between';
import { useSetting } from './contexts/setting';

const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

function App() {

  const { state } = useSetting()

  return (
    <main className={vstack({ gap: 0})}>
      <HStack justifyContent="space-between" w="full" pl={2}>
        <Heading as="h1" fontWeight="bold" color="accent.default">CNY Toolkit</Heading>
        <Setting />
      </HStack>
      {state.toolkit === "in-between" && <InBetweenToolkit/>}
      {state.toolkit === "blackjack" && "Blackjack game"}
    </main>
  )
}

export default App
