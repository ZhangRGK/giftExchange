/**
 * Created by ruizhang on 13-12-9.
 */

var personDB = require("../db/person");

exports.checkPerson = function (req, res) {
    var userCode = req.body.userCode;
    personDB.checkUserCode(userCode, function (exist) {
        if(exist) {
            req.session.userCode = userCode;
        }
        res.json(exist);
        console.log("用户:"+userCode+" 验证结果:"+exist);
    });
}

exports.checkPassCode = function (req, res) {
    var passCode = req.body.passCode;
    personDB.checkPassCode(passCode, function (exist) {
        res.json(exist);
        console.log("邀请码:"+passCode+" 验证结果:"+exist);
    });
}

exports.addPerson = function (req, res) {
    personDB.addPerson(req.body.passCode, req.body,function(updated) {
        if(updated) {
            req.session.userCode = req.body.userCode;
        }
        res.json(updated);
        console.log("新增用户:"+req.body.userCode);
    });
}