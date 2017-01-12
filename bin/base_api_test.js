// 一次性脚本
var config = require('../config');
var auth = require('../middlewares/auth');
var tools = require('../common/tools');
var CryptoJS = require("crypto-js");
var topclient        = require('../common/tools').topclient;
var request = require('request-json');
var moment = require('moment');


 var data1 = '{"token":"' + config.bztoken + '","openid":"oJme-szsGYjRcIMIFxvvt5XAI8qo","text":"我来试试234444"}';
    var queryStr = tools.myCipheriv(data1, config);

    var client = request.createClient('http://webot-bz.ittun.com/');
    var data = {
		"QueryStr": queryStr
		};
	console.log(data);
	client.post('api/v1/base/sendText', data, function (error, response, body) {

      console.log(body);
		if (!error && response.statusCode == 200) {
			if (body.ResultData) {
                console.log(tools.myDecipheriv(body.ResultData, config));
			//	cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				//cb(null, null);
			}
		} else {
			//cb(null, null);
		}

	});
