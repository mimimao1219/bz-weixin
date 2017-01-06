
var validator = require('validator');
//var at           = require('../common/at');
var UserModel = require('../models').User;
//var TokenModel = require('../models').Token;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var client        = require('../common/tools').oauthClient;
var config       = require('../config');
var _            = require('lodash');
var wxs       = require('../common/signature');
//var cache        = require('../common/cache');
var moment = require('moment');
var http = require('http');
var fs = require('fs');
var ParkingModel = require('../models').Parking;
var ParkingOrderModel = require('../models').ParkingOrder;
var CarModel = require('../models').Car;
var sendQyMsg = require('../middlewares/auth').sendQyMsg;

//预约车位 
exports.create = function (req, res, next) {	
    //res.locals.open_id =req.session.user.open_id;
    //console.log(req.session.user);
    ParkingOrderModel.findOne({ tel: req.session.user.tel ,state: { $in: [1, 2] }}, function (err, ParkingOrder) {
        if (ParkingOrder){
             res.render('park/new', {
     		 ParkingOrder: ParkingOrder,
              cars:null
    	   });
        }else{
            
           var  ParkingOrder = new ParkingOrderModel();
            ParkingOrder.open_id=req.session.user.open_id;
            ParkingOrder.username=req.session.user.username;
            ParkingOrder.tel=req.session.user.tel;
            //ParkingOrder.plate_number=req.session.user.plate_number
            
            var ep = EventProxy.create(['cars','Parking'], function (cars,Parking) {
                if (cars) {
                    ParkingOrder.pid=Parking._id;
                    ParkingOrder.name=Parking.name;
                    ParkingOrder.addr=Parking.addr;
                    ParkingOrder.hour=moment().hour()+1;
                    res.locals.num= Parking.num;
                    res.locals.sum= Parking.sum;
                    res.render('park/new', {
                        ParkingOrder: ParkingOrder,
                        cars:cars
                     });
                }else{
                   //没有车跳转到车辆信息管理 
                   return	res.redirect('/mycar/list');
                }              
                });
            //查询车辆信息
            CarModel.find({tel:req.session.user.tel}, null, ep.done('cars'));
           //查询停车场          
             ParkingModel.findOne({}, null, ep.done('Parking'));
        }

    });


};
//保存新预约车位

exports.put = function (req, res, next) {
    if (req.body.reserve_at) {
        ParkingOrderModel.findOne({ _id: req.body.id }, function (err, parkingOrder) {
            parkingOrder.state=4;
            parkingOrder.update_name=req.session.user.username;
            parkingOrder.update_at=moment().format();
            parkingOrder.save();
            ParkingModel.update({name: parkingOrder.name }, { $inc: { num: 1 }}, { multi: true }, function (err, result) {
                if (err) throw err;
                return null;
            });  
            //发送消息

            return	res.redirect('/park/create');
        });

    }else{
    var parkingOrder = new ParkingOrderModel();
    parkingOrder.open_id=req.session.user.open_id;
    parkingOrder.username=req.body.username;
    parkingOrder.tel=req.session.user.tel;
    parkingOrder.plate_number=req.body.plate_number;
    parkingOrder.pid=req.body.pid;
    parkingOrder.name=req.body.name;
    parkingOrder.addr=req.body.addr;
    var hour = req.body.hour;
    if (hour>=24){
     parkingOrder.reserve_at=moment().add(1, 'd').hour(hour-24).format();
    }else{
    parkingOrder.reserve_at=moment().hour(hour).format();
    };
    parkingOrder.state='1';
    parkingOrder.update_name=req.session.user.username;
    parkingOrder.save( function (err, order) {
        //发送消息
        var ooder = _.pick(order, ['_id', 'username', 'tel', 'plate_number', 'reserve_at','name']);
        //console.log(ooder);
        sendQyMsg(ooder, function (err, result) {
            console.log(result);
        })
    });
    //减少车位数量
    ParkingModel.update({name: req.body.name }, { $inc: { num: -1 }}, { multi: true }, function (err, result) {
        if (err) throw err;
        return null;
    });  
    

    return	res.redirect('/park/create');
    }


}
//更新预约车位
exports.update = function (req, res, next) {

}




