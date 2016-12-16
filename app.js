
var config = require('./config');

if (!config.debug && config.oneapm_key) {
  require('oneapm');
}

require('colors');
var path = require('path');
var Loader = require('loader');
var LoaderConnect = require('loader-connect')
var express = require('express');
var session = require('express-session');
var schedule = require("node-schedule");
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
//require('./models');
var webRouter = require('./web_router');
var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page');
var proxyMiddleware = require('./middlewares/proxy');
//var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');
var requestLog = require('./middlewares/request_log');
var renderMiddleware = require('./middlewares/render');
var logger = require('./common/logger');
var helmet = require('helmet');
var bytes = require('bytes')
var webot = require('weixin-robot');
var UserModel = require('./models').User;
var ParkingOrderModel = require('./models').ParkingOrder;
var ParkingModel = require('./models').Parking;

// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// assets
var assets = {};

if (config.mini_assets) {
  try {
    assets = require('./assets.json');
  } catch (e) {
    logger.error('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
//app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// Request logger。请求时间
app.use(requestLog);

if (config.debug) {
  // 渲染时间
  app.use(renderMiddleware.render);
}

// 静态资源
if (config.debug) {
	app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
app.use( express.static(staticDir));
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
	secret: config.session_secret,
	cookie: {
		  maxAge: 1000 * 60 * 30,
	},
	resave: true,
	saveUninitialized: true,
}));



// set static, dynamic helpers
_.extend(app.locals, {
  config: config,
  Loader: Loader,
  assets: assets
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

app.use(busboy({
  limits: {
    fileSize: bytes(config.file_limit)
  }
}));
var park_api = require('./controllers/park_api');
// routes
app.post('/api/v1/park/park_list', cors(), park_api.park_list);   //api 需要支持跨域访问才行的。所以加上cors中间件了。
app.post('/api/v1/park/park_update', cors(), park_api.park_update);
app.use('/', webRouter);
//对发来的消息预处理
webot.beforeReply(function load_user(info, next) {
  UserModel.findOne({ open_id: info.uid }, null, function (err, user) {
			if (user) {
        info.user = user;
        next();
      }
		});
    console.log("我来也1"+info.param.eventKey);
  next();
});
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
        myUser.open_id=info.uid;
        myUser.channel=info.param.eventKey;
        myUser.create_at=info.createTime;
        myUser.save();
			}
		});
    //console.log(info.param.eventKey);
    info.reply = {
        title: '欢迎关注订阅奔驰微信服务号',
        url: 'http://webot-bz.ittun.com/sign?openid='+info.uid,
        picUrl: 'http://webot-bz.ittun.com/public/img/eclass.jpg',
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


// 接管消息请求
webot.watch(app, { token: 'mimimao' });


// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}

if (!module.parent) {
  app.listen(config.port, function () {
    logger.info('repair listening on port', config.port);
    logger.info('God bless love....');
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
    logger.info('');



  });
}


var moment = require('moment');


//定时任务 ，每间隔一小时扫描一次
//var WechatAPI = require('wechat-api');
var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(1, 5)];
// rule.hour = [new schedule.Range(8, 17)];
rule.minute = [30];
var j = schedule.scheduleJob(rule, function () {
	// var day = moment().subtract(1, 'h').format('YYYY-MM-DD hh:mm');
	var hour = moment().subtract(3, 'h');
	//定时扫描数据库超时取消预约。
   ParkingOrderModel.find({ reserve_at: {$gt:hour} ,state: '1'}, function (err, ParkingOrders) {
     ParkingOrders.forEach(function (ParkingOrder) {
     ParkingOrder.state=4;
     ParkingOrder.update_at=moment();
     ParkingOrder.save();
     ParkingModel.update({name: parkingOrder.name }, { $inc: { num: 1 }}, { multi: true }, function (err, result) {
                if (err) throw err;
                return null;
          });  
     });
   });

});


//oJme-szsGYjRcIMIFxvvt5XAI8qo
module.exports = app;
