/*
 * GET home page.
 */
var wishDB = require("../db/wish");
var personDB = require("../db/person");

var cache = require("memory-cache");
var crypto = require("crypto");

cache.put("seat", false);

exports.view = function (req, res) {
    var userCode = req.session.userCode;
    wishDB.getWishes(function (err, wishes) {
        res.render('wish', { "title": 'Merry Christmas', "userCode": userCode, "wishes": wishes});
    })
};

exports.getPassCode = function (req, res) {
    var userCode = req.session.userCode;
    var sha1 = crypto.createHash("sha1");
    var passcode1 = sha1.update(userCode + "").digest("base64");
    sha1 = crypto.createHash("sha1");
    var passcode2 = sha1.update(passcode1 + "").digest("base64");
    personDB.createPassCode(passcode1, function (saved) {
        if (saved) {
            personDB.createPassCode(passcode2, function (saved) {
                res.json([
                    {"passCode": passcode1},
                    {"passCode": passcode2}
                ]);
            })
        }
    });
};

exports.addFirst = function (req, res) {
    var seat = cache.get("seat");
    if (seat) {
        res.json(-2);
        return
    }
    cache.put("seat", true);
    var userCode = req.session.userCode;
    personDB.getPerson(userCode, function (person) {
        if (person) {
            wishDB.saveNewWish(
                {
                    "person": {
                        "name": person.userCode,
                        "url": person.personUrl,
                        "words": person.words
                    },
                    "item": {
                        "name": person.name,
                        "url": person.url,
                        "img": person.img
                    },
                    "Achieve": false
                },
                function (saved) {
                    res.json(saved || updated);
                    cache.put("seat", false);
                }
            );
        } else {
            console.log("db/getPerson 没有找到:" + person);
        }
    });
}

exports.achieve = function (req, res) {
    var seat = cache.get("seat");
    if (seat) {
        res.json(-2);
        return
    }
    cache.put("seat", true);
    var id = req.body.wishId;
    var userCode = req.session.userCode;
    console.log("用户:" + userCode + " 占座");
    personDB.checkMade(userCode, function (made) {
        if (made == true) {
            res.json(-3);
            cache.put("seat", false);
            return;
        }
        wishDB.wishCheck(id, function (achieve) {
            if (achieve == false) {
                wishDB.achieveWish(id, userCode, function (updated) {
                    console.log("updated:" + updated);
                    personDB.getPerson(userCode, function (person) {
                        wishDB.saveNewWish(
                            {
                                "person": {
                                    "name": person.userCode,
                                    "url": person.personUrl,
                                    "words": person.words
                                },
                                "item": {
                                    "name": person.name,
                                    "url": person.url,
                                    "img": person.img
                                },
                                "Achieve": false
                            },
                            function (saved) {
                                console.log("saved:" + saved);
                                res.json(saved || updated);
                                cache.put("seat", false);
                                console.log("用户:" + userCode + " 实现了上一位的愿望");
                                console.log("用户:" + userCode + " 正常离座");
                            }
                        );
                    });
                });
            } else {
                cache.put("seat", false);
                console.log("用户:" + userCode + " 异常离座，该愿望已经被实现了");
                res.json(-1);
            }
        });
    });
};