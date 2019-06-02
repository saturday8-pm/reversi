var express = require('express');
var router = express.Router();
var app = require('../db.js');
var crypto = require("crypto");

// ログインページを表示
router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {

    //　入力した値を取得
    var name = req.body.name;
    var pass = req.body.pass;
    var nameExistsQuery = 'SELECT * FROM users WHERE name = "' + name + '" LIMIT 1';

    // ユーザー名で検索
    app.connection.query(nameExistsQuery, function (err, row) {
        // var nameExists = name.length;
        console.log(row);
        if (row.length == 0) {
            res.render('login', {
                passMessage: 'ユーザー名またはパスワードが違います'
            });
        } else {
            //　入力したnameをハッシュ化して比較
            var cipher = crypto.createCipher('aes192', pass);
            var cipheredPass = cipher.final('hex');
            if (row[0].pass == cipheredPass) {
                req.session.user = {name: name, id: row[0].id};
                res.redirect('/game');
            } else {
                res.render('login', {
                    passMessage: 'ユーザー名またはパスワードが違います'
                });
            }
        }
    });
});

module.exports = router;
