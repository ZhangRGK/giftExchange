/**
 * Created by ruizhang on 13-12-6.
 */

exports.connect = function () {
    var databaseurl = "test";
    var collections = ["wish","person"];
    return require("mongojs").connect(databaseurl, collections);
}