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
		//getUserInfo('18900167332',function (err, mcars){
		getUserInfo(tel,function (err, mcars){

          if (mcars&&mcars.length>5){
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
			return	res.redirect('/mycar/list');
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

function sendtokf(info, cb) {
    
    var data1 = '{"token":"' + config.bztoken + '"}';
	var ddate = _.merge(JSON.parse(data1),info);
	var queryStr = tools.myCipheriv(JSON.stringify(ddate), config);
    var client = request.createClient('http://kf.wx.hnbenz.com/');
	var data = {
		"QueryStr": queryStr
		};
    client.post('sendtokf', data, function (error, response, body) {
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
exports.sendtokf = sendtokf;
exports.getUserInfo = getUserInfo;

