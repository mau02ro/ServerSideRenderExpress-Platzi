# Server Side Render con Express

- [¿Qes es server side rendering?](#Qes-es-server-side-rendering)
- [¿Qes es client side rendering?](#Qes-es-server-client-rendering)
- [¿Por que usar server side render?](#¿Por-que-usar-server-side-render?)
- [Configurando el entorno de desarrollo](#Configurando-el-entorno-de-desarrollo)
- [Configurando básica del server para servir el html](#Configurando-básica-del-server-para-servir-el-html)
- [Configurando React Router y Redux](#Configurando-React-Router-y-Redux)
  - [Router](#Router)
    - [Definir rutas para ser servidas desde el lado del servidor](#Definir-rutas-para-ser-servidas-desde-el-lado-del-servidor)
  - [Cargar los assets](#Cargar-los-assets)
  - [Redux](#Redux)
    - [Hidratar el state inicial Redux](#Hidratar-el-state-inicial-Redux)
    - [Seguridad](#Seguridad)

## ¿Que es client side rendering?

Es el rendering que sucede un una aplicación básica de ReactJS, básicamente tenemos un archivo que contiene nuestra aplicación y lo tenemos que descargar del lado del cliente/navegador, despues que se descarga el archivo es que nuestra aplicación va hacer ejecutable.

## ¿Que es server side rendering?

El server side render es básicamente cuando el servidor envía una respuesta pero antes de que se empieza a descargar los archivos el servidor envía en pre-renderizado de la aplicación, el toma toda la opilación la renderiza en un string y la vuelve un html este html se inserta un la primera respuesta.Luego el navegador en pararalelo va descargando los archivos. Luego de que se descargan los archivos se inserta react, todos los eventos y el usuario ya puede interactuar con el sito.

### ¿Por que usar server side render?

Primera carga es mas rápida: Debido a que ya esta pre-renderizada la aplicación y luego hidrata el contenido necesario.
Mejor SEO:como estamos enviando un html los motores de búsqueda ya tienen contenido para poder indexar nuestro sitio.
Look & Feel: el usuario puede empezar a interactuar mucho mas rápido con la aplicación.

## Configurando el entorno de desarrollo

Configuración para que nuestro proyecto se compile en tiempo real.

- **1.** Configuramos el webpack-dev-middleware y el webpack-hot-middleware para crear un compilador, para poder pasarle esto a nuestra aplicación de express para que pueda refrescar en tiempo real.

```
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
```

- **2.** Configurar babel para que indique a la react-hot-loader que con la configuración de babel (react-hot-loader/babel) que debe refrescar y aplicar todo tipo de cambios.

```
{
 "plugins": ["react-hot-loader/babel"]
}
```

## Configurando básica del server para servir el html

```
app.get("*", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>PlatziVideo</title>

      <link rel="assets/main.css" type="text/css>
    </head>
    <body>
      <div id="app"></div>
      <script src="assets/app.js" type="text/javascript" ></script>
    </body>
</html>
  `);
});
```

**Nota:**
La manera mas fácil de comprobar si estamos haciendo server rendering es des habilitar el js _Settings/Preferences/Debugger_

## Configurando React Router y Redux

### Router

```
npm i history react-router-config
```

_El history nos permite crear un historial al enrutador que estamos definiendo y react-router-config nos permite agregar ciertas capas de configuración al enrutador que estamos usando._

```
#Index del proyecto de react
import { Router } from "react-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
)
```

#### Definir rutas para ser servidas desde el lado del servidor

Creamos las rutas para ser utilizadas en nuestro server, especificando un array en el cual le pasamos objetos de las rutas con sus propiedades.

```
import Home from "../containers/Home";
import NotFound from "../containers/NotFound";

const routes = [
  {
    exact: true,
    path: "/",
    component: Home,
  },
  {
    name: "NotFound",
    component: NotFound,
  },
  ...
];

export default routes;
```

Modificamos el server para que pueda rendereizar la aplicación.

```
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

//Creamos una responder el html
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

//Cramos uns funcion para renderizar rederizar la aplicación
const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  #La funcion renderTOString devuelve un html de nuestra aplicación renderizada
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
```

## Cargar los assets

Un _require_ obligatorio para importar archivos de activos durante el tiempo de ejecución. cualquier archivo que este alojado estáticamente debemos agregarlo con [asset-require-hook.](https://www.npmjs.com/package/asset-require-hook)

```
npm i assets-react-hoook
```

```
require("asset-require-hook")({
  extensions: ["jpg", "png", "gif"],
  name: "/assets/[hash].[ext]",
});
```

_Este paquete hoy (20 de julio de 2020) tienen problemas con file-loader@6, ajustar a fili-loader@5.1_

## Redux

### Hidratar el state inicial Redux

Primero debemos obtener el state de store creado en el server, para inyectar en el html el initialState de la aplicación, ver [Redux server side rendering](https://redux.js.org/recipes/server-rendering)

```
const setResponse = (html, preloadedState) => {
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
         <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // https://redux.js.org/recipes/server-rendering/#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            "\\u003c"
          )}
        </script>
        <script src="assets/app.js" type="text/javascript" ></script>
      </body>
    </html>
  `;
};

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState));
};
```

Luego en la aplicación de react obtenemos el preloadedState y se lo pasamos al createStore.

```
const preloadedState = window.__PRELOADED_STATE__;
const store = createStore(reducer, preloadedState, composeEnhancers());

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("app")
);

```

### Seguridad

Si vamos a la consola y colocamos window.\_**\_PRELOADED_STATE\_\_** podemos acceder a el estado de la aplicación y esto es un hueco de seguridad, para solucionarlo es muy sencillo después de definir el preloadedState y el store lo único que debemos hacer es un delete del window.\_**\_PRELOADED_STATE\_\_**

```
const preloadedState = window.__PRELOADED_STATE__;
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
```
