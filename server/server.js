/**
 * pruebas de api rest para los diferentes tipos de peticiones get,post,put,delete
 */
/*
app.get('/pruebas', (req,res)=>{
    res.status(200).send({ menssage:'Esta ruta es de prueba en mi api restful con mongo y node'});
})

app.post('/pruebasPost', (req,res)=>{

    let body = req.body
    res.status(200).json({ body, menssage:'post Usuario'});
})

app.put('/pruebasPut/:id', (req,res)=>{
    let id = req.params.id 
    res.status(200).json({ id, menssage:'put Usuario'});
})

app.delete('/pruebasDelete/:id', (req,res)=>{
    let id = req.params.id 
    res.status(200).json({ menssage:'delete Usuario'});
})
*/

'use strict'

require ('./config/config');
var express = require('express');
var cors =require ('cors');
var app = express ();
var bodyParser = require ('body-parser');


//configurar CORS
app.use(cors());

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//rutas base


app.listen(process.env.PORT, () => {
    console.log (`El servidor esta corriendo en localhost:${process.env.PORT}`);
    })

module.exports = app;
