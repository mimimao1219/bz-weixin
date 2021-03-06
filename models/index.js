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
require('./car');
require('./parking');
require('./parking_order');
require('./token');


exports.Channel         = mongoose.model('Channel');
exports.User         = mongoose.model('User');
exports.Car         = mongoose.model('Car');
exports.Parking         = mongoose.model('Parking');
exports.ParkingOrder         = mongoose.model('ParkingOrder');
exports.Token         = mongoose.model('Token');
