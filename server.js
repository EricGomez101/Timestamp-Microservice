"use strict";
exports.__esModule = true;
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var types = { DATE: 'DATE', UNIX: 'UNIX', NULL: 'NULL', ERROR: 'ERROR' };
app.get('/', function (req, res) {
    res.json({ 'message': 'hello world' });
});
var middleware = function (req, res, next) {
    var DATE = types.DATE, UNIX = types.UNIX, NULL = types.NULL, ERROR = types.ERROR;
    var dateString = req.params.dateString;
    if (dateString === undefined) {
        req.type = NULL;
        next();
    }
    if (/\w{4}-\w+-\w+/.test(dateString))
        req.type = DATE;
    else if (/\d{3,}/.test(dateString))
        req.type = UNIX;
    else
        req.type = ERROR;
    next();
};
app.get('/api/timestamp/:dateString?', middleware, function (req, res) {
    var DATE = types.DATE, UNIX = types.UNIX, ERROR = types.ERROR;
    var dateString = req.params.dateString;
    var type = req.type;
    var date = type === UNIX ? new Date(Number(dateString)) : type === DATE ? new Date(dateString) : new Date();
    var time = date.getTime();
    var utcString = date.toUTCString();
    var message = { "unix": time, "utc": utcString };
    if (type === ERROR)
        message = { "error": "Invalid Date" };
    res.json(message);
});
app.listen(port);
