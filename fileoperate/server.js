/**
 * Created by allen on 2015/5/24.
 */

//  引入需要用到的功能模块
var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();

// 加载目标路由
var index = require('./routes/index');
var routes = require('./routes/file');

// 配置全局常量参数
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

// 配置request请求路由
app.get('/', index.index);
app.get('/file', routes.list);
app.get('/download', routes.download);

// 注册并开启一个node服务进程
http.createServer(app).listen(app.get('port'), function() {
    console.log('Listening on porting %', app.get('port'));
});