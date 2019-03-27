

var express = require('express');
const fileUpload = require('express-fileupload');
var app = express ();

/**
 * Middleware que transforma el archivo  a un objeto llamado files
 */
//default options
app.use(fileUpload());

    app.put('/uploadImage',(req,res)=>{
        if (Object.keys(req.files).length == 0) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No subio el archivo'
                }
            });
        }

        let img = req.files.archive;

        img.mv('./uploads/filename.jpg', (err) =>{
            if (err)
              return res.status(500).json({
                  ok: false,
                  err 
                });
        
            res.json({
                ok:true,
                message: 'Exito subio la imagen'
            });
          });

    })



module.exports = app;