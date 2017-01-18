
module.exports = function(webot) {
var config = require('../config');
var UserModel = require('../models').User;

    //关注
webot.set('subscribe', {
  pattern: function(info) {
    return info.is('event') && info.param.event === 'subscribe';
  },
  handler: function(info) {
      UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
			if (user) {
        info.user = user;
			} else {
        var myUser = new UserModel();
        var keys = info.param.eventKey;
        var s = keys.indexOf("_");
        myUser.open_id=info.uid;
        myUser.channel=keys.substr(s+1);
        myUser.channel_s=keys.substr(s+1);
        myUser.channel_one=keys.substr(s+1);
        myUser.create_at=info.createTime;
        myUser.save();
			}
		});
    //console.log(info.param.eventKey);
    info.reply = {
        title: '欢迎关注订阅奔驰微信服务号',
        url: config.host+'/sign?openid='+info.uid,
        picUrl: config.host+'/public/img/eclass.jpg',
        description: '为了更好的服务您请绑定手机号',
  }
    return ;
  }
});
//取消关注
webot.set('unsubscribe', {
  pattern: function(info) {
    return info.is('event') && info.param.event === 'unsubscribe';
  },
  handler: function(info) {
    //console.log(info.uid);
    UserModel.remove({ open_id: info.uid} ,function(err,result){
          if(err){
            console.log(err);
          }else{
            console.log("delete"+info.uid);
          }
    });
  }
});

}