
var validator = require('validator');
//var at           = require('../common/at');
var UserModel = require('../models').User;
var TokenModel = require('../models').Token;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var auth        = require('../middlewares/auth');
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
	res.send({Status: 'ok',MsgStr: "本页正在建设，请点击其他页面!"});
}
//获取车辆信息 
exports.getCar = function (req, res, next) {
	//通过车主获得信息
	   var openid= req.session.user.open_id;
		UserModel.findOne({ open_id: openid }, null, function (err, user) {		
		//增加获取车辆信息接口
		auth.getUserInfo(user.tel,function (err, mcars){
          if (mcars&&mcars.length>5){
			  //获得用户信息
			 JSON.parse(mcars).map(function (mycar) {
				 var car = new CarModel();
				 car.open_id=user.open_id;
				 car.username=mycar.name;
				 car.tel=user.tel;
				 car.kind=mycar.car_name;
				 car.plate_number=mycar.plate_number;
				 car.save();
				 user.username=mycar.name;
				 user.kind='bz';
			 });
			 req.session.user=user;
		     user.save();

		  }else{
			//通过司机获得信息
			CarModel.find({tel:user.tel}, null,function (err, car) {
				if (car&&car.length>0){
					user.user_type='1';
					user.kind='bz';
					req.session.user=user;
		            user.save();
				}
			} );
		  }
		});    
		});

    return	res.redirect('/mycar/list');

};
//车辆信息列表 
exports.list = function (req, res, next) {	
    
    var ep = EventProxy.create(['cars'], function (cars) {
		console.log(cars);
		if (cars) {
			res.render('mycar/list', {
     		 cars: cars,
    	});
		}	   
	});
	//查询车辆信息
    CarModel.find({open_id:req.session.user.open_id}, null, ep.done('cars'));
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
			car.user_type='0';//车主
		}else{
			car.user_type='1';//司机
		}
		car.save();
		return	res.redirect('/mycar/list');
	});

};



