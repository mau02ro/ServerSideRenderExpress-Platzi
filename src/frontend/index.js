import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import reducer from "./reducers/index.js";

// server render
import { Router } from "react-router";
import { createBrowserHistory } from "history";

/*____ Container ____*/
import App from "./routes/App";

const history = createBrowserHistory();
const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, preloadedState, composeEnhancers());

delete window.__PRELOADED_STATE__;

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);
