
var validator = require('validator');
//var at           = require('../common/at');
var UserModel = require('../models').User;
//var TokenModel = require('../models').Token;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var client        = require('../common/tools').oauthClient;
var config       = require('../config');
var _            = require('lodash');
var wxs       = require('../common/signature');
//var cache        = require('../common/cache');
var moment = require('moment');
var http = require('http');
var fs = require('fs');



//车辆列表 
exports.create = function (req, res, next) {	

    var code = req.param('code')//我们要的code
    client.getAccessToken(code, function (err, result) {
       var accessToken = result.data.access_token;
       var openid = result.data.openid;
       console.log(openid);
	   res.render('mycar/list', {
     		 mycar: '一连串xxx' +openid,
    	});
    });

//  var userid= req.query.userid;
//  if (userid===req.session.user.UserId&&req.session.user.usertype==='3'){
	
//  res.locals.userid =userid;
//  var events = ['repaircompanys','repairtypes'];
//   var ep = EventProxy.create(events, function (repaircompanys,repairtypes) {
//     res.render('setup/comtactlist', {
//       repaircompanys: repaircompanys,
//       repairtypes: repairtypes
//     });
//   }); 
 
//  RepairCompanyModel.find({companyid:userid }, null,{sort: '-_id'}, ep.done('repaircompanys'));
//  RepairTypeModel.find({companyid:userid }, null,{sort: '-_id'}, ep.done('repairtypes'));
//  };
 
};


// //增加更新维修人员
// exports.comtactsave = function (req, res, next) {	

//  if (req.body.tid=='') {
//     var RepairCompany = new RepairCompanyModel();
//     RepairCompany.companyid   = validator.trim(req.body.companyid);
//     RepairCompany.comtact   = validator.trim(req.body.comtact);
//     RepairCompany.comtact_tel     = validator.trim(req.body.comtact_tel);
//     RepairCompany.comtact_mob   = validator.trim(req.body.comtact_mob);
//     RepairCompany.comtact_mail     = validator.trim(req.body.comtact_mail);
//     RepairCompany.repairtype   = validator.trim(req.body.repairtype);
//     RepairCompany.repairtypename     = validator.trim(req.body.repairtypename);
//     RepairCompany.msk1     = validator.trim(req.body.msk1);

//   RepairCompany.save(function (err, RepairCompany) {
//       		res.redirect('/setup/comtactlist?userid='+req.session.user.UserId);
//       	});
//   }else{
//   	RepairCompanyModel.findOne({_id:validator.trim(req.body.tid) }, null, function (err, RepairCompany) {
//   	RepairCompany.companyid   = validator.trim(req.body.companyid);
//     RepairCompany.comtact   = validator.trim(req.body.comtact);
//     RepairCompany.comtact_tel     = validator.trim(req.body.comtact_tel);
//     RepairCompany.comtact_mob   = validator.trim(req.body.comtact_mob);
//     RepairCompany.comtact_mail     = validator.trim(req.body.comtact_mail);
//     RepairCompany.repairtype   = validator.trim(req.body.repairtype);
//     RepairCompany.repairtypename     = validator.trim(req.body.repairtypename);
//     RepairCompany.msk1     = validator.trim(req.body.msk1);
  
//     RepairCompany.save(function (err, RepairCompany) {
//       		res.redirect('/setup/comtactlist?userid='+req.session.user.UserId);
//       	});	
//   	});
  	
//   }


// }
// //删除维修人员
// //exports.comtactdel = function (req, res, next) {	
// 	//req.user.id
// //   var id= req.query.id;
//   // if (userid===req.session.user.UserId){
//  //  RepairCompanyModel.remove({_id: id}, function (err, RepairCompany) {
//  //     		res.redirect('/setup/comtactlist');
//  //     	});
//   // };
// //}

