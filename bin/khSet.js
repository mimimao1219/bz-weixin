// 一次性脚本
var config = require('../config');
var weixinApi = require('../common/tools').weixinApi;
var CryptoJS = require("crypto-js");
var request = require('request-json');
var moment = require('moment');



weixinApi.getCustomServiceList(function (error, result,res) {
console.log(result);
})



