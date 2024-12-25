/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";
import "@fontsource/noto-sans";

import RootLayout from "~/layouts/Root";
import GlobalProvider from "~/libs/GlobalProvider";
import Home from "~/pages/Home";

render(
  () => (
    <GlobalProvider>
      <Router base="/app" root={RootLayout}>
        <Route path="/" component={Home} />
      </Router>
    </GlobalProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
