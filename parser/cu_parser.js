var http = require("../libs/HttpRequest");

var collectProductInfo = function(productInfo, pageIndex, searchCondition, callback) {
    http.connect("http://cu.bgfretail.com/event/plusAjax.do", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        params: {
            pageIndex: pageIndex,
            listType: 0,
            searchCondition: searchCondition,
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
                eventType: $(elem).find("ul > li").text()
            };

            productInfo.push(prodObj);
            passFlag = true;
        });

        if(passFlag == false) {
            callback();
            return false;
        }

        collectProductInfo(productInfo, pageIndex + 1, searchCondition, callback);
    });
};

var run = function (callback) {
    var productInfo = [];

    collectProductInfo(productInfo, 1, 23, function() {
        callback(productInfo);
    });

};

var obj = {
    run: run
};

exports = module.exports = obj;

