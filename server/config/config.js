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
 * Vencimiento de token
 * 60 segundos * 60 min * 24 hrs * 30 dias
 */ 
 process.env.CADUCIDAD_TOKEN = 60*60*24*30;

/**
 * Seed sign
 */

process.env.SEED_SIGN = process.env.SEED_SIGN || 'devSeed';

 /**
  * DB
  */

 var mongoose = require ('mongoose');

 let urlDB;
 

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/curso'
} else {
    urlDB = process.env.MONGO_URI
}

 mongoose.connect(urlDB, { useNewUrlParser: true,  useCreateIndex: true })
 
     .then (() => {
     console.log ('La conexion a MongoDb se ha realizado correctamente!');
     })
     .catch(err => console.log(err));


     