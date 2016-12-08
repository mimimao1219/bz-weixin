var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ChannelSchema = new Schema({ 
	name: { type: String }, //渠道名称
	addr: { type: String },  //地址
	tel: { type: String }, //联系电话
	linkman: { type: String },//联系人
	create_at: { type: Date },//创建日期
});


mongoose.model('Channel', ChannelSchema);