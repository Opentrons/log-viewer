import * as React from "react"
import { Provider } from "react-redux"

import { AppContainer } from "@/molecules/AppContainer"
import { FileSidebar } from "@/organisms/FileSidebar"
import { MainWindow } from "@/organisms/MainWindow"
import { store } from "@/redux/store"
import { api } from "@/remote/api"

export function App(): React.ReactNode {
  api.registerDispatch(store.dispatch)
  api.setUiStatus("ready")
  return (
    <Provider store={store}>
      <AppContainer>
        <FileSidebar />
        <MainWindow />
      </AppContainer>
    </Provider>
  )
}
