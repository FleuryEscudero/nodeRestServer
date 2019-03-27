var express = require('express');
var bcrypt = require('bcrypt');
var _ = require('underscore');
const User = require('../models/user.models');
var {
    ensureAuth,
    validateRole
} = require('../middlewares/authentication');
var app = express();

app.get('/getUser', ensureAuth, (req, res) => {

    /**
     * Para limitar la paginacion se pusieron parametros opcionales por ejemplo el since que se pone en la url con un
     * signo de interrogacion ? ya que son opcionales y puedes paginar la busqueda!
     */
    let since = req.query.since || 0;
    let limit = req.query.limit || 5;
    since = Number(since);
    limit = Number(limit);
    /**
     * para filtrar la informacio nque regresa el get del api se manda un segundo parametro en forma string donde se pone
     * el nombre de los campos que queremos mostrar dentro de la respuesta de la consulta
     */
    User.find({
            estado: true
        }, 'name email')
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({
                estado: true
            }, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    users,
                    count
                })

            });
        })
})

app.post('/addUser', [ensureAuth, validateRole], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        //para encriptar la contraseña de forma sincrona
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            user: userDb
        })
    })
});


app.put('/updateUser/:id', [ensureAuth, validateRole], (req, res) => {
    let id = req.params.id;
    /**
     * pick de la funcion underscore nos sirve para seleccionar de un objeto los valores que quiero ocupar en este caso
     * para actualizarlos dentro del body que es el objeto del usuario.
     */
    let body = _.pick(req.body, ['name', 'email', 'role', 'estado']);



    /**
     * para regresar valores nuevos se pone el objeto de opciones que es el 3 parametro y pones la validacion new:true para traer el nuevo dato
     * 
     */
    User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDb) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            user: userDb
        });

    })
})

app.delete('/deleteUser/:id', [ensureAuth, validateRole], (req, res) => {
    let id = req.params.id;
    let cStatus = {
        estado: false
    }
    //User.findByIdAndDelete(id,(err,userDeleted)=>{
    User.findByIdAndUpdate(id, cStatus, {
        new: true
    }, (err, userDeleted) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDeleted) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'El usuario no ha podido ser borrado ya que no existe'
                }
            })
        }
        res.json({
            ok: true,
            user: userDeleted
        });
    });
});


module.exports = app;