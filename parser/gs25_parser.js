var http = require("../libs/HttpRequest");

var eventTypeInfo = [
    {
        eventId: 1,
        parameterList: "ONE_TO_ONE"
    },
    {
        eventId: 2,
        parameterList: "TWO_TO_ONE"
    }
];

var collectProductInfo = function (productInfo, eventType, pageNum, callback) {
    console.log(JSON.stringify({
        pageNum: pageNum,
        pageSize: 1000000000,
        parameterList: eventType.parameterList
    }));

    http.connect("http://gs25.gsretail.com/gscvs/ko/products/event-goods-search?CSRFToken=c32a7337-cde9-4d22-9bf3-0e25c6926495", {
        method: "POST",
        headers: {
            "Cookie": "SCOUTER=xuefdnr0u38ku; JSESSIONID=12DE569A5A3C7C76ADE4ED02760988CC.htomcat2; s_fid=6049A97CE57F9502-2F2D2AE7142D5732; s_cc=true; _BS_GUUID=Ts1IWHXLDwNFnUh6z3ynGc1MBrfSi6ibzkUv1SgF; _ga=GA1.3.27417613.1528982369; _gid=GA1.3.1096157646.1528982369; 1_layerPopCnt=3; _TRK_EX22400=1; _TRK_UID=8021c8edd64f6034bb417c0b0c1abdb7:1:0.022715856481481483:1528984331191; _TRK_SID=9448448cb541842d99d35387d6710bc6; _TRK_CR22400=http%3A%2F%2Fgs25.gsretail.com%2Fgscvs%2Fko%2Fmain; _dc_gtm_UA-64404561-2=1; _dc_gtm_UA-64404561-6=1; s_sq=%5B%5BB%5D%5D"
        },
        params: {
            pageNum: pageNum,
            pageSize: 1000000000,
            parameterList: eventType.parameterList
        }
    }, function ($, html, error) {
        var prodObj = JSON.parse(JSON.parse(html));
        var prodInfo = prodObj["results"];

        for (var i = 0; i < prodInfo.length; i++) {
            var prod = {
                name: prodInfo[i].goodsNm,
                price: prodInfo[i].price,
                eventType: eventType.eventId
            };

            productInfo.push(prod);
        }

        if (prodInfo.length == 0) {
            callback();
            return;
        }

        collectProductInfo(productInfo, eventType, pageNum + 1, callback);
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