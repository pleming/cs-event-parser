var cu_parser = require("./parser/cu_parser");

cu_parser.run(function (productInfo) {
    for (var i = 0; i < productInfo.length; i++)
        console.log(i + 1 + " : " + JSON.stringify(productInfo[i]));
});