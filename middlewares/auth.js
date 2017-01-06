var mongoose = require('mongoose');

var UserModel = require('../models').User;
var request = require('request-json');
var tools = require('../common/tools')
var config = require('../config');
var eventproxy = require('eventproxy');
var WechatAPI = require('wechat-api');
//var validator = require('validator');
var client        = require('../common/tools').oauthClient;
var TokenModel = require('../models').Token;
var topclient        = require('../common/tools').topclient;
var _            = require('lodash');
var CarModel = require('../models').Car;
/**
 * 检查是否绑定手机号。
 */
exports.userRequired = function (req, res, next) {
	// console.log(req.session);
	if (req.session.user&&req.session.user.tel) {
       next();
	}else{
	var code = req.param('code')//我们要的code
    client.getAccessToken(code, function (err, result) {
       //var accessToken = result.data.access_token;
	   if (err) return	res.redirect('/bzshow');
	//    console.log(result);
       var openid = result.data.openid;
	   UserModel.findOne({ open_id: openid }, null, function (err, user) {
			if (user&&user.tel) {
			   req.session.user=user;
        	   next();
            }else{
				req.session.user=user;
				return	res.redirect('/sign?r_url='+req.originalUrl);
			}
		});
    });
  }
	//next();

};

exports.sign = function (req, res, next) {
	var openid = req.query.openid||req.session.user.open_id;
	var r_url = req.query.r_url||'/mycar/list'  ;
	var err = 0;
	err = req.query.err;
	res.render('sign', { openid: openid,r_url:r_url ,err: err });
	
}
exports.login = function (req, res, next) {
	var openid = req.body.openid;
	var tel = req.body.tel;
	var r_url = req.body.r_url;
	//需要验证码校验
	var code = req.session.checkCode;
    if (code ===req.body.checkCode){
	
	UserModel.findOne({ open_id: openid }, null, function (err, user) {		
		user.tel=tel;
		//增加获取车辆信息接口
		getUserInfo('18900167332',function (err, mcars){

          if (mcars){
			 JSON.parse(mcars).map(function (mycar) {
				 var car = new CarModel();
				 car.open_id=user.open_id;
				 car.username=mycar.name;
				 car.tel=user.tel;
				 car.kind=mycar.car_name;
				 car.plate_number=mycar.plate_number;
				 car.save();
				 user.username=mycar.name;
			 });
			 req.session.user=user;
		     user.save();
             return	res.redirect(r_url);
		  }else{
			req.session.user=user; 
			return	res.redirect(r_url);
		  }
		});

        
       
		});
	}else{
		return	res.redirect('/sign?r_url='+r_url);
	}

}

exports.checkCode = function (req, res, next) {

	var tel=req.body.phone;
    var code=req.body.code;
	req.session.checkCode=code;
    //阿里大于短信发送
	topclient.execute( 'alibaba.aliqin.fc.sms.num.send' , {
		'extend' : '' ,
		'sms_type' : 'normal' ,
		'sms_free_sign_name' : config.tosms.sms_free_sign_name ,
		'sms_param' : "{name:'"+code+"'}" ,
		'rec_num' : tel ,
		'sms_template_code' : config.tosms.sms_template_code
	}, function(error, response) {
		if (!error) console.log(response);
		else console.log(error);
	});
   res.json({status: 'success'});
	
	
}

