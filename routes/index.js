var express = require('express');
var router = express.Router();
var gplay = require('google-play-scraper');
var store = require('app-store-scraper');
var Promise = require('promise');
var path = require('path');
var app = express();
var rmdir = require('rmdir');


var uuid = require('node-uuid');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var webshot = require('webshot');
var archiver = require('archiver');

var nodemailer = require('nodemailer');

var formats = [
    "300_50", "320_50", "728_90", "468_60", "300_250", "300_250_2", "480_320", "480_320_2", "320_480"
];

var lang = {
    "en": "English",
    "ru": "Russsian",
    "es": "Spain",
    "fr": "France",
    "ch": "China",
    "de": "Deutsch"
};


var data = {};
data.images = [];

var promise = function (app) {
    data = app;
};


app.use(cookieParser());

function httpGet(format) {

    return new Promise(function (resolve) {
        var pairs = [];
        pairs.push(['test=test']);
        pairs.push(['format=' + format]);
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                var k = encodeURIComponent(prop),
                    v = encodeURIComponent(data[prop]);
                pairs.push(k + "=" + v);
            }
        }
        var url = "?" + pairs.join("%26");
        var size = format.split('_');
        var options = {
            errorIfStatusIsNot200: true,
            errorIfJSException: true,
            screenSize: {
                width: size[0],
                height: size[1]
            },
            onLoadFinished: function () {

            }
        };
        webshot(data.host + '/banner' + url, data.dir + 'banner_' + format + '.png', options, function (err) {
            if (err)
                return console.log(err);
            data.images.push(data.dir + 'banner_' + format + '.png');
            resolve(data.dir + 'banner_' + format + '.png');
        });

    });

}
function sendEmail() {
    return new Promise(function (resolve) {
        var transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            auth: {
                user: 'wrximpreza@mail.ru',
                pass: 'wrx1987'
            },
            tls: {
                rejectUnauthorized: false
            },
            secure: true,
            //logger: true, // log to console
            //debug: true // include SMTP traffic in the logs
        }, {
            from: 'Генератор Баннеров <wrximpreza@mail.ru>',
            headers: {
                'X-Laziness-level': 1000
            }
        });

        var message = {
            to: data.email,
            subject: 'Генератор Баннеров ✔',
            html: '',
            attachments: [
                {
                    filename: 'formats.zip',
                    path: data.zip
                }
            ]
        };
        transporter.sendMail(message, function (error, info) {
            if (error) {
                console.log(error.message);
                data.email_message = "Ошибка отправки сообщения на почту";
                resolve("Ошибка отправки сообщения на почту");
                return;
            }
            data.email_message = "Сообщение отправлено успешно";
            resolve("Сообщение отправлено успешно");
            console.log('Message sent successfully!');
        });

    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (typeof data.user_id != 'undefined') {
        rmdir(path.join(__dirname, '../public') + '/tmp/' + data.user_id, function (err, dirs, files) {
            console.log('all files are removed');
        });
    }
    data = {};
    data.images = [];
    res.render('index', {lang: lang, formats: formats});
})
    .post('/', function (req, res, next) {
        data = {};
        data.images = [];

        data.host = req.protocol + '://' + req.get('host');
        data.app_id = req.body.app;
        data.lang = req.body.lang;
        data.formats = req.body['format[]'];
        data.send_mail = req.body.send_mail;
        if (typeof req.body.send_mail == 'undefined') {
            data.send_mail = 0;
        }
        data.email = req.body.email;
        data.local = req.body.local;
        data.download = req.body.download;

        if (typeof req.body.local == 'undefined') {
            data.local = 0;
        }

        if (req.body.title_text) {
            data.title_text = req.body.title_text;
        }
        if (req.body.button_text) {
            data.button_text = req.body.button_text;
        }
        if (req.body.rate_text) {
            data.rate_text = req.body.rate_text;
        }

        if (typeof req.cookies.user_id == 'undefined')
            res.cookie('user_id', uuid.v4());
        data.user_id = req.cookies.user_id;
        data.dir = path.join(__dirname, '../public') + '/tmp/' + data.user_id + '/';
        if (typeof data.formats == 'string') {
            var tmp = data.formats;
            data.formats = [];
            data.formats.push(tmp);
        }
        var dir = path.join(__dirname, '../public') + '/tmp/' + data.user_id + '/';
        if (data.app_id.split('.').length >= 2) {
            data.os = 'android';
            gplay.app({appId: data.app_id, 'lang': data.lang, 'country': data.lang})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.summary;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    if (!fs.existsSync(data.dir)) {
                        fs.mkdirSync(data.dir);
                    }

                    var promise = Promise.all(data.formats.map(httpGet));
                    return promise.then(function () {
                        return data.images;
                    }).then(function (result) {

                        data.zip = data.host + '/tmp/' + data.user_id + '/formats.zip';

                        var archive  = archiver('zip');
                        var output = fs.createWriteStream(dir + 'formats.zip');
                        archive.pipe(output);

                        var getStream = function(fileName){
                            return fs.readFileSync(fileName);
                        };
                        data.images.forEach(function (item) {
                            var imgs = item.split('/');
                            archive.append(getStream(item), { name: imgs[imgs.length-1]});
                        });
                        archive.finalize(function(err, bytes) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(bytes + ' total bytes');
                        });

                        return result;
                    }).catch(function (error) {
                        console.log(error);
                        res.render('error', {message: error.message});
                    });
                }).then(function (input) {

                if (data.send_mail == 1) {
                    sendEmail().then(function (result) {
                        res.render('index', {lang: lang, formats: formats, status: '1', data: data});
                    });
                }else{
                    res.render('index', {lang: lang, formats: formats, status: '1', data: data});
                }

            }).catch(function (e) {
                console.log('There was an error fetching the application!', e.message);
                res.render('error', {message: e.message});
            });
        } else {
            data.app_id = data.app_id.substring(2, data.app_id.length);
            data.os = 'apple';
            var lg = data.lang;
            if(data.lang == 'en'){
                lg = 'us';
            }
            store.app({id: data.app_id, 'country': lg})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.description;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    if (!fs.existsSync(data.dir)) {
                        fs.mkdirSync(data.dir);
                    }
                    var promise = Promise.all(data.formats.map(httpGet));
                    return promise.then(function () {
                        return data.images;
                    }).then(function (result) {

                        data.zip = data.host + '/tmp/' + data.user_id + '/formats.zip';

                        var archive  = archiver('zip');
                        var output = fs.createWriteStream(dir + 'formats.zip');
                        archive.pipe(output);

                        var getStream = function(fileName){
                            return fs.readFileSync(fileName);
                        };
                        data.images.forEach(function (item) {
                            var imgs = item.split('/');
                            archive.append(getStream(item), { name: imgs[imgs.length-1]});
                        });
                        archive.finalize(function(err, bytes) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(bytes + ' total bytes');
                        });
                        return result;

                    }).catch(function (error) {
                        console.log(error);
                        res.render('error', {message: error.message});
                    });
                }).then(function (input) {
                    if (data.send_mail == 1) {
                        sendEmail().then(function (result) {
                            res.render('index', {lang: lang, formats: formats, status: '1', data: data});
                        });
                    }else{
                        res.render('index', {lang: lang, formats: formats, status: '1', data: data});
                    }
            }).catch(function (e) {
                console.log('There was an error fetching the application!', e);
                res.render('error', {message: e.message});
            });
        }

    });


module.exports = router;
