// 一次性脚本
var CountersModel = require('../models').Counters;


//counters = new CountersModel({name : 'company'});
//counters.save();
//counters = new CountersModel({name : 'repair_type',seq:23});
//counters.save();

CountersModel.findOneAndUpdate( {"name":"repair_type"} , {$inc:{'seq':1}}, {new:true},function(err,aa) {

     console.log( aa.seq)

        });
