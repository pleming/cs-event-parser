var http = require("../libs/HttpRequest");

var eventTypeInfo = {
    "1+1": {
        searchCondition: 23,
        value: 1
    },
    "2+2": {
        searchCondition: 24,
        value: 2

    },
    "3+1": {
        searchCondition: 49,
        value: 3
    }
};

var eventTypeKeys = Object.keys(eventTypeInfo);

var collectProductInfo = function (productInfo, searchCondition, pageIndex, callback) {
    console.log(JSON.stringify({
        pageIndex: pageIndex,
        listType: 0,
        searchCondition: eventTypeInfo[searchCondition].searchCondition,
        user_id: ""
    }));

    http.connect("http://cu.bgfretail.com/event/plusAjax.do", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        params: {
            pageIndex: pageIndex,
            listType: 0,
            searchCondition: eventTypeInfo[searchCondition].searchCondition,
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
                eventType: eventTypeInfo[searchCondition].value
            };

            productInfo.push(prodObj);
            passFlag = true;
        });

        if (passFlag == false) {
            callback();
            return;
        }

        collectProductInfo(productInfo, searchCondition, pageIndex + 1, callback);
    });
};

var collectEventType = function (productInfo, eventTypeIdx, callback) {
    if (eventTypeIdx == eventTypeKeys.length) {
        callback();
        return;
    }

    collectProductInfo(productInfo, eventTypeKeys[eventTypeIdx], 1, function () {
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

