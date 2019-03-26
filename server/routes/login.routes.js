var express = require('express');
var app = express ();
const User = require ('../models/user.models');
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');

    app.post('/login/', (req,res)=>{
        let body = req.body
      
       User.findOne({email: body.email.toLowerCase()}, (err,userDb )=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if(!userDb){
                    return res.status(400).json({
                    ok: false,
                    err: {
                        message:'El usuario o contraseñas incorrectos'
                        }
                    });
                }

               if (bcrypt.compareSync(body.password,userDb.password )) {
                    res.status(400).json({
                        ok: false,
                        err: {
                            message:'El usuario o contraseñas incorrectos'
                        }
                    });
                }
                    let token = jwt.sign({
                        user:userDb
                    }, process.env.SEED_SIGN, { expiresIn: process.env.CADUCIDAD_TOKEN});
                    res.json({
                        ok:true,
                        user:userDb,
                        token
                    });
        });
    });



    
    module.exports = app;
    