
var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CarSchema = new Schema({ 
open_id: { type: String },//微信open-id
username: { type: String },//客户名称
tel: { type: String },//客户电话
kind: { type: String },//客户车型
plate_number: { type: String },//客户车牌
user_type:{ type: String, default:'0' },//客户类型 默认值0车主，1助手
user_grade:{ type: String },//客户等级
channel:{ type: String },//扫码渠道
create_at:{ type: Date, default: Date.now },//关注时间

});


mongoose.model('Car', CarSchema);

