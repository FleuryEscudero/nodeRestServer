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
 process.env.CADUCIDAD_TOKEN = '48h';

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

/**
 * google Client Id
 */

process.env.CLIENT_ID = process.env.CLIENT_ID  || '52030871120-s2esnnhujfn5afjfodf1auu7daf2por0.apps.googleusercontent.com';


/**
 * Conexion base de datos
 */

 mongoose.connect(urlDB, { useNewUrlParser: true,  useCreateIndex: true })
 
     .then (() => {
     console.log ('La conexion a MongoDb se ha realizado correctamente!');
     })
     .catch(err => console.log(err));


     