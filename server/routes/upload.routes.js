var express = require('express');
const fileUpload = require('express-fileupload');
var app = express();
const User = require('../models/user.models.js');
const fs = require('fs');
const path = require('path');
/**
 * Middleware que transforma el archivo  a un objeto llamado files
 */
//default options
app.use(fileUpload());

app.put('/uploadImage/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No subio el archivo'
            }
        });
    }


    //Validar tipo

    let types = ['products', 'users'];
    if (types.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'el tipo de carga no es valido'
            }
        })
    }

    let img = req.files.archive;
    let fileName = img.name.split('.');
    let ext = fileName[fileName.length - 1];


    //Extensiones permitidas
    let validExt = ['png', 'jpg', 'jpeg'];

    if (validExt.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no tiene una extension valida ' + validExt.join(', ')
            }
        })
    }


    //cambiar nombre del archivo

    let nArchive = `${id}-${new Date().getMilliseconds()}.${ext}`;

    img.mv(`./uploads/${type}/${nArchive}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //ya esta cargada la imagen

        if (type === 'users') {
            userImage(id, res, nArchive);
        } else {
            productImage(id, res, nArchive);
        }

    });

})

function userImage(id, res, nArchive) {
    User.findById(id, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {

            deleteFile(nArchive, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        deleteFile(userDB.img, 'users')

        userDB.img = nArchive;
        userDB.save((err, userStored) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userStored
            })

        })

    })

}

function productImage(id, res, nArchive) {

    Product.findById(id, (err, productDB) => {

        if (err) {
            deleteFile(nArchive, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {

            deleteFile(nArchive, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuaro no existe'
                }
            });
        }

        deleteFile(productDB.img, 'productos')

        productDB.img = nArchive;

        productDB.save((err, productStored) => {

            res.json({
                ok: true,
                producto: productStored,
                img: nArchive
            });

        });


    });


}


function deleteFile(nArchive, type) {

    let imagePath = path.resolve(__dirname, `../../uploads/${ type }/${ nArchive }`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }


}

module.exports = app;