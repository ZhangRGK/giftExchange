/**
 * Created by ruizhang on 13-12-9.
 */
var db = require("./connector").connect();

exports.createPassCode = function(passcode,callback) {
    db.person.findOne({"passCode":passcode},function(err,person) {
        if(!person) {
            db.person.save({"passCode":passcode},function(err,saved) {
                if (err && !saved) {
                    console.log(passcode + " 的创建失败");
                } else {
                    console.log(passcode + " 创建完成");
                }
                callback(saved);
            });
        } else {
            console.log(passcode + "已经存在");
            callback(true);
        }
    });
}

exports.getPerson = function(userCode,callback) {
    db.person.findOne({"userCode":userCode},function(err,person) {
        if(err && !person) {
            console.log(userCode + " 用户查找失败");
        } else {
            callback(person);
        }
    });
}

exports.addPerson = function(passcode,person,callback) {
    db.person.update({"passCode":passcode},person,function(err,updated) {
        if(err && !updated) {
            console.log(passcode+" 用户激活失败");
        }
        callback(updated);
    })
}

exports.checkUserCode = function(userCode,callback) {
    db.person.find({"userCode":userCode},function(err,person) {
        if(err) {
            console.log("check person数据查询失败:"+err);
        } else if(person.length) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

exports.checkPassCode = function(passcode,callback) {
    db.person.find({"passCode":passcode},function(err,person) {
        if(err) {
            console.log("check PassCode 数据查询失败");
        } else if(person.length) {
            callback(true);
        } else {
            callback(false);
            console.log(passcode+" 不存在");
        }
    });
}

exports.checkMade = function(userCode,callback) {
    db.person.findOne({"userCode":userCode},function(err,person) {
        if(err) {
            console.log("check make 数据查询失败");
        } else {
            callback(person.made);
        }
    });
}