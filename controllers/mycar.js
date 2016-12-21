
var validator = require('validator');
//var at           = require('../common/at');
var UserModel = require('../models').User;
var TokenModel = require('../models').Token;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var client        = require('../common/tools').oauthClient;
var _            = require('lodash');
//var wxs       = require('../common/signature');
//var cache        = require('../common/cache');
var moment = require('moment');
var http = require('http');
var fs = require('fs');

 
// topclient.execute( 'alibaba.aliqin.fc.sms.num.send' , {
//      'extend' : '' ,
//      'sms_type' : 'normal' ,
//      'sms_free_sign_name' : config.tosms.sms_free_sign_name ,
//      'sms_param' : "{name:'1414'}" ,
//      'rec_num' : '13700882704' ,
//      'sms_template_code' : config.tosms.sms_template_code
// }, function(error, response) {
//      if (!error) console.log(response);
//      else console.log(error);
// });

exports.bzshow = function (req, res, next) {	
    // var code = req.param('code')//我们要的code
	// client.getAccessToken(code, function (err, result) {
    //    var accessToken = result.data.access_token;
    //    var openid = result.data.openid;
    //    console.log(openid);
	//var openid= req.session.user.open_id;
	   res.render('mycar/list', {
     		 mycar: '一连串',
    	});
}
//车辆列表 
exports.list = function (req, res, next) {	
    // var code = req.param('code')//我们要的code
	// client.getAccessToken(code, function (err, result) {
    //    var accessToken = result.data.access_token;
    //    var openid = result.data.openid;
    //    console.log(openid);
	var openid= req.session.user.open_id;
	   res.render('mycar/list', {
     		 mycar: '一连串' +openid,
    	});
};



