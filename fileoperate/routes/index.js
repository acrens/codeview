/**
 * 描述：自动扫描模板目录，并将文件目录及文件名称以json格式返回给ejs模板
 * Created by allen on 2015/5/24.
 */
var fs = require('fs');
var path = require('path');

exports.index = function(req, res) {
    var username = req.query.username;
    console.log(username);

    if (username) {
        // 读取目录
        fs.readdir('template/', function(err, files) {
            if (err) {
                console.log(err);
                return;
            } else {
                var json = [],
                    i = 0;
                files.forEach(function(file) {

                    // 为目录时进入处理
                    if (file.indexOf('.') < 0) {
                        fs.readdir('template/' + file, function(err, sub_files) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                json[i++] = {};
                                json[i - 1]['title'] = file;
                                json[i - 1]['filenames'] = [];
                                sub_files.forEach(function(sub_file) {
                                    if (sub_file.indexOf('.') >= 0) {
                                        json[i - 1]['filenames'].push(sub_file);
                                    }
                                });

                                if (i == files.length) {
                                    json.username = username;

                                    // 返回index视图，并将arr数据返回视图渲染
                                    res.render('index', {
                                        'title': 'EDM自动化',
                                        'list': json
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.render('index', {
            'title': 'EDM自动化',
            'list': []
        });
    }

}
