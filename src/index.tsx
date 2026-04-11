/* @refresh reload */

import { Route, Router } from "@solidjs/router"
import { render } from "solid-js/web"

import "./App.css"

import HomeLayout from "./layouts/HomeLayout"
import RootLayout from "./layouts/RootLayout"
import Channel from "./pages/Channel"
import Debug from "./pages/Debug"
import Invite from "./pages/Invite"
import Login from "./pages/Login"

render(
  () => (
    <Router base="/" root={RootLayout}>
      <Route path="/login" component={Login} />

      <Route path="/" component={HomeLayout}>
        <Route path="/" component={Debug} />
        <Route path="/channels/:guildID" component={Channel} />
        <Route path="/channels/:guildID/:channelID" component={Channel} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
)
