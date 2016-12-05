var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var CountersSchema = new Schema({ 
  name: { type: String },   
  seq: {  type: Number, default: 0 },  
});

// CountersSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
//  return this.collection.findAndModify(query, sort, doc, options, callback);
// };

mongoose.model('Counters', CountersSchema);