// //维修类型列表
// exports.typelist = function (req, res, next) {	
// 	var userid= req.query.userid;
// 	 //userid='11003720';
// 	 if (userid===req.session.user.UserId&&req.session.user.usertype==='2'){
// 	 res.locals.userid =userid;
// 	 var events = ['myrepairtypes','repairtypes'];
// 	  var ep = EventProxy.create(events, function (myrepairtypes,repairtypes) {
// 	    res.render('setup/typelist', {
// 	    	  myrepairtypes: myrepairtypes,
// 	      repairtypes: repairtypes
// 	    });
// 	  });

	 
// 	 RepairManagerModel.find({managerid:userid }, null,{sort: 'repairname'}, ep.done('myrepairtypes'));
// 	 RepairTypeModel.find({}, null,{sort: 'repairname'}, ep.done('repairtypes'));
//    };

// };
// //增加更新维修类型
// exports.typesave = function (req, res, next) {	

//  if (req.body.tid=='') {
//     var RepairType = new RepairTypeModel();
//     //RepairType.repairtype   = CountersModel.findOneAndUpdate( {"name":"repair_type"} , {$inc:{'seq':1}}, null).seq;
//     CountersModel.findOneAndUpdate( {"name":"repair_type"} , {$inc:{'seq':1}}, {new:true},function(err,counters) {
//      RepairType.repairtype   =  counters.seq;
	 
// 	RepairType.repairname   = validator.trim(req.body.repairname);
//     RepairType.statu   = validator.trim(req.body.statu);
//     RepairType.save(function (err, RepairType) {
//      	var RepairManager = new RepairManagerModel();
//      	    RepairManager.managerid = validator.trim(req.body.managerid);
//      	    RepairManager.repairtype=RepairType.repairtype ;
//      	    RepairManager.repairname=RepairType.repairname ;
//      	    RepairManager.save(function (err, RepairManager) { 
//       		res.redirect('/setup/typelist?userid='+req.session.user.UserId);
//      	  });
//       	});
//     });
//   }else{
// 	  RepairTypeModel.findOne({_id:validator.trim(req.body.tid) }, null, function (err, RepairType) {  
// 		RepairType.repairname   = validator.trim(req.body.repairname);
// 		RepairType.statu   = validator.trim(req.body.statu);
// 		RepairType.save(function (err, RepairType) {
// 			RepairManagerModel.findOne({managerid:validator.trim(req.body.managerid) ,repairtype:RepairType.repairtype}, null, function (err, RepairManager) {  
// 			RepairManager.repairname=RepairType.repairname ;
// 	     	RepairManager.save(function (err, RepairManager) {
// 			res.redirect('/setup/typelist?userid='+req.session.user.UserId);
// 			});	
//       	});	
//   	});	
//   });
// };
// };


// //维修公司列表
// exports.companylist = function (req, res, next) {	
//  var userid= req.query.userid;
//  //userid='11003720';
//  if (userid===req.session.user.UserId&&req.session.user.usertype==='2'){
//  res.locals.userid =userid;
//  var events = ['companys','repairtypes'];
//   var ep = EventProxy.create(events, function (companys,repairtypes) {
//     res.render('setup/companylist', {
//       companys: companys,
//       repairtypes: repairtypes
//     });
//   });
 
//   RepairManagerModel.distinct('repairtype',{managerid:userid }, function (err,types) {
// 	  CompanyModel.find({repairtype:{$in:types} }, null,{sort: 'name'}, ep.done('companys'));
//   });
  
//   RepairManagerModel.find({managerid:userid }, null,{sort: 'repairname'}, ep.done('repairtypes'));
// };
// }

// //增加更新维修公司
// exports.companysave = function (req, res, next) {	

//  if (req.body.tid=='') {
//     var Company = new CompanyModel();
//     //Company.id   = CountersModel._findAndModify({update:{$inc:{'seq':1}}, query:{"name":"company"}, new:true}).seq;
//     CountersModel.findOneAndUpdate( {"name":"company"} , {$inc:{'seq':1}}, {new:true},function(err,counters) {
//      Company.id   =  counters.seq;
    
