// 一次性脚本
var config = require('../config');
var auth = require('../middlewares/auth');
var tools = require('../common/tools');
var CryptoJS = require("crypto-js");
var topclient        = require('../common/tools').topclient;
var request = require('request-json');
var moment = require('moment');
console.log(moment().format());
console.log(moment().add(1, 'd').format());
console.log(moment().add(1, 'd').hour(26-24).format());
//console.log(moment().add(1, 'd').hour(26-24).format());

// var data1 = '{"token":"' + config.bztoken + '"}';

// //var data1 = '{"token":"' + config.bztoken + '","id":"5853913631aef26d13de1ad7","state":"3","name":"王岩"}';
//     var queryStr = tools.myCipheriv(data1, config);

//     var client = request.createClient('http://webot-bz.ittun.com/');
//     var data = {
// 		"QueryStr": queryStr
// 		};
// 	console.log(data);
//     client.post('api/v1/park/park_list', data, function (error, response, body) {
// 	//client.post('api/v1/park/park_update', data, function (error, response, body) {
//       console.log(body);
// 		if (!error && response.statusCode == 200) {
// 			if (body.ResultData) {
//                 console.log(tools.myDecipheriv(body.ResultData, config));
// 			//	cb(null, tools.myDecipheriv(body.ResultData, config));
// 			} else {
// 				//cb(null, null);
// 			}
// 		} else {
// 			//cb(null, null);
// 		}

// 	});

//加密解密
// var mm="奔驰信息abcdefghijk1234567890-=\][]";
// var jmmm=tools.myCipheriv(mm,config);
// console.log(jmmm);
// var jm=tools.myDecipheriv(jmmm,config);
// console.log(jm);

//阿里大于短信发送
	// topclient.execute( 'alibaba.aliqin.fc.sms.num.send' , {
	// 	'extend' : '' ,
	// 	'sms_type' : 'normal' ,
	// 	'sms_free_sign_name' : config.tosms.sms_free_sign_name ,
	// 	'sms_param' : "{name:'3453'}" ,
	// 	'rec_num' : '13700882704' ,
	// 	'sms_template_code' : config.tosms.sms_template_code
	// }, function(error, response) {
	// 	if (!error) console.log(response);
	// 	else console.log(error);
	// });

//auth.getIdentify('oYVvgv9ECQTYKRfXaQqxNd2z2Xm8',config ,function (e,query) {

//console.log(query);
//});
//oYVvgv4JiK4VdVllnPMqLxuaKqdA
//oYVvgv9ECQTYKRfXaQqxNd2z2Xm8
//auth.getUserInfo('oYVvgv4JiK4VdVllnPMqLxuaKqdA',config ,function (e,query) {	
//	console.log(query);
//});
//auth.getAssets('005800000000032447',config ,function (e,query) {	
//	console.log(query);
//});


//counters = new CountersModel({name : 'company'});
//counters.save();
//counters = new CountersModel({name : 'repair_type',seq:23});
//counters.save();
// var ss = "UJ2q5agOVmvqBJgECbVQfA3+9bTIcV4iJBfgaGphBLUReRfmVLeMd48ucY+ufl1rQM5X5eH+KSne8bW7pgYSd04PM7CnzY7LFVAwwMNVWUB2pEYvuftbLmNh/Agded3RKL4J5odRI/E+aK03ilea93azMJXXYj4epau/hw1ogf16o9ahUGIIkQO64rBND18aIWIyc0FOAmSfyutDiay9SBFD3DinNyTO0qsIk0d9/Vusq4Mwo0aQzR1q9+vmb6NmYYA5OkSPMMLgmZ0fs1QSG6WLkY9as6Lahib6E2BfRcM8Aytx2oXLkRFgi6dndBxBXRRKMUfzNZtLeDovy9wDrVc5xUlKGuaKmSyv0SZ67j5JnS95VQwlLwR3BrlYjFW8YISmn1tcGsUgDaMIYMPmUMNfWxDuRoP/Yj/fvDI8XYbQcCFYkDiD+lnjiLOmOdAnBfyM9nTZnnCjOVllaukdHPy7O+CS5gsKR0KXb9Ev9KrkECsQpcE3Tf0lr18AnRntLMFpgl1Oc8qorfKxHFRikcqS4Xllepv2mgABY81pIp7XVCmmlmYf5en9miVyqVRxxCYeVVJBdnV5sMu63nbg6+pL90WSxo3xjRuTrstbfgJZEoeYrGOltpTlxNQTN55cyhKeU6YAwuPX5D83wjc07gRkpnhhcWeZUpI9+7VPhtU=";
// var data = tools.myCipheriv("wolaishishi,我来试试",config);
// var query = tools.myDecipheriv(data,config);
// console.log(query);