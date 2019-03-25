
var express = require('express');
var app = express ();
const User = require ('../models/user.models');

    app.get('/getUser', (req,res)=>{
        res.status(200).send({ menssage:'Esta ruta es de prueba en mi api restful con mongo y node'});
    })

    app.post('/addUser', (req,res)=>{
        
        let body = req.body;

        let user = new User({
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role 
        });

        user.save((err, userDb)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user:userDb
            })
        })
    });

    app.put('/updateUser/:id', (req,res)=>{
        let id = req.params.id 
        res.status(200).json({ id, menssage:'put Usuario'});
    })

    app.delete('/deleteUser/:id', (req,res)=>{
        let id = req.params.id 
        res.status(200).json({ menssage:'delete Usuario'});
    })


module.exports = app;