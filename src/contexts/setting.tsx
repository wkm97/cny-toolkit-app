import React, { useMemo } from "react";
import { useLocalStorageState } from "./local-storage.hook";

type ToolkitType = "in-between" | "blackjack" | "moo"

export interface SettingState {
  toolkit: ToolkitType
  configuration: undefined | { beta: boolean }
}

export interface ISettingContext {
  state: SettingState
  changeSetting: (state: SettingState) => void;
}

const SettingContext = React.createContext<ISettingContext>({} as ISettingContext)

export const SettingProvider = ({ children }: React.PropsWithChildren) => {


  const [storage, setStorage] = useLocalStorageState<SettingState>("setting", { toolkit: "in-between", configuration: undefined })

  const context = useMemo(() => ({
    state: storage,
    changeSetting: (state: SettingState) => setStorage(state)
  }), [storage])

  return (
    <SettingContext.Provider value={context}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSetting = () => {
  const context = React.useContext(SettingContext)
  if (context === undefined) {
    throw new Error(`useSetting must be used within a SettingProvider`)
  }
  return context
}