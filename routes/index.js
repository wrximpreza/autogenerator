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
var AdmZip = require('adm-zip');

var nodemailer = require('nodemailer');


var country_list = [
    {"name": "Afghanistan", "code": "AF"},
    {"name": "land Islands", "code": "AX"},
    {"name": "Albania", "code": "AL"},
    {"name": "Algeria", "code": "DZ"},
    {"name": "American Samoa", "code": "AS"},
    {"name": "AndorrA", "code": "AD"},
    {"name": "Angola", "code": "AO"},
    {"name": "Anguilla", "code": "AI"},
    {"name": "Antarctica", "code": "AQ"},
    {"name": "Antigua and Barbuda", "code": "AG"},
    {"name": "Argentina", "code": "AR"},
    {"name": "Armenia", "code": "AM"},
    {"name": "Aruba", "code": "AW"},
    {"name": "Australia", "code": "AU"},
    {"name": "Austria", "code": "AT"},
    {"name": "Azerbaijan", "code": "AZ"},
    {"name": "Bahamas", "code": "BS"},
    {"name": "Bahrain", "code": "BH"},
    {"name": "Bangladesh", "code": "BD"},
    {"name": "Barbados", "code": "BB"},
    {"name": "Belarus", "code": "BY"},
    {"name": "Belgium", "code": "BE"},
    {"name": "Belize", "code": "BZ"},
    {"name": "Benin", "code": "BJ"},
    {"name": "Bermuda", "code": "BM"},
    {"name": "Bhutan", "code": "BT"},
    {"name": "Bolivia", "code": "BO"},
    {"name": "Bosnia and Herzegovina", "code": "BA"},
    {"name": "Botswana", "code": "BW"},
    {"name": "Bouvet Island", "code": "BV"},
    {"name": "Brazil", "code": "BR"},
    {"name": "British Indian Ocean Territory", "code": "IO"},
    {"name": "Brunei Darussalam", "code": "BN"},
    {"name": "Bulgaria", "code": "BG"},
    {"name": "Burkina Faso", "code": "BF"},
    {"name": "Burundi", "code": "BI"},
    {"name": "Cambodia", "code": "KH"},
    {"name": "Cameroon", "code": "CM"},
    {"name": "Canada", "code": "CA"},
    {"name": "Cape Verde", "code": "CV"},
    {"name": "Cayman Islands", "code": "KY"},
    {"name": "Central African Republic", "code": "CF"},
    {"name": "Chad", "code": "TD"},
    {"name": "Chile", "code": "CL"},
    {"name": "China", "code": "CN"},
    {"name": "Christmas Island", "code": "CX"},
    {"name": "Cocos (Keeling) Islands", "code": "CC"},
    {"name": "Colombia", "code": "CO"},
    {"name": "Comoros", "code": "KM"},
    {"name": "Congo", "code": "CG"},
    {"name": "Congo, The Democratic Republic of the", "code": "CD"},
    {"name": "Cook Islands", "code": "CK"},
    {"name": "Costa Rica", "code": "CR"},
    {"name": "Cote DIvoire", "code": "CI"},
    {"name": "Croatia", "code": "HR"},
    {"name": "Cuba", "code": "CU"},
    {"name": "Cyprus", "code": "CY"},
    {"name": "Czech Republic", "code": "CZ"},
    {"name": "Denmark", "code": "DK"},
    {"name": "Djibouti", "code": "DJ"},
    {"name": "Dominica", "code": "DM"},
    {"name": "Dominican Republic", "code": "DO"},
    {"name": "Ecuador", "code": "EC"},
    {"name": "Egypt", "code": "EG"},
    {"name": "El Salvador", "code": "SV"},
    {"name": "Equatorial Guinea", "code": "GQ"},
    {"name": "Eritrea", "code": "ER"},
    {"name": "Estonia", "code": "EE"},
    {"name": "Ethiopia", "code": "ET"},
    {"name": "Falkland Islands (Malvinas)", "code": "FK"},
    {"name": "Faroe Islands", "code": "FO"},
    {"name": "Fiji", "code": "FJ"},
    {"name": "Finland", "code": "FI"},
    {"name": "France", "code": "FR"},
    {"name": "French Guiana", "code": "GF"},
    {"name": "French Polynesia", "code": "PF"},
    {"name": "French Southern Territories", "code": "TF"},
    {"name": "Gabon", "code": "GA"},
    {"name": "Gambia", "code": "GM"},
    {"name": "Georgia", "code": "GE"},
    {"name": "Germany", "code": "DE"},
    {"name": "Ghana", "code": "GH"},
    {"name": "Gibraltar", "code": "GI"},
    {"name": "Greece", "code": "GR"},
    {"name": "Greenland", "code": "GL"},
    {"name": "Grenada", "code": "GD"},
    {"name": "Guadeloupe", "code": "GP"},
    {"name": "Guam", "code": "GU"},
    {"name": "Guatemala", "code": "GT"},
    {"name": "Guernsey", "code": "GG"},
    {"name": "Guinea", "code": "GN"},
    {"name": "Guinea-Bissau", "code": "GW"},
    {"name": "Guyana", "code": "GY"},
    {"name": "Haiti", "code": "HT"},
    {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
    {"name": "Holy See (Vatican City State)", "code": "VA"},
    {"name": "Honduras", "code": "HN"},
    {"name": "Hong Kong", "code": "HK"},
    {"name": "Hungary", "code": "HU"},
    {"name": "Iceland", "code": "IS"},
    {"name": "India", "code": "IN"},
    {"name": "Indonesia", "code": "ID"},
    {"name": "Iran, Islamic Republic Of", "code": "IR"},
    {"name": "Iraq", "code": "IQ"},
    {"name": "Ireland", "code": "IE"},
    {"name": "Isle of Man", "code": "IM"},
    {"name": "Israel", "code": "IL"},
    {"name": "Italy", "code": "IT"},
    {"name": "Jamaica", "code": "JM"},
    {"name": "Japan", "code": "JP"},
    {"name": "Jersey", "code": "JE"},
    {"name": "Jordan", "code": "JO"},
    {"name": "Kazakhstan", "code": "KZ"},
    {"name": "Kenya", "code": "KE"},
    {"name": "Kiribati", "code": "KI"},
    {"name": "Korea, Democratic PeopleS Republic of", "code": "KP"},
    {"name": "Korea, Republic of", "code": "KR"},
    {"name": "Kuwait", "code": "KW"},
    {"name": "Kyrgyzstan", "code": "KG"},
    {"name": "Lao PeopleS Democratic Republic", "code": "LA"},
    {"name": "Latvia", "code": "LV"},
    {"name": "Lebanon", "code": "LB"},
    {"name": "Lesotho", "code": "LS"},
    {"name": "Liberia", "code": "LR"},
    {"name": "Libyan Arab Jamahiriya", "code": "LY"},
    {"name": "Liechtenstein", "code": "LI"},
    {"name": "Lithuania", "code": "LT"},
    {"name": "Luxembourg", "code": "LU"},
    {"name": "Macao", "code": "MO"},
    {"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
    {"name": "Madagascar", "code": "MG"},
    {"name": "Malawi", "code": "MW"},
    {"name": "Malaysia", "code": "MY"},
    {"name": "Maldives", "code": "MV"},
    {"name": "Mali", "code": "ML"},
    {"name": "Malta", "code": "MT"},
    {"name": "Marshall Islands", "code": "MH"},
    {"name": "Martinique", "code": "MQ"},
    {"name": "Mauritania", "code": "MR"},
    {"name": "Mauritius", "code": "MU"},
    {"name": "Mayotte", "code": "YT"},
    {"name": "Mexico", "code": "MX"},
    {"name": "Micronesia, Federated States of", "code": "FM"},
    {"name": "Moldova, Republic of", "code": "MD"},
    {"name": "Monaco", "code": "MC"},
    {"name": "Mongolia", "code": "MN"},
    {"name": "Montenegro", "code": "ME"},
    {"name": "Montserrat", "code": "MS"},
    {"name": "Morocco", "code": "MA"},
    {"name": "Mozambique", "code": "MZ"},
    {"name": "Myanmar", "code": "MM"},
    {"name": "Namibia", "code": "NA"},
    {"name": "Nauru", "code": "NR"},
    {"name": "Nepal", "code": "NP"},
    {"name": "Netherlands", "code": "NL"},
    {"name": "Netherlands Antilles", "code": "AN"},
    {"name": "New Caledonia", "code": "NC"},
    {"name": "New Zealand", "code": "NZ"},
    {"name": "Nicaragua", "code": "NI"},
    {"name": "Niger", "code": "NE"},
    {"name": "Nigeria", "code": "NG"},
    {"name": "Niue", "code": "NU"},
    {"name": "Norfolk Island", "code": "NF"},
    {"name": "Northern Mariana Islands", "code": "MP"},
    {"name": "Norway", "code": "NO"},
    {"name": "Oman", "code": "OM"},
    {"name": "Pakistan", "code": "PK"},
    {"name": "Palau", "code": "PW"},
    {"name": "Palestinian Territory, Occupied", "code": "PS"},
    {"name": "Panama", "code": "PA"},
    {"name": "Papua New Guinea", "code": "PG"},
    {"name": "Paraguay", "code": "PY"},
    {"name": "Peru", "code": "PE"},
    {"name": "Philippines", "code": "PH"},
    {"name": "Pitcairn", "code": "PN"},
    {"name": "Poland", "code": "PL"},
    {"name": "Portugal", "code": "PT"},
    {"name": "Puerto Rico", "code": "PR"},
    {"name": "Qatar", "code": "QA"},
    {"name": "Reunion", "code": "RE"},
    {"name": "Romania", "code": "RO"},
    {"name": "Russian Federation", "code": "RU"},
    {"name": "RWANDA", "code": "RW"},
    {"name": "Saint Helena", "code": "SH"},
    {"name": "Saint Kitts and Nevis", "code": "KN"},
    {"name": "Saint Lucia", "code": "LC"},
    {"name": "Saint Pierre and Miquelon", "code": "PM"},
    {"name": "Saint Vincent and the Grenadines", "code": "VC"},
    {"name": "Samoa", "code": "WS"},
    {"name": "San Marino", "code": "SM"},
    {"name": "Sao Tome and Principe", "code": "ST"},
    {"name": "Saudi Arabia", "code": "SA"},
    {"name": "Senegal", "code": "SN"},
    {"name": "Serbia", "code": "RS"},
    {"name": "Seychelles", "code": "SC"},
    {"name": "Sierra Leone", "code": "SL"},
    {"name": "Singapore", "code": "SG"},
    {"name": "Slovakia", "code": "SK"},
    {"name": "Slovenia", "code": "SI"},
    {"name": "Solomon Islands", "code": "SB"},
    {"name": "Somalia", "code": "SO"},
    {"name": "South Africa", "code": "ZA"},
    {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
    {"name": "Spain", "code": "ES"},
    {"name": "Sri Lanka", "code": "LK"},
    {"name": "Sudan", "code": "SD"},
    {"name": "Suriname", "code": "SR"},
    {"name": "Svalbard and Jan Mayen", "code": "SJ"},
    {"name": "Swaziland", "code": "SZ"},
    {"name": "Sweden", "code": "SE"},
    {"name": "Switzerland", "code": "CH"},
    {"name": "Syrian Arab Republic", "code": "SY"},
    {"name": "Taiwan, Province of China", "code": "TW"},
    {"name": "Tajikistan", "code": "TJ"},
    {"name": "Tanzania, United Republic of", "code": "TZ"},
    {"name": "Thailand", "code": "TH"},
    {"name": "Timor-Leste", "code": "TL"},
    {"name": "Togo", "code": "TG"},
    {"name": "Tokelau", "code": "TK"},
    {"name": "Tonga", "code": "TO"},
    {"name": "Trinidad and Tobago", "code": "TT"},
    {"name": "Tunisia", "code": "TN"},
    {"name": "Turkey", "code": "TR"},
    {"name": "Turkmenistan", "code": "TM"},
    {"name": "Turks and Caicos Islands", "code": "TC"},
    {"name": "Tuvalu", "code": "TV"},
    {"name": "Uganda", "code": "UG"},
    {"name": "Ukraine", "code": "UA"},
    {"name": "United Arab Emirates", "code": "AE"},
    {"name": "United Kingdom", "code": "GB"},
    {"name": "United States", "code": "US"},
    {"name": "United States Minor Outlying Islands", "code": "UM"},
    {"name": "Uruguay", "code": "UY"},
    {"name": "Uzbekistan", "code": "UZ"},
    {"name": "Vanuatu", "code": "VU"},
    {"name": "Venezuela", "code": "VE"},
    {"name": "Viet Nam", "code": "VN"},
    {"name": "Virgin Islands, British", "code": "VG"},
    {"name": "Virgin Islands, U.S.", "code": "VI"},
    {"name": "Wallis and Futuna", "code": "WF"},
    {"name": "Western Sahara", "code": "EH"},
    {"name": "Yemen", "code": "YE"},
    {"name": "Zambia", "code": "ZM"},
    {"name": "Zimbabwe", "code": "ZW"}
];
var formats = [
    "300_50", "320_50", "728_90", "468_60", "300_250", "300_250_2", "480_320", "480_320_2", "320_480"
];

var lang = {
    "en": "English",
    "ru": "Russsian",
    "sp": "Spain",
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
                console.log('2');
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
        subject: 'Генератор Баннеров ✔', //
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
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
    });


}

/* GET home page. */
router.get('/', function (req, res, next) {
    if(typeof data.user_id != 'undefined'){
        rmdir(path.join(__dirname, '../public') + '/tmp/' + data.user_id, function (err, dirs, files) {
            console.log(dirs);
            console.log(files);
            console.log('all files are removed');
        });
    }
    data = {};
    data.images = [];
    var countries = country_list.map(function (value) {
        return {"name": value.name, "code": value.code.toLowerCase()};
    });
    res.render('index', {countries: countries, lang: lang, formats: formats});
})
    .post('/', function (req, res, next) {

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
        if(typeof data.formats == 'string') {
            var tmp = data.formats;
            data.formats = [];
            data.formats.push(tmp);
        }
        var dir = path.join(__dirname, '../public') + '/tmp/' + data.user_id + '/';
        if (data.app_id.split('.').length >= 2) {
            data.os = 'android';
            gplay.app({appId: data.app_id, 'lang': data.lang, 'country': data.country})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.summary;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    if (!fs.existsSync(data.dir)) {
                        fs.mkdirSync(data.dir);
                    }

                    var promise =  Promise.all(data.formats.map(httpGet));
                    return promise.then(function() {
                        return data.images;
                    }).then(function (result) {
                        if(data.download == 1) {
                            var zip = new AdmZip();
                            data.images.forEach(function (item) {
                                zip.addLocalFile(item);
                            });
                            zip.writeZip(dir + 'formats.zip');
                            data.zip = data.host + '/tmp/'+data.user_id+'/formats.zip';
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).then(function (input) {
                    if(data.send_mail == 1)
                        sendEmail();
                    res.render('index', {lang: lang, formats: formats, status: '1', data: data});
                }).catch(function (e) {
                    console.log('There was an error fetching the application!', e.message);
                    res.render('error', {message:e.message});
                });
        } else {
            data.app_id = data.app_id.substring(2, data.app_id.length);
            data.os = 'apple';
            store.app({id: data.app_id})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.description;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    if (!fs.existsSync(data.dir)) {
                        fs.mkdirSync(data.dir);
                    }
                    var promise =  Promise.all(data.formats.map(httpGet));
                    return promise.then(function() {
                        return data.images;
                    }).then(function (result) {
                        if(data.download == 1) {
                            var zip = new AdmZip();
                            data.images.forEach(function (item) {
                                zip.addLocalFile(item);
                            });
                            zip.writeZip(dir + 'formats.zip');
                            data.zip = data.host + '/tmp/'+data.user_id+'/formats.zip';
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).then(function (input) {
                if(data.send_mail == 1)
                    sendEmail();
                res.render('index', {lang: lang, formats: formats, status: '1', data: data});
            }).catch(function (e) {
                console.log('There was an error fetching the application!', e.message);
                res.render('error', {message:e.message});
            });
        }

    });


module.exports = router;
