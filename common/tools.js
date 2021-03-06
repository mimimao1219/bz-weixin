var bcrypt = require('bcryptjs');
var moment = require('moment');
var CryptoJS = require("crypto-js");
//var TokenModel = require('../models').Token;
var config       = require('../config');
var redis       = require('./redis');


moment.locale('zh-cn'); // 使用中文
//微信页面授权获取用户openid
var OAuth = require('wechat-oauth');
var OAuthClient = new OAuth(config.weixin.appId, config.weixin.appSecret, function (openid, callback) {
  // 传入一个根据openid获取对应的全局token的方法
  // 在getUser时会通过该方法来获取token
	var TokenModel = require('../models').Token;
  TokenModel.getToken(openid, callback);
}, function (openid, token, callback) {
  // 持久化时请注意，每个openid都对应一个唯一的token!
	//console.log(UserModel);
	var TokenModel = require('../models').Token;
  TokenModel.setToken(openid, token, callback);
});
exports.oauthClient = OAuthClient;


var WechatAPI = require('wechat-api');
//var WeixinApi = new WechatAPI(config.weixin.appId, config.weixin.appSecret);
var WeixinApi = new WechatAPI(config.weixin.appId, config.weixin.appSecret, function (callback) {
  // 传入一个获取全局token的方法
	redis.get('access_token', function (err, result) {
  	if (err) {return callback(err);};
		 console.log(result);
    callback(null, JSON.parse(result));
  });
	
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
	redis.set('access_token', JSON.stringify(token),callback);
});

// 扩展新api : sendTextBykh
WechatAPI.patch("sendTextBykh", WeixinApi.endpoint + '/cgi-bin/message/custom/send');
WechatAPI.patch("sendImageBykh", WeixinApi.endpoint + '/cgi-bin/message/custom/send');
WechatAPI.patch("sendVoiceBykh", WeixinApi.endpoint + '/cgi-bin/message/custom/send');

exports.weixinApi = WeixinApi;



//发短息
TopClient = require( '../common/topClient' ).TopClient;
var topclient = new TopClient({
     'appkey' : config.tosms.appkey ,
     'appsecret' : config.tosms.appsecret ,
     'REST_URL' : 'http://gw.api.taobao.com/router/rest'
});
exports.topclient = topclient;

exports.randomCode = function (){
    var str="0123456789";
    var code = '';
    for(i = 0; i < 4; i++){
        code = code + str.charAt(Math.random() * 10);
    }
    return code;
}


//加密
exports.myCipheriv = function (data,config) {
	var _strKey = CryptoJS.enc.Utf8.parse(config.key);
	var _strVi = CryptoJS.enc.Utf8.parse(config.iv);
	var _QueryStr = CryptoJS.AES.encrypt(Buffer(data).toString('base64'), _strKey, { iv: _strVi, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString();
	return _QueryStr;
};
//解密
exports.myDecipheriv = function (data,config) {
	var _strKey = CryptoJS.enc.Utf8.parse(config.key);
	var _strVi = CryptoJS.enc.Utf8.parse(config.iv);
	var _QueryStr = CryptoJS.AES.decrypt(data, _strKey, { iv: _strVi, padding: CryptoJS.pad.ZeroPadding }).toString(CryptoJS.enc.Utf8);
	return Buffer(_QueryStr,'base64').toString();	
};

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	out += str.charAt(i);
	} else if (c > 0x07FF) {
	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
	out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	} else {
	out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
	out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	}
	}
	return out;
	}

function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while(i < len) {
	c = str.charCodeAt(i++);
	switch(c >> 4)
	{
	case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	// 0xxxxxxx
	out += str.charAt(i-1);
	break;
	case 12: case 13:
	// 110x xxxx 10xx xxxx
	char2 = str.charCodeAt(i++);
	out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	break;
	case 14:
	// 1110 xxxx 10xx xxxx 10xx xxxx
	char2 = str.charCodeAt(i++);
	char3 = str.charCodeAt(i++);
	out += String.fromCharCode(((c & 0x0F) << 12) |
	((char2 & 0x3F) << 6) |
	((char3 & 0x3F) << 0));
	break;
	}
	}
	return out;
	}
exports.utf16to8=utf16to8;
exports.utf8to16=utf8to16;
exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};
