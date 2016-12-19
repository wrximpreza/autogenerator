var express = require('express');
var router = express.Router();

var app = express();
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

router.get('/', function (req, res, next) {
    res.render('banner', {title: req.param('title'), icon: req.param('icon')});
});

module.exports = router;
