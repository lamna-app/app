/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";

import RootLayout from "~/layouts/Root";

import "@fontsource/noto-sans";

import { invoke } from "@tauri-apps/api/core";

import Home from "~/pages/Home";
import Test from "~/pages/Test";

invoke("run_websocket");
render(
  () => (
    <Router root={RootLayout}>
      <Route path="/test" component={Test} />
      <Route path="/" component={Home} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
