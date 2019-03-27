/**
 * Verificar Token
 */


'use strict'

var jwt = require('jsonwebtoken');

exports.ensureAuth = (req, res, next) => {

    let Authorization = req.get('Authorization');
    jwt.verify(Authorization, process.env.SEED_SIGN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

}

exports.validateRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'adminRole') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });
    }


}