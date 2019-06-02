var express = require('express');
var router = express.Router();

//　ログイン後のページを表示
router.get('/', function (req, res) {
    res.render('game',{name : req.session.user.name,
    id: req.session.user.id});
});

module.exports = router;