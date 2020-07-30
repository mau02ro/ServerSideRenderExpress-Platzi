import express from "express";
import dotenv from "dotenv";
import webpack from "webpack";
import renderApp from "./routes";
import helmet from "helmet";
import getManifest from "./getManifest";

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
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) {
      req.hashManifest = getManifest();
    }
    next();
  });
  //Configura la carpeta publica de nuestro bundle de webpack
  app.use(express.static(`${__dirname}/public`));
  //Aplicando Helmet
  app.use(helmet()); //todas las configuraciones pordefecto de htlmet
  app.use(helmet.permittedCrossDomainPolicies()); //activando Cross-Domain-Policies
  //Deshabilitar
  app.disable("x-powered-by");
}

app.get("*", renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`http://localhost:${PORT}`);
});
