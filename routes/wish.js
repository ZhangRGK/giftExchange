/*
 * GET home page.
 */
var wishDB = require("../db/wish");
var personDB = require("../db/person");

var cache = require("memory-cache");
var crypto = require("crypto");

cache.put("seat",false);

exports.view = function (req, res) {
    var userCode = req.session.userCode;
    wishDB.getWishes(function (err, wishes) {
        res.render('wish', { "title": 'MerryChristmas', "userCode": userCode, "wishes": wishes});
    })
};

exports.getPassCode = function(req,res) {
    var userCode = req.session.userCode;
    var sha1 = crypto.createHash("sha1");
    var passcode1 = sha1.update(userCode+"").digest("base64");
    sha1 = crypto.createHash("sha1");
    var passcode2 = sha1.update(passcode1+"").digest("base64");
    personDB.createPassCode(passcode1,function(saved) {
        if(saved) {
            personDB.createPassCode(passcode2,function(saved) {
                res.json([{"passCode":passcode1},{"passCode":passcode2}]);
            })
        }
    });
};

exports.addFirst = function(req, res) {
    var seat = cache.get("seat");
    if(seat) {
        res.json(-2);
        return
    }
    cache.put("seat",true);
    var userCode = req.session.userCode;
    personDB.getPerson(userCode,function(person) {
        wishDB.saveNewWish(
            {
                "person": {
                    "name": person.userCode,
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
                res.json(saved||updated);
                cache.put("seat",false);
            }
        );
    });
}

exports.achieve = function (req, res) {
    var seat = cache.get("seat");
    if(seat) {
        res.json(-2);
        return
    }
    cache.put("seat",true);
    var id = req.body.wishId;
    var userCode = req.session.userCode;
    wishDB.wishCheck(id, function (acheve) {
        if (acheve == false) {
            wishDB.achieveWish(id, function (updated) {
                personDB.getPerson(userCode,function(person) {
                    wishDB.saveNewWish(
                        {
                            "person": {
                                "name": person.userCode,
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
                            res.json(saved||updated);
                            cache.put("seat",false);
                        }
                    );
                });
            });
        } else {
            res.json(-1);
        }
    });
};