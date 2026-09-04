import * as React from "react"
import { Provider } from "react-redux"

import { I18nContext, I18N_DATETIME_SPEC, buildFormatter } from "@/i18n"
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
        <I18nContext
          value={{
            dateFormatter: {
              format: buildFormatter(new Intl.DateTimeFormat(undefined, I18N_DATETIME_SPEC)),
            },
          }}
        >
          <FileSidebar />
          <MainWindow />
        </I18nContext>
      </AppContainer>
    </Provider>
  )
}
