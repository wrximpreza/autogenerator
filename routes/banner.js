var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('banner');
    res.render('banner', {title: 'Тест'});
});

module.exports = router;
