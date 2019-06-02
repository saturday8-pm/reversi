var express = require('express');
var router = express.Router();

// ログアウトしてログインページへ
router.get('/', function (req, res, next) {
    delete req.session.user;
    res.render('login');
});

module.exports = router;