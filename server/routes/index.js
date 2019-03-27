/**
 * Configuracion de rutas
 */

var express = require('express');
var app = express ();


app.use(require('./user.routes'));
app.use(require('./login.routes'));
app.use(require('./category.routes'));

module.exports = app;