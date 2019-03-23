/**
 * configuracion Global
 */
'use strict'
 /**
  * Puerto
  */
 process.env.PORT= process.env.PORT || 3000;


 /**
  * DB
  */

 var mongoose = require ('mongoose');
 
 mongoose.connect('mongodb://localhost:27017/musify', { useNewUrlParser: true })
 
     .then (() => {
     console.log ('La conexion a MongoDb se ha realizado correctamente!');
     })
     .catch(err => console.log(err));


     