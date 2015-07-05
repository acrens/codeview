/**
 * 功能：实现用户登录
 * 作者：acrens
 */

var fs = require('fs');

/**
 * [isExitByUsername 检查用户是否存在]
 * @param  {[type]}  user     [用户实体]
 * @param  {[type]}  userList [用户列表 json]
 * @return {Boolean}          [存在返回true，否则返回false]
 */
function isExitByUsername(user, userList) {
    var flag = false;
    var username = user.username;
    if (userList && userList.length) {
        for (var i in userList) {
            if (username == userList[i].username) {
                flag = true;
                break;
            }
        }
    }

    return flag;
}

exports.login = function(req, res) {
    var user = {};
    var username = req.query.username;
    var userList = JSON.parse(fs.readFileSync('user/user.json'));

    // 封装为entity
    user.username = username;
    user.password = "";
    user.role = null;

    if (isExitByUsername(user, userList)) {
        // res.send(username);
        // res.redirect('/?username=' + username);
        res.send(username);
        return;
    }

    res.send(false);
}
