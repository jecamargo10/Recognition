const express = require("express");
const router = express.Router();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const User = require("../models/user_model");
const config = require("../config/database");

const sendGridCredentials = require("../config/sendgrid");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(sendGridCredentials.apiKey);

router.post("/register", (req, res, next) => {
    const pw = randomstring.generate(7);
    let token = randomstring.generate(10);
    let newUser = new User({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: req.body.password,
        telefono: req.body.telefono
    });
    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg:'Error al registrar el usuario'});
        } else {
            let email = req.body.email;
            const msg = {
                to: req.body.email,
                from: 'notificaciones@mundiapp.com',
                subject: 'Bienvenido a Mundiapp!',
                html: 'Bienvenido a Mundiapp'
            };
            const sendEmail = sendgrid.send(msg);
            sendEmail.then(function () {
            }).catch(function () {
            });
            res.json({success: true, msg:'Usuario registrado: ', user: newUser});
        }
    });
});

router.post("/forgot", (req, res, next) => {
    const email = req.body.email;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: "Usuario no encontrado"});
        }
        const token = randomstring.generate(10);
        const expiry = moment().add(1, 'days');

        User.findOneAndUpdate({email: email}, {forgotToken: token, forgotTokenExpiry: expiry}, {upsert:true}, function(err, doc){
            if(err) throw err;
            const msg = {
                to: req.body.email,
                from: 'notificaciones@mundiapp.com',
                subject: 'Reestablecer contraseña',
                html: '<a href="http://localhost:4200/#/reset/'+ email +'/'+ token +'" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Resetear Contraseña</a> '
            };
            const sendEmail = sendgrid.send(msg);
            sendEmail.then(function () {
            }).catch(function () {
            });
            return res.json({success: true, msg: "Token created successfully"});
        });
    });
});

router.post("/reset", (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: "User not found"});
        }
        
        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(pass, salt, (err, hash) => {
                if(err) throw err;
                User.findOneAndUpdate({email: email}, {password: hash}, {upsert:true}, function(err, doc){
                    if(err) throw err;
                    const msg = {
                        to: req.body.email,
                        from: 'notificaciones@mundiapp.com',
                        subject: 'Se ha reestablecido la contraseña',
                        html: 'Se ha reestablecido la contraseña'
                    };
                    const sendEmail = sendgrid.send(msg);
                    sendEmail.then(function () {
                    }).catch(function () {
                    });
                    return res.json({success: true, msg: "Password updated successfully"});
                });
            })
        });
    });
});

router.post("/authenticate", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: "Usuario no encontrado"});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id, 
                        email: user.email, 
                        nombres: user.nombres, 
                        apellidos: user.apellidos, 
                        telefono: user.telefono
                    }
                })
            } else {
                return res.json({success: false, msg: "Contraseña incorrecta"});
            }
        });
    });
});

module.exports = router;