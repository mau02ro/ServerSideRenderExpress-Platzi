import express from "express";
import dotenv from "dotenv";
//render
import webpack from "webpack";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { StaticRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import reducer from "../frontend/reducers/index";
import { initialState } from "../frontend/initialState";
import { routes } from "../frontend/routes/serverRoutes";

dotenv.config();

const { ENV, PORT } = process.env;

const app = express();

if (ENV === "development") {
  console.log("Loading dev config");
  const webpackConfig = require("../../webpack.config");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const compiler = webpack(webpackConfig);
  const serverConfig = {
    contentBase: `http://localhost${PORT}`,
    port: PORT,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: { colors: true },
  };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
}

const setResponse = (html) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PlatziVideo</title>

        <link rel="stylesheet" href="assets/main.css" type="text/css" >
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="assets/app.js" type="text/javascript" ></script>
      </body>
    </html>
  `;
};

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html));
};

app.get("*", renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`http://localhost:${PORT}`);
});
