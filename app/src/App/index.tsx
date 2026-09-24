import * as NiceModal from "@ebay/nice-modal-react"
import * as React from "react"
import * as ReactRedux from "react-redux"

import { I18nContext, I18N_DATETIME_SPEC, buildFormatter } from "@/i18n"
import { AppContainer } from "@/molecules/AppContainer"
import { FileSidebar } from "@/organisms/FileSidebar"
import { LogDetailSidebar } from "@/organisms/LogDetailSidebar"
import { MainWindow } from "@/organisms/MainWindow"
import { store } from "@/redux/store"
import { api } from "@/remote/api"

export function App(): React.ReactNode {
  api.registerDispatch(store.dispatch)
  api.setUiStatus("ready")
  return (
    <ReactRedux.Provider store={store}>
      <NiceModal.Provider>
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
            <LogDetailSidebar />
          </I18nContext>
        </AppContainer>
      </NiceModal.Provider>
    </ReactRedux.Provider>
  )
}
