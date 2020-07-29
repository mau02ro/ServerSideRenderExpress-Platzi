# Server Side Render con Express

- [¿Qes es server side rendering?](#Qes-es-server-side-rendering)

- [¿Qes es client side rendering?](#Qes-es-server-client-rendering)

- [¿Por que usar server side render?](#¿Por-que-usar-server-side-render?)

# ¿Que es client side rendering?

Es el rendering que sucede un una aplicación básica de ReactJS, básicamente tenemos un archivo que contiene nuestra aplicación y lo tenemos que descargar del lado del cliente/navegador, despues que se descarga el archivo es que nuestra aplicación va hacer ejecutable.

# ¿Que es server side rendering?

El server side render es básicamente cuando el servidor envía una respuesta pero antes de que se empieza a descargar los archivos el servidor envía en pre-renderizado de la aplicación, el toma toda la opilación la renderiza en un string y la vuelve un html este html se inserta un la primera respuesta.Luego el navegador en pararalelo va descargando los archivos. Luego de que se descargan los archivos se inserta react, todos los eventos y el usuario ya puede interactuar con el sito.

## ¿Por que usar server side render?

Primera carga es mas rápida: Debido a que ya esta pre-renderizada la aplicaion y luego hidrata el contenido necesario.
Mejor SEO:como estamos enviando un html los metores de busqueda ya tienen contenido para poder indexar nuestro sitio.
Look & Feel: el usuario puede empezar a interactuar mucho mas rapido con la aplicación.

# Configurando el entorno de desarrollo

Configuracion para ra que nuestro proyecto se compile en tiempo real.

- **1.**Configuramos el webpack-dev-middleware y el webpack-hot-middleware para crear un compilador, para poder paserle esto a nuestra aplicacion de express para que pueda refrescar en tiempo real.

```
if (ENV === "development") {
  #Development config

  const webpackConfig = require("../../webpack.config");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const compiler = webpack(webpackConfig);
  const webpackServerConfig = {
    port: PORT,
    hot: true,
  };

  app.use(webpackDevMiddleware(compiler, webpackServerConfig));
  app.use(webpackHotMiddleware(compiler));
}
```

- **2.** Configurar babel para que indique a la react-hot-loader que con la configuracion de babel (react-hot-loader/babel) que debe refrescar y aplicar todo tipo de cambios.

```
{
 "plugins": ["react-hot-loader/babel"]
}
```

# Configurando webpack y el server para servir el html

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
La manera mas facil de comprobar si estamos haciendo server rendering es desabilitar el js _Settings/Preferences/Debugger_

# Configurando React Router y redux

## Router

```
npm i history react-router-config
```

_El history nos pemrite crear un historial al enrutador que estamos definiendo y react-router-config nos permite agregar ciaertas capas de configuración al enrutador que estamos usando_

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

**Definir rutas para ser servidas desde el lado del servidor**

Creamos las rutas para ser utilizadas en nuestro server, especificando un aarray en el cual le pasamos objetos de las rutas consus propiedades.

```
#En las carpeta routes de react
import Home from "../containers/Home";
import Login from "../containers/Login";
import Register from "../containers/Register";
import NotFound from "../containers/NotFound";
import Player from "../containers/PLayer";

const routes = [
  {
    exact: true,
    path: "/",
    component: Home,
  },
  {
    exact: true,
    path: "/login",
    component: Login,
  },
  {
    exact: true,
    path: "/register",
    component: Register,
  },
  {
    exact: true,
    path: "/player/:id",
    component: Player,
  },
  {
    name: "NotFound",
    component: NotFound,
  },
];

export default routes;
```

Modificamos el server para que pueda rendereizar la aplicación.

```
#En el server
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

#Creamos una responder el html
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

#Cramos uns funcion para renderizar rederizar la aplicación
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

**Cargar los assets**

Un _require_ obligatorio para importar archivos de activos durante el tiempo de ejecución. cualquier archivo que este alojado estaticamente devemos agregarlo con [asset-require-hook.](https://www.npmjs.com/package/asset-require-hook)

```
npm i assets-react-hoook
```

```
require("asset-require-hook")({
  extensions: ["jpg", "png", "gif"],
  name: "/assets/[hash].[ext]",
});
```

este paquete hoy (20 de julio de 2020) tinen problemas con file-loader@6, ajustar a fili-loader@5.1
