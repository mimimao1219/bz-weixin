var mongoose = require('mongoose');
var config   = require('../config');
var logger = require('../common/logger')

mongoose.connect(config.db, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./channel');
require('./user');
require('./parking');
require('./parking_order');


exports.Channel         = mongoose.model('Channel');
exports.User         = mongoose.model('User');
exports.Parking         = mongoose.model('Parking');
exports.ParkingOrder         = mongoose.model('ParkingOrder');
