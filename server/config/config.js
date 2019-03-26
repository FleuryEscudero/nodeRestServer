/**
 * configuracion Global
 */
'use strict'
 /**
  * Puerto
  */
 process.env.PORT= process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

 /**
  * DB
  */


 var mongoose = require ('mongoose');

 let urlDB;
 

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/curso'
} else {
    urlDB = 'mongodb+srv://fly:Escudero@cluster0-wtloj.mongodb.net/cafe'
}

 mongoose.connect(urlDB, { useNewUrlParser: true,  useCreateIndex: true })
 
     .then (() => {
     console.log ('La conexion a MongoDb se ha realizado correctamente!');
     })
     .catch(err => console.log(err));


     