/**
 * Configuracion de rutas
 */

var express = require('express');
var app = express();


app.use(require('./user.routes'));
app.use(require('./login.routes'));
app.use(require('./category.routes'));
app.use(require('./product.routes'));
app.use(require('./upload.routes'));
app.use(require('./images.routes'));
module.exports = app;