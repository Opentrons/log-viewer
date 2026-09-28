import { StrictMode } from "react"
import ReactDom from "react-dom/client"

import "./global"
import { PDF } from "./PDF"
const container = document.getElementById("root")
const root = ReactDom.createRoot(container!)
root.render(
  <StrictMode>
    <PDF />
  </StrictMode>,
)
