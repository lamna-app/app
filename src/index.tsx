/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";
import "@fontsource/noto-sans";

import RootLayout from "~/layouts/Root";
import Home from "~/pages/Home";

render(
  () => (
    <Router base="/app" root={RootLayout}>
      <Route path="/" component={Home} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
