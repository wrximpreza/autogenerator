var express = require('express');
var router = express.Router();
var gplay = require('google-play-scraper');
var store = require('app-store-scraper');
var Promise = require('promise');
var country_list = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

var formats = [
    {
        "name": "300*50",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "300*250(1)",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "300*250(2)",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "320*50",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "320*480",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "468*60",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "480*320(1)",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "480*320(2)",
        "image": "http://materializecss.com/images/sample-1.jpg"
    },
    {
        "name": "728*90",
        "image": "http://materializecss.com/images/sample-1.jpg"
    }
];

var lang = {
    "en": "English",
    "ru": "Russsian",
    "sp": "Spain",
    "fr": "France",
    "ch": "China",
    "de": "Deutsch"
};

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
    'ios': 'App Store',
    'android': 'Google Play'
};

var data = {};

var promise = function (app) {
    data = app;
};


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Автогенерация креативов', country_list: country_list, lang: lang, formats: formats});
})
    .post('/', function (req, res, next) {

        data.app_id = req.body.app;
        data.lang = req.body.lang;
        data.country = req.body.country;

        if (data.app_id.split('.').length >= 2) {
            data.os = phones.android;
            gplay.app({appId: data.app_id, 'lang': data.lang, 'country': data.country})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.summary;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    return data;
                }).then(function (data) {
                res.render('show', {title: 'Автогенерация креативов', data: data});
            }).catch(function (e) {
                console.log('There was an error fetching the application!');
            });


        } else {
            data.app_id = data.app_id.substring(2, data.app_id.length);
            data.os = phones.ios;
            store.app({id: data.app_id})
                .then(function (app) {
                    data.title = app.title;
                    data.icon = app.icon;
                    data.description = app.description;
                    data.reviews = app.reviews;
                    data.score = app.score;
                    return promise(data);
                }).then(function (data) {
                res.render('show', {title: 'Автогенерация креативов', data: data});
            })
                .catch(function (e) {
                    console.log('There was an error fetching the application!');
                });
        }

    });


module.exports = router;
