var http = require("../libs/HttpRequest");
var request = require("request");

var eventTypeInfo = [
    {
        searchCondition: 23,
        eventId: 1
    },
    {
        searchCondition: 24,
        eventId: 2
    },
    {
        searchCondition: 49,
        eventId: 3
    }
];

var collectImage = function (productInfo, productIdx, callback) {
    if (productIdx == productInfo.length) {
        callback();
        return;
    }

    request({
        url: productInfo[productIdx].imgUrl,
        encoding: "binary",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        }
    }, function (err, res, body) {
        console.log((productIdx + 1) + " : " + productInfo[productIdx].name + "(" + productInfo[productIdx].imgUrl + ") Complete.");

        var imgByte = new Buffer(body, "binary");
        productInfo[productIdx].image = imgByte;
        delete productInfo[productIdx].imgUrl;

        collectImage(productInfo, productIdx + 1, callback);
    });
};

var collectProductInfo = function (productInfo, eventType, pageIndex, callback) {
    http.connect("http://cu.bgfretail.com/event/plusAjax.do", {
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        params: {
            pageIndex: pageIndex,
            listType: 0,
            searchCondition: eventType.searchCondition,
            user_id: ""
        }
    }, function ($, html, error) {
        var passFlag = false;

        $("ul > li").each(function (i, elem) {
            if (i % 2 == 1)
                return true;

            var prodObj = {
                name: $(elem).children("p.prodName").text(),
                price: parseInt($(elem).children("p.prodPrice").text().replace(",", "")),
                eventType: eventType.eventId,
                imgUrl: $(elem).find("div.photo > a > img").attr("src")
            };

            productInfo.push(prodObj);
            passFlag = true;

            console.log(productInfo.length + " : " + prodObj.name + " Complete.");
        });

        if (passFlag == false) {
            callback();
            return;
        }

        collectProductInfo(productInfo, eventType, pageIndex + 1, callback);
    });
};

var collectEventType = function (productInfo, eventTypeIdx, callback) {
    if (eventTypeIdx == eventTypeInfo.length) {
        callback();
        return;
    }

    collectProductInfo(productInfo, eventTypeInfo[eventTypeIdx], 1, function () {
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