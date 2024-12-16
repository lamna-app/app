/* @refresh reload */
import "@fontsource/noto-sans";
import "~/index.css";

import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import RootLayout from "~/layouts/Root";
import Home from "~/pages/Home";
import Test from "~/pages/Test";

render(
  () => (
    <Router root={RootLayout}>
      <Route path="/test" component={Test} />
      <Route path="/" component={Home} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
