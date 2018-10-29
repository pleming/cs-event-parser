var http = require("../libs/HttpRequest");

var eventTypeInfo = [1, 2];

var collectProductInfo = function (productInfo, eventType, intCurrPage, callback) {
    console.log(JSON.stringify({
        intPageSize: 10,
        intCurrPage: intCurrPage,
        pTab: eventType
    }));

    http.connect("http://www.7-eleven.co.kr/product/listMoreAjax.asp", {
        method: "POST",
        params: {
            intPageSize: 10,
            intCurrPage: intCurrPage,
            pTab: eventType
        }
    }, function ($, html, error) {
        var passFlag = false;

        $("div.pic_product").each(function (i, elem) {
            if (i % 2 == 1)
                return true;

            var prodObj = {
                name: $(elem).find("div.name").text(),
                price: parseInt($(elem).find("div.price").text().replace(",", "")),
                eventType: eventType
            };

            productInfo.push(prodObj);
            passFlag = true;
        });

        if (passFlag == false) {
            callback();
            return;
        }

        collectProductInfo(productInfo, eventType, intCurrPage + 1, callback);
    });
};

var collectEventType = function (productInfo, eventTypeIdx, callback) {
    if (eventTypeIdx == eventTypeInfo.length) {
        callback();
        return;
    }

    collectProductInfo(productInfo, eventTypeInfo[eventTypeIdx], 0, function () {
        collectEventType(productInfo, eventTypeIdx + 1, callback);
    });
};

var run = function (callback) {
    var productInfo = [];

    collectEventType(productInfo, 0, function () {
        callback(productInfo);
    });

};

var obj = {
    run: run
};

exports = module.exports = obj;