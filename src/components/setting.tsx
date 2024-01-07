import { Cog6ToothIcon, XMarkIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline"
import { css } from "styled-system/css"
import { Portal } from "@ark-ui/react"
import * as Select from "@/components/park-ui/select"
import * as Dialog from "@/components/park-ui/dialog"
import { Stack } from "styled-system/jsx"
import { IconButton } from "@/components/park-ui/icon-button"
import { SettingState, useSetting } from "@/contexts/setting"
import { Switch } from "./park-ui/switch"

export const Setting = () => {
  const { state, changeSetting } = useSetting()

  const items = [
    { label: 'Blackjack', value: 'blackjack' },
    { label: 'In Between', value: 'in-between' }
  ]

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton aria-label="Close Dialog" variant="ghost" size="lg" color="accent.default">
          <Cog6ToothIcon className={css({ w: 6, strokeWidth: 2 })} />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop background="bg.canvas" opacity="0.8" filter="blur(20px)" />
        <Dialog.Positioner>
          <Dialog.Content>
            <Stack gap="8" p="6">
              <Stack gap="8">
                <Dialog.Title>Settings</Dialog.Title>
                <Select.Root
                  positioning={{ sameWidth: true }}
                  width="2xs"
                  items={items}
                  defaultValue={[state.toolkit]}
                  onValueChange={(e) => {
                    const toolkit = e.value[0] as SettingState['toolkit']
                    if (toolkit === "blackjack") {
                      changeSetting({ toolkit, configuration: undefined })
                    } else {
                      changeSetting({ toolkit, configuration: { beta: false } })
                    }
                  }}
                >
                  <Select.Label>Toolkit</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select a Toolkit" />
                      <ChevronDownIcon />
                    </Select.Trigger>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      <Select.ItemGroup id="toolkit">
                        <Select.ItemGroupLabel htmlFor="toolkit">Toolkit</Select.ItemGroupLabel>
                        {items.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
                {state.toolkit === "in-between" &&
                  <Switch defaultChecked={state.configuration?.beta} onCheckedChange={(e)=> changeSetting({...state, configuration: {beta: e.checked}})}>
                    Beta
                  </Switch>}
              </Stack>
            </Stack>
            <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton aria-label="Close Dialog" variant="ghost" size="sm">
                <XMarkIcon />
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}