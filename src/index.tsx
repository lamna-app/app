/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";

import RootLayout from "~/layouts/Root";
import Home from "~/pages/Home";

import "@fontsource/noto-sans";

render(
  () => (
    <Router root={RootLayout}>
      <Route path="/" component={Home} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