function getUserInfo(tel, cb) {
    // var data1 = '{"Token":"' + config.pftoken + '","OpenID":"' + openid + '","Pid":"' + config.weixingzh + '"}';
    var data1 = '{"token":"' + config.bztoken + '","tel":"'+tel+'"}';
	var queryStr = tools.myCipheriv(data1, config);
    var client = request.createClient('http://parking.wx.hnbenz.com/');
	var data = {
		"QueryStr": queryStr
		};

    client.post('userinfo', data, function (error, response, body) {
      //console.log(body);
		if (!error && response.statusCode == 200) {
			if (body.ResultData) {

				cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}

	});
}

function sendQyMsg(parkOrder, cb) {
    
    var data1 = '{"token":"' + config.bztoken + '"}';
	var ddate = _.merge(JSON.parse(data1),parkOrder);
	var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
    var client = request.createClient('http://parking.wx.hnbenz.com/');
	var data = {
		"QueryStr": queryStr
		};
    client.post('msg', data, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if (body.ResultData) {

				cb(null, tools.myDecipheriv(body, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}

	});
}
exports.sendQyMsg = sendQyMsg;




// //微信推送
// exports.sendTemplateOne = function (repairCurrent, usertype) {
// 	//var api = new WechatAPI(config.weixin.appId, config.weixin.appSecret);
// 	var url = 'http://' + config.host + '/' + repairCurrent._id + '/edit?usertype=' + usertype;
// 	var data = {
// 		"first": { "value": "您好，您有新的待办任务！", "color": "#174177" },
// 		"keyword1": { "value": repairCurrent.repairContent, "color": "#173177" },
// 		"keyword2": { "value": "待办", "color": "#172177" },
// 		"remark": { "value": "要求完成时间:" + repairCurrent.LstWarn_at_ago + "\n请抽空处理谢谢。", "color": "#171177" }
// 	};
// 	var userid = repairCurrent.signid;
// 	if (usertype === 2) { userid = repairCurrent.managerid; };
// 	if (usertype === 3) { userid = repairCurrent.companyid; };
// 	if (usertype === 4) { userid = repairCurrent.comtact_mob; };
// 	UserModel.findOne({ UserId: userid }, function (e, user) {
// 		if (user) {
// 			// console.log(usertype+'---'+userid);
// 			// api.sendTemplate(user.OpenId, config.weixin.templateId, url, data, function (err, result) { });
// 			sendTemplate(user.OpenId, url, JSON.stringify(data), config, function (err, result) { });
// 		}
// 	});
// };


// // 验证用户第一步
// exports.authUserOne = function (req, res, next) {


// 	if (!req.session || !req.session.user) {
// 		var openid = req.query.open_id;

// 		UserModel.findOne({ OpenId: openid }, function (e, user) {
// 			if (user) {
// 				req.session.user = user;
// 				return next();
// 			} else {
// 				return next();
// 			}
// 		});
// 	} else {
// 		return next();
// 	}
// };
// //验证用户第二步
// exports.authUserTwo = function (req, res, next) {

// 	if (!req.session || !req.session.user) {
// 		var openid = req.query.open_id;
// 		getUserInfo(openid, config, function (e, user1) {
// 			console.log(user1);
// 			if (user1) {
// 				var user = JSON.parse(user1);
// 				var myUser = new UserModel();
// 				myUser.OpenId = openid;
// 				myUser.NickName = user.NickName;
// 				myUser.UserPhotoUrl = user.UserPhotoUrl;
// 				myUser.Pid = user.Pid;
// 				myUser.UserId = user.UserId;
// 				myUser.UserName = user.UserName;
// 				myUser.OrgName = user.OrgName;
// 				myUser.FixedPhone = user.FixedPhone;
// 				myUser.CellPhone = user.CellPhone;
// 				myUser.Email = user.Email;
// 				RepairManagerModel.findOne({ managerid: user.UserId }, function (e, manager) {
// 					if (manager) {
// 						myUser.usertype = '2';
// 						req.session.user = myUser;
// 						myUser.save();
// 						return next();
// 					} else {
// 						myUser.usertype = '1';
// 						req.session.user = myUser;
// 						myUser.save();
// 						return next();
// 					}
// 				});

// 			} else {
// 				return next();
// 			}
// 		});
// 	} else {
// 		return next();
// 	}
// };
// //验证用户第三步
// exports.authUserThree = function (req, res, next) {

// 	if (!req.session || !req.session.user) {
// 		res.redirect('/sign?openid=' + req.query.open_id);
// 	} else {
// 		return next();
// 	}
// };

// function getIdentify(openid, config, cb) {
//     var url = 'WChart/Identify?open_id=' + openid + '&pid=' + config.weixingzh;
//     var client = request.createClient('http://www.spdbcloud.com/');
//     client.get(url, function (error, response, body) {
//         if (error) {
// 			cb('getIdentify error', error);
//         }
//         else {
//             try {
//                 var flag = body.flag;
//                 console.log(body);
//                 cb(null, flag);
//             }
//             catch (e) {
// 				cb('getIdentify error', error);
//             }
//         }
//     });
// }

// function sendTemplate(openid, url, data, config, cb) {

// 	var data1 = '{"Token":"' + config.pftoken + '","authflag":"' + config.authflag + '","touser":"' + openid + '","template_id":"' + 1 + '","url":"' + url + '","data":"' + data + '"}';

// 	var queryStr = tools.myCipheriv(data1, config);
// 	var client = request.createClient('http://www.spdbcloud.com/');
// 	var data = {
// 		"Uid": 1,
// 		"QueryStr": queryStr,
// 		"ReqCode": 0
//     };
// 	client.post('api/WChartMsgTemple', data, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			if (body.ResultData) {
// 				cb(null, tools.myDecipheriv(body.ResultData, config));
// 			} else {
// 				cb(null, null);
// 			}
// 		} else {
// 			cb(null, null);
// 		}

// 	});
// }

// function getUserInfo(openid, config, cb) {
//     var data1 = '{"Token":"' + config.pftoken + '","OpenID":"' + openid + '","Pid":"' + config.weixingzh + '"}';
//     var queryStr = tools.myCipheriv(data1, config);

//     var client = request.createClient('http://www.spdbcloud.com/');
//     var data = {
// 		"Uid": 1,
// 		"QueryStr": queryStr,
// 		"ReqCode": 0
//     };
// 	console.log(data);
//     client.post('api/WChartUserInfo', data, function (error, response, body) {
//       console.log(body);
// 		if (!error && response.statusCode == 200) {
// 			if (body.ResultData) {

// 				cb(null, tools.myDecipheriv(body.ResultData, config));
// 			} else {
// 				cb(null, null);
// 			}
// 		} else {
// 			cb(null, null);
// 		}

// 	});
// }

function getAssets(AssetsNo, config, cb) {
    var data = '{AssetsNo:"' + AssetsNo + '",Token:"' + config.pftoken + '"}';

    var queryStr = tools.myCipheriv(data, config);
	var client = request.createClient('http://www.spdbcloud.com/');
    var data = {
		"Uid": 1,
		"QueryStr": queryStr,
		"ReqCode": 0
    };
    client.post('api/WChartAssets', data, function (error, response, body) {

		if (!error && response.statusCode == 200) {

			if (body.ResultData) {
				cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}
	});
}
exports.getAssets = getAssets;
exports.getUserInfo = getUserInfo;
//exports.getIdentify = getIdentify;
//exports.sendTemplate = sendTemplate;
