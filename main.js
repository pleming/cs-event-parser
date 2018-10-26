var cu_parser = require("./parser/cu_parser");
var seveneleven_parser = require("./parser/seveneleven_parser");

cu_parser.run(function (productInfo) {
    for (var i = 0; i < productInfo.length; i++)
        console.log(i + 1 + " : " + JSON.stringify(productInfo[i]));
});

seveneleven_parser.run(function (productInfo) {
    for (var i = 0; i < productInfo.length; i++)
        console.log(i + 1 + " : " + JSON.stringify(productInfo[i]));
});