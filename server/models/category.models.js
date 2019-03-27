/**
 * Modelo de Datos de  Categoria
 */

 'use strict'

 var mongoose = require ('mongoose');
 var Schema = mongoose.Schema;

 let categorySchema = new Schema ({
     description:{
         type:String,
         unique: true,
         required: [true,'La descripcion es obligatoria']},
         user: {type: Schema.Types.ObjectId, ref: 'User'},
         status: {
             type: Boolean, 
             default: true}
 })

 module.exports = mongoose.model('Category',categorySchema);