// 一次性脚本
var EventProxy   = require('eventproxy');

var ParkingModel = require('../models').Parking;

var parking = new ParkingModel();
	parking.name='新郑机场停车位';
	parking.addr='新郑机场';
	parking.sum=30;
	parking.num=30;
	parking.save();
//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

// CompanyModel.find({}).exec(function (err, companys) {
// companys.forEach(function (company) {
	
// 	var ep = new EventProxy();
// 	ep.all('typename','tel' ,function (typename,tel) { 
// 		if (tel){
// 		company.repairtype=typename;
// 		company.tel=tel.comtact_mob;
// 		company.linkname=tel.comtact;
// 		company.mail=tel.comtact_mail;		
// 		//console.log(company);
// 		company.save();
// 		}
// 	 });
	 
// 	 RepairCompanyModel.distinct('repairtype',{companyid:company.id},ep.done('typename'))
// 	 RepairCompanyModel.findOne({companyid:company.id},null,{sort: '-msk1'},ep.done('tel'))

// });
// });



