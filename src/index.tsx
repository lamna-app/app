/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import "./index.css";

import Home from "./Home";
import RootLayout from "./layout/Root";
import Test from "./Test";

render(
    () => (
        <Router root={RootLayout}>
            <Route path="/" component={Home} />
            <Route path="/test" component={Test} />
        </Router>
    ),
    document.getElementById("root") as HTMLElement,
);
