var express = require('express');
var router = express.Router();
var app = require('../db.js');
var crypto = require("crypto");

//　新規登録のページを表示
router.get('/', function (req, res, next) {
    res.render('newuser');
});

//　登録処理
router.post('/register', function (req, res, next) {
    var name = req.body.name;
    var pass = req.body.pass;

    // パスワードをハッシュ化
    var cipher = crypto.createCipher('aes192', pass);
    var cipheredPass = cipher.final('hex');

    var query = 'INSERT INTO users (name, pass) VALUES ("' + name + '", ' + '"' + cipheredPass + '")';
    app.connection.query(query, function (err, rows) {
        res.redirect('/');
    });
});

module.exports = router;