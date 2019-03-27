/**
 * Configuracion Global
 */

'use strict'


require('./config/config');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

/**
 * #FlyQuotes no poner el body parser despues de cargar la ruta del express
 * si no, no carga la informacion del json.
 */
//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configurar express global de rutas
app.use(require('./routes/index'));

//configurar CORS
app.use(cors());

//rutas base

app.listen(process.env.PORT, () => {
    console.log(`El servidor esta corriendo en localhost:${process.env.PORT}`);
})