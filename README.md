# Server Side Render con Express

-[¿Qes es server side rendering?](#Qes-es-server-side-rendering)

-[¿Qes es client side rendering?](#Qes-es-server-client-rendering)

-[¿Por que usar server side render?](#¿Por-que-usar-server-side-render?)

# ¿Que es client side rendering?

Es el rendering que sucede un una aplicación básica de ReactJS, básicamente tenemos un archivo que contiene nuestra aplicación y lo tenemos que descargar del lado del cliente/navegador, despues que se descarga el archivo es que nuestra aplicación va hacer ejecutable.

# ¿Que es server side rendering?

El server side render es básicamente cuando el servidor envía una respuesta pero antes de que se empieza a descargar los archivos el servidor envía en pre-renderizado de la aplicación, el toma toda la opilación la renderiza en un string y la vuelve un html este html se inserta un la primera respuesta.Luego el navegador en pararalelo va descargando los archivos. Luego de que se descargan los archivos se inserta react, todos los eventos y el usuario ya puede interactuar con el sito.

## ¿Por que usar server side render?

Primera carga es mas rápida: Debido a que ya esta pre-renderizada la aplicaion y luego hidrata el contenido necesario.
Mejor SEO:como estamos enviando un html los metores de busqueda ya tienen contenido para poder indexar nuestro sitio.
Look & Feel: el usuario puede empezar a interactuar mucho mas rapido con la aplicación.
