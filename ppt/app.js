/**
 * 1、加载node核心模块js文件
 * 2、省略路径则表示加载nodel_modules文件中的核心模块
 */
var express = require('express');
var http = require('http');
var path = require('path');

/* 1、相对路径(相对于调用require的文件路径)加载对应的js文件,省略js后缀
 * 2、如果路径为目录，则优先查找指定目录下的package.json文件中指定的main文件;
 *    如果没有指定main属性，则加载指定目录下的index.js文件
 */
var routes = require('./routes');
var login = require('./routes/login');
var user = require('./routes/user');

// 配置全局环境
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// 配置路径映射
app.get('/', routes.index);
app.get('/login', login.login);
app.get('/users', user.list);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;