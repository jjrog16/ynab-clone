import React from "react";
import ReactDOM from "react-dom";
import "../src/styles/css/index.css";
import App from "./App";
import { createStore, combineReducers } from "redux";
import rootReducer from "./reducers";

const store = createStore(
  rootReducer
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
