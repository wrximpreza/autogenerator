var express = require('express');
var router = express.Router();

var app = express();
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
app.use(cookieParser());


router.get('/', function (req, res, next) {

    var translation = {
        'ru': {
            'install': 'Установить',
            'ratings': 'Рейтинг﻿'
        },
        'en': {
            'install': 'Install',
            'ratings': 'Ratings'
        },
        'es': {
            'install': 'Instalar',
            'ratings': 'Calificaciones'
        },
        'fr': {
            'install': 'Installer',
            'ratings': 'Evaluations'
        },
        'cn': {
            'install': '安装',
            'ratings': '評分'
        },
        'de': {
            'install': 'Installieren',
            'ratings': 'Wertung'
        }
    };

    var phones = {
        'apple': 'App Store',
        'android': 'Google Play'
    };

    var q  = parseQuery(req.url);

    var template = 'banner_'+q.format;

    if(typeof translation[q.lang] == 'undefined'){
        var translate = translation['en'];
    }else{
        var translate = translation[q.lang];
    }

    if(q.local == 1) {
        if (q.title_text) {
            q.title = q.title_text;
        }
        if (q.button_text) {
            translate.install = q.button_text;
        }
        if (q.rate_text) {
            translate.ratings = q.rate_text;
        }
        if(q.button_text.length>7){
            q.lang = 'ru';
        }
    }

    var score = q.score;
    q.score = parseInt(score);

    res.render('banners/'+template, {data: q, translation: translate, phones: phones[q.os]});
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

