/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";
import "@fontsource/noto-sans";

import RootLayout from "~/layouts/Root";
import GlobalProvider from "~/libs/GlobalProvider";
import Home from "~/pages/Home";
import Login from "~/pages/Login";
import Signup from "~/pages/Signup";

render(
  () => (
    <GlobalProvider>
      <Router base="/app" root={RootLayout}>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Router>
    </GlobalProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
