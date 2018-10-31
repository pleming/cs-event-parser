var mysql = require("./libs/MySQLConnector");
var cu_parser = require("./parser/cu_parser");
var gs25_parser = require("./parser/gs25_parser");
var seveneleven_parser = require("./parser/seveneleven_parser");

var conn = mysql.connect("127.0.0.1", "ple", "password", "cs_event");

var insertDB = function (productInfo, csType) {
    for (var i = 0; i < productInfo.length; i++) {
        productInfo[i]["cs_type"] = csType;
        productInfo[i]["event_type"] = productInfo[i].eventType;

        delete productInfo[i].eventType;

        conn.query("INSERT INTO cs_product SET ?", productInfo[i]);
    }
};

cu_parser.run(function (productInfo) {
    insertDB(productInfo, 1);
});

gs25_parser.run(function (productInfo) {
    insertDB(productInfo, 2);
});

seveneleven_parser.run(function (productInfo) {
    insertDB(productInfo, 3);
});