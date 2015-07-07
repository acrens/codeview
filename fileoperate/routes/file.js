/**
 * 描述：本文件主要提供根据模板文件的路径读取并返回内容
 * Created by allen on 2015/5/24.
 */
var fs = require('fs');

exports.list = function(req, res) {
    var filename = req.query.filename;  // 获取请求的模板文件路径

    fs.readFile('template/' + filename, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if(err) {
            console.error(err);
            return;
        }

        res.send(data);
    });
}

// 下载文件
exports.download = function(req, res) {
    var code = req.query.code;
    fs.writeFile('html/file.html', code, {'encoding':'utf8'}, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.download('html/file.html','file.html');
        }
    });
}