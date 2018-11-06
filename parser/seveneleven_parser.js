var http = require("../libs/HttpRequest");

var eventTypeInfo = [1, 2];

var collectImage = function (productInfo, productIdx, callback) {
    if (productIdx == productInfo.length) {
        callback();
        return;
    }

    http.imageConnect(productInfo[productIdx].imgUrl, {}, function (imgBuf, error) {
        console.log((productIdx + 1) + " : " + productInfo[productIdx].name + "(" + productInfo[productIdx].imgUrl + ") Complete.");

        productInfo[productIdx].image = imgBuf;
        delete productInfo[productIdx].imgUrl;

        collectImage(productInfo, productIdx + 1, callback);
    });
};

var collectProductInfo = function (productInfo, eventType, intCurrPage, callback) {
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
                eventType: eventType,
                imgUrl: "http://www.7-eleven.co.kr" + $(elem).find("img").attr("src")
            };

            productInfo.push(prodObj);
            passFlag = true;

            console.log(productInfo.length + " : " + prodObj.name + " Complete.");
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
        collectImage(productInfo, 0, function () {
            callback(productInfo);
        });
    });
};

var obj = {
    run: run
};

exports = module.exports = obj;