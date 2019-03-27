var express = require('express');
var _ = require('underscore');
const Product = require('../models/products.models');
var {
    ensureAuth
} = require('../middlewares/authentication');
var app = express();


app.get('/products', ensureAuth, (req, res) => {
    let since = req.query.since || 0;
    let limit = req.query.limit || 25;
    since = Number(since);
    limit = Number(limit);
    Product.find({
            available: true
        })
        .skip(since)
        .limit(limit)
        .sort('category.description')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            })
        })
})

app.get('/product/:id', ensureAuth, (req, res) => {

    let id = req.params.id;
    Product.findById(id, {
            available: true
        })
        .populate('user', ' name email')
        .populate('category', 'description')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product
            })
        })
})

app.get('/products/search/:term', ensureAuth, (req, res) => {
    let term = req.params.term;
    /**
     * Busqueda por parametro de nombre en este caso utilziando una expresion regular en el 
     * nombre y exluyendo mayusculas y minusculas
     */
    let regex = new RegExp(term, 'i');

    Product.find({
            name: regex,
            available: true
        })
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            })
        })
})

app.post('/product', ensureAuth, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            product: productDb
        })
    })


})


app.put('/updateProduct/:id', ensureAuth, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'description', 'unitPrice']);
    Product.findByIdAndUpdate(id, body, {
        new: true
    }, (err, productDb) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: productDb
        });
    })
})

app.delete('/deleteProduct/:id', ensureAuth, (req, res) => {
    let id = req.params.id;
    let nAvailable = {
        available: false
    };

    Product.findByIdAndUpdate(id, nAvailable, {
        new: true
    }, (err, productDeleted) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDeleted) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'El Articulo no ha podido ser borrado ya que no existe'
                }
            })
        }
        res.json({
            ok: true,
            product: productDeleted
        });
    })
})

















module.exports = app;