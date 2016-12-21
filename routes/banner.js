var express = require('express');
var router = express.Router();

var app = express();
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var translation = {
    'ru': {
        'install': 'Install',
        'ratings': 'Ratings'
    },
    'en': {
        'install': 'Install',
        'ratings': 'Ratings'
    }
};

var phones = {
    'apple': 'on App Store',
    'android': 'on Google Play'
};



router.get('/', function (req, res, next) {

    var q  = parseQuery(req.url);
    var template = '';
    if(q.format == '300x50'){
        template = 'banner_300';
    }else if(q.format == '320x50'){
        template = 'banner_320';
    }else if(q.format == '468x60'){
        template = 'banner_468';
    }else if(q.format == '728x90'){
        template = 'banner_728';
    }else if(q.format == '300x250'){
        template = 'banner_300_250';
    }else if(q.format == '300x250(2)'){
        template = 'banner_300_250_1';
    }else if(q.format == '320x480'){
        template = 'banner_320_480';
    }else if(q.format == '480x320'){
        template = 'banner_480_320';
    }else if(q.format == '480x320(2)'){
        template = 'banner_480_320_2';
    }

    res.render('banners/'+template, {data: q, translation: translation[q.lang], phones: phones[q.os]});
});

function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).split('%26');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}


module.exports = router;

