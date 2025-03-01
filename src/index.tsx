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
import Test from "~/pages/Test";
import NormalView from "./layouts/NormalView";

render(
  () => (
    <GlobalProvider>
      <Router base="/app" root={RootLayout}>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={NormalView}>
          <Route path="/" component={Home} />
          <Route path="/test" component={Test} />
        </Route>
      </Router>
    </GlobalProvider>
  ),
  document.getElementById("root") as HTMLElement,
);
