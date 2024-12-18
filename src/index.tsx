/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "~/index.css";

import RootLayout from "~/layout/Root";
import Home from "~/pages/Home";

render(
    () => (
        <Router base="/app" root={RootLayout}>
            <Route path="/" component={Home} />
        </Router>
    ),
    document.getElementById("root") as HTMLElement,
);
