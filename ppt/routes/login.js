/*
 * 访问登陆页
 */

exports.login = function(req, res){
    res.render('login', { title: '登录' });
};