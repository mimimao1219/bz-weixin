var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var config    = require('../config');
var _         = require('lodash');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ParkingOrderSchema = new Schema({ 
  open_id: { type: String },//微信open-id
  username: { type: String },//客户名称
  tel: { type: String },//客户电话
  plate_number: { type: String },//客户车牌
  pid: { type: String },//车位id
  name: { type: String },//车位名称
  addr: { type: String }, // 车位地址
  reserve_at: { type: Date },  //预定时间
  state: { type: String }, // 车位状态 1预约成功，2使用中，3完成使用，4取消预约
  update_name: { type: String },  //状态更新人员
  create_at: { type: Date, default: Date.now }, //创建时间
  update_at: { type: Date, default: Date.now },//更新时间

});

ParkingOrderSchema.virtual('statename').get(function () {
  var state  = this.state;
  var pair = _.find(config.state, function (_pair) {
    return _pair[0] === state;
  });

  if (pair) {
    return pair[1];
  } else {
    return '';
  }
});


mongoose.model('ParkingOrder', ParkingOrderSchema);

