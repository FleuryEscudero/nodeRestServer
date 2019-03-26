var express = require('express');
var app = express ();
const User = require ('../models/user.models');
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');
//constantes google signin
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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



/**
 * CONFIGURACIONES DE GOOGLE
 */


async function verify( authorization) {
    const ticket = await client.verifyIdToken({
        idToken: authorization,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
  //verify().catch(console.error);

    app.post('/google/', async (req,res)=>{
        let authorization = req.body.authorization;

        let gooleUser = await verify(authorization)
        .catch( e =>{
             return res.status(403).json({
                ok: false,
                err: e
            });
        });

        User.findOne( { email: gooleUser.email}, (err, userDb)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( userDb ) {

                if(userDb.google === false){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe de usar su autenticacion normal'
                        }
                    });

                }else {
                    let authorization = jwt.sign({
                        user:userDb
                    }, process.env.SEED_SIGN, { expiresIn: process.env.CADUCIDAD_TOKEN});  

                    return res.json({
                        ok:true,
                        user: userDb,
                        authorization
                    })

                }

            }else {
                //si el usuario no existe en nuestra base de datos.
                let user = new User();
                user.name = gooleUser.name;
                user.email = gooleUser.email;
                user.img = gooleUser.img;
                user.google = true;
                user.password = ':)';

                user.save((err, userDb)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let authorization = jwt.sign({
                        user:userDb
                    }, process.env.SEED_SIGN, { expiresIn: process.env.CADUCIDAD_TOKEN});  

                    return res.json({
                        ok:true,
                        user: userDb,
                        authorization
                    });
                })
            }

        })
    });


    

    
    module.exports = app;
    