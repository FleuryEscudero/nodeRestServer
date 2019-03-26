/**
 * Configuracion de rutas
 */

var express = require('express');
var app = express ();


app.use(require('./user.routes'));
app.use(require('./login.routes'));

module.exports = app;