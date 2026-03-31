/* @refresh reload */

import { Route, Router } from "@solidjs/router"
import { render } from "solid-js/web"

import "./App.css"

import HomeLayout from "./layouts/HomeLayout"
import RootLayout from "./layouts/RootLayout"
import Channel from "./pages/Channel"
import Debug from "./pages/Debug"
import Login from "./pages/Login"

render(
  () => (
    <Router base="/app" root={RootLayout}>
      <Route path="/login" component={Login} />
      <Route path="/" component={HomeLayout}>
        <Route path="/" component={Debug} />
        <Route path="/channels/:guildID/:channelID" component={Channel}></Route>
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)
