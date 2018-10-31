var http = require("../libs/HttpRequest");

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

var collectProductInfo = function (productInfo, eventType, pageIndex, callback) {
    console.log(JSON.stringify({
        pageIndex: pageIndex,
        listType: 0,
        searchCondition: eventType.searchCondition
    }));

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
                eventType: eventType.eventId
            };

            productInfo.push(prodObj);
            passFlag = true;
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
        callback(productInfo);
    });
};

var obj = {
    run: run
};

exports = module.exports = obj;