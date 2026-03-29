/* @refresh reload */
import { render } from "solid-js/web"
import { Route, Router } from "@solidjs/router"

import App from "./App"

render(
  () => (
    <Router base="/app">
      <Route path="/" component={App} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)
