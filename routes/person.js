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
    });
}

exports.checkPassCode = function (req, res) {
    var passCode = req.body.passCode;
    personDB.checkPassCode(passCode, function (exist) {
        res.json(exist);
    });
}

exports.addPerson = function (req, res) {
    personDB.addPerson(req.body.passCode, req.body,function(updated) {
        if(updated) {
            req.session.userCode = req.body.userCode;
        }
        res.json(updated);
    });
}