// 	Company.name   = validator.trim(req.body.name);
//     Company.tel   = validator.trim(req.body.tel);
//     Company.linkname   = validator.trim(req.body.linkname);
//     Company.mail   = validator.trim(req.body.mail);
//     Company.repairtype   = validator.trim(req.body.repairtype).split();
//     Company.save(function (err, Company) {
//      	RepairTypeModel.find({repairtype:{$in:Company.repairtype}}).exec(function (err, RepairTypes) {
//     		RepairTypes.forEach(function (RepairType) { 
// 				var iid = (Company.id+'').split();
//     			RepairType.companyid=_.union(RepairType.companyid,iid);			
//     			RepairType.save(function (err, RepairType) { 
//       		res.redirect('/setup/companylist?userid='+req.session.user.UserId);
//      	  });
//     		});
//      	});
//       	});
// 		  });
//   }else{
// 	  CompanyModel.findOne({_id:validator.trim(req.body.tid) }, null, function (err, Company) {  
// 		  Company.name   = validator.trim(req.body.name);
// 		  Company.tel   = validator.trim(req.body.tel);
// 		  Company.linkname   = validator.trim(req.body.linkname);
// 		  Company.mail   = validator.trim(req.body.mail);
// 		  Company.repairtype   = validator.trim(req.body.repairtype).split();
// 		  CompanyModel.save(function (err, Company) {
// 			  RepairTypeModel.find({repairtype:{$in:Company.repairtype}}).exec(function (err, RepairTypes) {
// 		    	  RepairTypes.forEach(function (RepairType) { 	
// 					  var iid = (Company.id+'').split();
// 		    			RepairType.companyid=_.union(RepairType.companyid,iid);
// 		    			RepairType.save(function (err, RepairType) { 
// 		      		res.redirect('/setup/companylist?userid='+req.session.user.UserId);
// 		     	  });
// 		    		});
// 		     	});	
//   	});	
//   });
// };
// };


// //成本中心列表
// exports.costcenterlist = function (req, res, next) {	
 
//  var userid= req.query.userid;
//  //userid='11003720';
//  if (userid===req.session.user.UserId&&req.session.user.usertype==='2'){
//  res.locals.userid =userid;
//  var events = ['costcenters'];
//   var ep = EventProxy.create(events, function (costcenters) {
//     res.render('setup/costcenterlist', {
//     	costcenters: costcenters
//     });
//   });
 
 
//  CostcenterModel.find({}, null,{sort:'OrderIndex'} ,ep.done('costcenters'));
//  };
// };
// //增加更新成本中心
// exports.costcentersave = function (req, res, next) {	

//  if (req.body.tid=='') {
//     var Costcenter = new CostcenterModel();
//     //RepairType.repairtype   = CountersModel.findAndModify({update:{$inc:{'seq':1}}, query:{"name":"repair_type"}, new:true}).seq;
//     Costcenter.costCenter   = validator.trim(req.body.costCenter);
//     Costcenter.costCenterName   = validator.trim(req.body.costCenterName);
//     Costcenter.OrderIndex   = validator.trim(req.body.OrderIndex);
//     Costcenter.save(function (err, Costcenter) { 
//       		res.redirect('/setup/costcenterlist?userid='+req.session.user.UserId);
   
//       	});
//   }else{
// 	  CostcenterModel.findOne({_id:validator.trim(req.body.tid) }, null, function (err, Costcenter) {  
// 		  Costcenter.costCenter   = validator.trim(req.body.costCenter);
// 		  Costcenter.costCenterName   = validator.trim(req.body.costCenterName);
// 		  Costcenter.OrderIndex   = validator.trim(req.body.OrderIndex);
// 		  Costcenter.save(function (err, Costcenter) { 
// 	      		res.redirect('/setup/costcenterlist?userid='+req.session.user.UserId);	   
// 	      	});
//       	});	
// };
// };


