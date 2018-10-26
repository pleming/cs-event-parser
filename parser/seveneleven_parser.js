var http = require("../libs/HttpRequest");

var eventTypeInfo = [1, 2];

var collectProductInfo = function (productInfo, pTab, pageIndex, callback) {
    console.log(JSON.stringify({
        intPageSize: 10,
        intCurrPage: pageIndex,
        pTab: pTab
    }));

    http.connect("http://www.7-eleven.co.kr/product/listMoreAjax.asp", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        params: {
            intPageSize: 10,
            intCurrPage: pageIndex,
            pTab: pTab
        }
    }, function ($, html, error) {
        var passFlag = false;

        $("div.pic_product").each(function (i, elem) {
            if (i % 2 == 1)
                return true;

            var prodObj = {
                name: $(elem).find("div.name").text(),
                price: parseInt($(elem).find("div.price").text().replace(",", "")),
                eventType: pTab
            };

            productInfo.push(prodObj);
            passFlag = true;
        });

        if (passFlag == false) {
            callback();
            return;
        }

        collectProductInfo(productInfo, pTab, pageIndex + 1, callback);
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