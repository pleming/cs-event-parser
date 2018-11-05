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

var collectImage = function (productInfo, productIdx, callback) {
    if (productIdx == productInfo.length) {
        callback();
        return;
    }

    http.imageConnect(productInfo[productIdx].imgUrl, {}, function(imgBuf, error) {
        console.log((productIdx + 1) + " : " + productInfo[productIdx].name + "(" + productInfo[productIdx].imgUrl + ") Complete.");

        productInfo[productIdx].image = imgBuf;
        delete productInfo[productIdx].imgUrl;

        collectImage(productInfo, productIdx + 1, callback);
    });
};

var collectProductInfo = function (productInfo, eventType, pageNum, callback) {
    http.connect("http://gs25.gsretail.com/gscvs/ko/products/event-goods-search?CSRFToken=e028681d-85ef-4a06-b0e2-d25d84d302c5", {
        method: "POST",
        headers: {
            "Cookie": "SCOUTER=xuefdnr0u38ku; s_fid=6049A97CE57F9502-2F2D2AE7142D5732; _BS_GUUID=Ts1IWHXLDwNFnUh6z3ynGc1MBrfSi6ibzkUv1SgF; _ga=GA1.3.27417613.1528982369; 1_layerPopCnt=3; _TRK_CR22400=https%3A%2F%2Fwww.google.co.kr%2F; s_cc=true; _gid=GA1.3.2062667491.1529157334; JSESSIONID=D429BE1E398C6E50674BD8E0B944F100.htomcat1; _TRK_UID=f0bf63fc6322d27f205060977f25f2e7:1:0.07771681712962963:1529164048208; _TRK_EX22400=5; _TRK_SID=5b0f9ef50149046d9faac983d6b077e5; s_sq=gsretail-com-prd%3D%2526c.%2526a.%2526activitymap.%2526page%253D%2525EC%252583%252581%2525ED%252592%252588%25255E%2525ED%252596%252589%2525EC%252582%2525AC%2525EC%252583%252581%2525ED%252592%252588%2526link%253D2%2526region%253Dcontents%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253D%2525EC%252583%252581%2525ED%252592%252588%25255E%2525ED%252596%252589%2525EC%252582%2525AC%2525EC%252583%252581%2525ED%252592%252588%2526pidt%253D1%2526oid%253Dhttp%25253A%25252F%25252Fgs25.gsretail.com%25252Fgscvs%25252Fko%25252Fproducts%25252Fevent-goods%252523%25253B%2526ot%253DA"
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
                eventType: eventType.eventId,
                imgUrl: prodInfo[i].attFileNmOld
            };

            productInfo.push(prod);

            console.log((i + 1) + " : " + prod.name + " Complete.");
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
        collectImage(productInfo, 0, function () {
            callback(productInfo);
        });
    });
};

var obj = {
    run: run
};

exports = module.exports = obj;