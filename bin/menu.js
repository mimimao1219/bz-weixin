// 一次性脚本
var config = require('../config');
var weixinApi = require('../common/tools').weixinApi;
var CryptoJS = require("crypto-js");
var request = require('request-json');
var moment = require('moment');

var menu={
  "button":[
    {  
      "name":"买车",
      "sub_button":[
        {
          "type":"click",
          "name":"新车试驾",
          "key":"关于"
        },
        {
          "type":"view",
          "name":"优惠资讯",
          "url":config.host+"/mycar/bzshow"
        }]
    },
    {
      "name":"服务",
      "sub_button":[
        {
          "type":"click",
          "name":"售后预约",
          "key":"music"
        },
        {
          "type":"click",
          "name":"道路救援",
          "key":"展览"
        },
        {
          "type":"click",
          "name":"车主福利",
          "key":"drama"
        },
        
        {
          "type":"click",
          "name":"投诉建议",
          "key":"讲座"
        },
        {
          "type":"view",
          "name":"车位预约",
          "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.weixin.appId+"&redirect_uri="+config.host+"/park/create&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
        }]
    },
    {
      "name":"我的",
      "sub_button":[
        {
          "type":"view",
          "name":"优惠活动",
          "url":config.host+"/mycar/bzshow"
        },
        {
          "type":"view",
          "name":"爱车课堂",
          "url":config.host+"/mycar/bzshow"
        },
        {
          "type":"view",
          "name":"个人中心",
           "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.weixin.appId+"&redirect_uri="+config.host+"/mycar/list&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
        }]
    }]
};

weixinApi.createMenu(menu,function (error, result) {

console.log(result);
})



