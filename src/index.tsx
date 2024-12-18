/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";

import RootLayout from "~/layout/Root";
import WebsocketProvider from "~/libs/WebsocketProvider";
import Home from "~/pages/Home";

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
