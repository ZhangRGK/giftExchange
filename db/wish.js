/**
 * Created by ruizhang on 13-12-5.
 */

var db = require("./connector").connect();
var mongojs = require("mongojs");

exports.getWishes = function (callback) {
    db.wish.find(function (err,wishes) {
        if (err || !wishes) {
            console.log("getWishes:查询wishes失败");
            callback(null);
        } else {
            callback(wishes);
        }
    });
}

exports.saveNewWish = function (wish, callback) {
    db.wish.insert(wish, function (err, saved) {
        if (!err && saved) {
            console.log(wish.person.name + " wish已经保存成功");
        }
        db.person.update({"userCode":wish.person.name},{$set:{"made":true}},function(err,updated) {
            callback(saved||updated);
        });
    });
}

exports.wishCheck = function(id, callback) {
    db.wish.findOne({"_id":mongojs.ObjectId(id)},function(err, wish) {
        if(err) {
            console.log("wish Check 数据查询失败");
        } else if(!wish){
            callback(-1);
        } else {
            callback(wish.Achieve);
        }
    });
}

exports.achieveWish = function (id,wishOwner,userCode,callback) {
    db.wish.update({"_id": mongojs.ObjectId(id)}, {$set: {"Achieve": true}}, function (err, updated) {
        if (!err && updated) {
            console.log(id + " 领取失败");
        }
        db.person.update({"userCode":userCode},{$set:{"made":true,"wishOwner":wishOwner}},function(err,u) {
            callback(updated||u);
        });
    })
}