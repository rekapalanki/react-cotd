import React from "react";
import { render } from "react-dom";
import "./css/style.css";
import StorePicker from "./components/StorePicker";
import App from "./components/App";
import Router from "./components/Router";

render(<Router />, document.getElementById("main"));
