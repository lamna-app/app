/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";

import RootLayout from "~/layout/Root";
import Home from "~/pages/Home";
import WebsocketProvider from "./libs/WebsocketProvider";

render(
  () => (
    <WebsocketProvider>
      <Router base="/app" root={RootLayout}>
        <Route path="/" component={Home} />
      </Router>
    </WebsocketProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
