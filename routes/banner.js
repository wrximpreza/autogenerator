var express = require('express');
var router = express.Router();

var app = express();
var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
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
    'ch': {
        'install': '安装',
        'ratings': '評分'
    },
    'de': {
        'install': 'Installieren',
        'ratings': 'Wertung'
    }
};

var phones = {
    'apple': 'on App Store',
    'android': 'on Google Play'
};



router.get('/', function (req, res, next) {

    var q  = parseQuery(req.url);

    var template = '';
    if(q.format == '300_50'){
        template = 'banner_300';
    }else if(q.format == '320_50'){
        template = 'banner_320';
    }else if(q.format == '468_60'){
        template = 'banner_468';
    }else if(q.format == '728_90'){
        template = 'banner_728';
    }else if(q.format == '300_250'){
        template = 'banner_300_250';
    }else if(q.format == '300_250_2'){
        template = 'banner_300_250_1';
    }else if(q.format == '320_480'){
        template = 'banner_320_480';
    }else if(q.format == '480_320'){
        template = 'banner_480_320';
    }else if(q.format == '480_320_2'){
        template = 'banner_480_320_2';
    }

    if(typeof translation[q.lang] == 'undefined'){
        var translate = translation['en'];
    }else{
        var translate = translation[q.lang];
    }

    if (q.title_text) {
        translate.title = q.title_text;
    }
    if (q.button_text) {
        translate.install = q.button_text;
    }
    if (q.rate_text) {
        translate.ratings = q.rate_text;
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

