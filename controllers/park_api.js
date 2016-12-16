
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

//预约车位列表 api
exports.park_list = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var token= JSON.parse(QueryStr).token;
     //var token = req.body
     if (token===config.bztoken){
     ParkingOrderModel.find({state: { $in: [1, 2] }}, function (err, ParkingOrders) {
     var parkingOrders = ParkingOrders.map(function (parkingOrder) {
        return _.pick(parkingOrder, ['_id','open_id', 'username', 'tel', 'plate_number', 'name',
         'reserve_at','state']);
      });
     var orders = tools.myCipheriv(JSON.stringify(parkingOrders),config);
     res.send({Status: 0,MsgStr: "查询请求成功!", ResultData: orders});
   });
   }else{
     res.send({Status: -1,MsgStr: "这是非法请求!"});
   }
  
}

//更新预约车位
exports.park_update = function (req, res, next) {
    var QueryStr = tools.myDecipheriv(req.body.QueryStr,config);
    var querystr=JSON.parse(QueryStr);
    var token= querystr.token;
    if (token===config.bztoken){
         ParkingOrderModel.findOne({ _id: querystr.id }, function (err, parkingOrder) {
         parkingOrder.state=querystr.state;
         parkingOrder.update_name=querystr.name;
         parkingOrder.update_at=moment();
         parkingOrder.save();
         ParkingModel.update({name: parkingOrder.name }, { $inc: { num: 1 }}, { multi: true }, function (err, result) {
                if (err) throw err;
                return null;
            });  
           
        });
        res.send({Status: 0,MsgStr: "更新数据成功!"});
    }else{
    res.send({Status: -1,MsgStr: "这是非法请求!"});
    }

}
     


