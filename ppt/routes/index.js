/*
 * 获取主页
 *
 * 如何获取前台发送过来的参数：
 * 1、req.params 如果url为localhost:3000/index则获取index参数,方便进行路由选择
 * 2、req.query GET请求获取参数方式,如req.query.username，获取参数名为username的值
 * 3、req.body POST请求获取参数方式,如req.body.username,获取POST请求中key为username的值
 */

exports.index = function(req, res){
    var user = {
        username: 'admin',
        password: 'admin'
    };

    if(req.query.username == user.username &&
        req.query.password == user.password) {
        //调用EJS模板引擎解析index数据
        res.render('index', { title: '欢迎登录Express系统' });
    } else {
        //重定向请求
        res.redirect('/login');
    }
};