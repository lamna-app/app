/* @refresh reload */
import { render } from "solid-js/web"
import { Route, Router } from "@solidjs/router"

import App from "./App"
import HomeLayout from "./layouts/HomeLayout"
import RootLayout from "./layouts/RootLayout"

render(
  () => (
    <Router base="/app" root={RootLayout}>
      <Route path="/" component={HomeLayout}>
        <Route path="/" component={App} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)
