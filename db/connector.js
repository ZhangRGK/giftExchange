/**
 * Created by ruizhang on 13-12-6.
 * updated by yukun on 13-12-11
 */

exports.connect = function () {
    var databaseurl = "xmas2013";
    var collections = ["wish","person"];
    return require("mongojs").connect(databaseurl, collections);
};