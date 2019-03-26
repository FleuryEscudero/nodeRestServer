/**
 * Modelo de Datos
 */
'use strict'

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;

let validRole = {
    values: ['adminRole','userRole'],
    message: '{VALUE} no es un rol valido'
}

 var userSchema = new Schema ({
                                name:{
                                    type: String,
                                    required: [true, 'El nombre es obligatorio']
                                },
                                email: {
                                    type: String,
                                    //para validar datos unicos poner unique.
                                    unique: true,
                                    required: [true,'El correo es obligatorio']
                                },
                                password: {
                                    type: String,
                                    required: [true,'La contraseña es obligatoria']
                                },
                                img: {
                                    type: String,
                                   
                                },
                                role: {
                                    type: String,
                                    required: [true,'El perfil es obligatorio'],
                                    default: 'userRole',
                                    //para validar datos esperados dentro de la db.
                                    enum: validRole
                                },
                                estado: {
                                    type: Boolean,
                                    default: true
                                },
                                google: {
                                    type: Boolean,
                                    default: false
                                }

 }); 


 /**
  * Para quitar la contraseña en el retorno de informacion de guardado.
  */
 
 userSchema.methods.toJSON = function() {
     let user = this;
     let userObject = user.toObject();
     delete userObject.password;
     return userObject;
 }

 userSchema.plugin(uniqueValidator, {
     message: '{PATH} debe de ser unico'
 });

 module.exports = mongoose.model('User',userSchema);