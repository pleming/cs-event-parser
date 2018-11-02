var mysql = require("./libs/MySQLConnector");
var cu_parser = require("./parser/cu_parser");
var gs25_parser = require("./parser/gs25_parser");
var seveneleven_parser = require("./parser/seveneleven_parser");

var conn = mysql.connect("127.0.0.1", "ple", "password", "cs_event");

var insertDB = function (productInfo, productIdx, csType, callback) {
    if (productIdx == productInfo.length) {
        callback();
        return;
    }

    productInfo[productIdx]["cs_type"] = csType;
    productInfo[productIdx]["event_type"] = productInfo[productIdx].eventType;

    delete productInfo[productIdx].eventType;

    conn.query("INSERT INTO cs_product SET ?", productInfo[productIdx], function () {
        insertDB(productInfo, productIdx + 1, csType, callback);
    });
};

cu_parser.run(function (productInfo) {
    insertDB(productInfo, 0, 1, function () {
        console.log("CU Complete.");
    });
});

gs25_parser.run(function (productInfo) {
    insertDB(productInfo, 0, 2, function() {
        console.log("GS25 Complete.");
    });
});

seveneleven_parser.run(function (productInfo) {
    insertDB(productInfo, 0, 3, function() {
        console.log("7-ELEVEN Complete.");
    });
});
