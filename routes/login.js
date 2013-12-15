/**
 * Created by ruizhang on 13-12-8.
 */

var base = {title:"MerryChristmas"};
exports.view = function (req, res) {
    res.render('login', base);
};