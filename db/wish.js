/**
 * Created by ruizhang on 13-12-5.
 */

var db = require("./connector").connect();
var mongojs = require("mongojs");

exports.getWishes = function (callback) {
    db.wish.find(function (err, wishes) {
        if (err || !wishes) {
            callback(err, null);
        } else {
            callback(null, wishes);
        }
    });
}

exports.saveNewWish = function (wish, callback) {
    db.wish.insert(wish, function (err, saved) {
        if (!err && saved) {
            console.log(wish.person.name + " 的wish已经保存成功");
        }
        callback(saved);
    });
}

exports.wishCheck = function(id, callback) {
    db.wish.findOne({"_id":mongojs.ObjectId(id)},function(err, wish) {
        console.log(wish);
        if(err) {
            console.log("wish Check 数据查询失败");
        } else if(!wish){
            callback(-1);
        } else {
            callback(wish.Achieve);
        }
    });
}

exports.achieveWish = function (id, callback) {
    console.log("1");
    console.log(mongojs.ObjectId);
    db.wish.update({"_id": mongojs.ObjectId(id)}, {$set: {"Achieve": true}}, function (err, updated) {
        if (!err && updated) {
            console.log(id + " 领取失败");
        }
        callback(updated);
    })
}