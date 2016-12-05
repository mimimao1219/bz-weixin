var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var ParkingSchema = new Schema({ 
  name: { type: String },//车位名称
  addr: { type: String }, // 车位地址
  sum: { type: Number },  //车位总数量
  num: { type: String },  //车位可用数量
  geo_x: { type: String },  //车位维度
  geo_y:{ type: String },//车位经度
  create_at: { type: Date, default: Date.now }, //创建时间
  update_at: { type: Date, default: Date.now },//更新时间

});

//CompanySchema.plugin(BaseModel);


mongoose.model('Parking', ParkingSchema);

