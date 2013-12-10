/**
 * Created by ruizhang on 13-12-5.
 */

var db = require("./connector").connect();

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
    db.wish.find({"_id":"ObjectId("+id+")"},function(err, wish) {
        if(err) {
            console.log("wish Check 数据查询失败");
        } else if(wish.length){
            callback(-1);
        } else {
            callback(wish.acheve);
        }
    });
}

exports.achieveWish = function (id, callback) {
    db.wish.update({"_id": "ObjectId("+id+")"}, {$set: {"Achieve": true}}, function (err, updated) {
        if (!err && updated) {
            console.log(id + " 领取失败");
        }
        callback(updated);
    })
}