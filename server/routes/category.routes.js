var express = require('express');
var _ = require('underscore');
const Category = require('../models/category.models');
var {
    ensureAuth,
    validateRole
} = require('../middlewares/authentication');
var app = express();

app.get('/categories', ensureAuth, (req, res) => {
    Category.find({
            status: true
        })
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories
            })
        })
})


app.get('/category/:id', ensureAuth, (req, res) => {
    let id = req.params.id;
    Category.findById(id, {
            status: true
        })
        .populate('user', ' name email')
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                category
            })
        })
})

app.post('/addCategory', ensureAuth, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });
    category.save((err, categoryDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            caterory: categoryDb
        })
    })
})


app.put('/updateCategory/:id', ensureAuth, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['description']);

    Category.findByIdAndUpdate(id, body, {
        new: true
    }, (err, categoryDb) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: categoryDb
        });
    })
})


app.delete('/deleteCategory/:id', [ensureAuth, validateRole], (req, res) => {
    let id = req.params.id;
    let nStatus = {
        status: false
    };

    Category.findByIdAndUpdate(id, nStatus, {
        new: true
    }, (err, categoryDeleted) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDeleted) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'La Categoria no ha podido ser borrado ya que no existe'
                }
            })
        }
        res.json({
            ok: true,
            category: categoryDeleted
        });
    })
})





module.exports = app;