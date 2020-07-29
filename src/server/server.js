import express from "express";
import dotenv from "dotenv";
import webpack from "webpack";
import renderApp from "./routes";

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

app.get("*", renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`http://localhost:${PORT}`);
});
