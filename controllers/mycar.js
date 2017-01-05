
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
var CarModel = require('../models').Car;


exports.bzshow = function (req, res, next) {	
    // var code = req.param('code')//我们要的code
	// client.getAccessToken(code, function (err, result) {
    //    var accessToken = result.data.access_token;
    //    var openid = result.data.openid;
    //    console.log(openid);
	//var openid= req.session.user.open_id;
	//    res.render('mycar/list', {
    //  		 mycar: '一连串',
    // 	});
}
//车辆信息列表 
exports.list = function (req, res, next) {	
    
    var ep = EventProxy.create(['cars'], function (cars) {
		if (cars) {
			res.render('mycar/list', {
     		 cars: cars,
    	});
		}	   
	});
	//查询车辆信息
    CarModel.find({tel:req.session.user.tel}, null, ep.done('cars'));
};
   //更新车辆信息
exports.update = function (req, res, next) {	
   console.log(req.body)
    CarModel.findOne({ _id: req.body.id }, function (err, car){
		car.username=req.body.username;
		car.tel=req.body.tel;
		car.kind=req.body.kind;
		car.plate_number=req.body.plate_number;
		if (req.body.tel===req.session.user.tel){
			car.user_type='0';
		}else{
			car.user_type='1';
		}
		car.save();
		return	res.redirect('/mycar/list');
	});

};



