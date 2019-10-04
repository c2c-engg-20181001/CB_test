var mysql = require('mysql');
var config = require('../../config');
let date = require('date-and-time');
let now = new Date();  //Current Date

function GetReportData(req, res, next) {

	var account_display_id = null;
	var dateFilter = null;
	var service_id = null;
    var cloud_id = null;


	if (req.query.account_display_id) {
		account_display_id = req.query.account_display_id;
	}

	if (req.query.dateFilter) {
		dateFilter = req.query.dateFilter;
		if (dateFilter == "current_year") {

			dateFilter = date.format(date.addYears(now, 0), 'YYYY');
		}
		if (dateFilter == "last_year") {
			dateFilter = date.format(date.addYears(now, -1), 'YYYY');
		}
	}

	if (req.query.service_id) {
		service_id = req.query.service_id;
	}

    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
	}
    
    //cb_mon_overtime_test1('477463085755', 1, '2018', 1);
    config.query("select * from  cb_mon_overtime_test3('" + account_display_id + "', '" + service_id + "', '" + dateFilter + "','" + cloud_id +"'); ", function (err, result, fields) {
      //  config.query("select * from  sp_resource_usage_overtimetest('" + account_display_id + "', '" + service_id + "', '" + dateFilter + "','" + entityid + "');", function (err, result, fields) {

		if (!err) {
			//console.log(result);
			res.header("access-control-allow-origin", "*");
			res.send(result);
		}
		else {
			console.log('error while performing query.', err);
		}
	});
}
exports.GetReportData = GetReportData;


function GetReportData_account(req, res, next) {

    var account_display_id = null;
    var dateFilter = null;
    var service_id = null;
    var entityid = null;


    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }

    if (req.query.dateFilter) {
        dateFilter = req.query.dateFilter;
        if (dateFilter == "current_year") {

            dateFilter = date.format(date.addYears(now, 0), 'YYYY');
        }
        if (dateFilter == "last_year") {
            dateFilter = date.format(date.addYears(now, -1), 'YYYY');
        }
    }

    if (req.query.service_id) {
        service_id = parseInt(req.query.service_id);
    }

    	if (req.query.entityid) {
            entityid = parseInt(req.query.entityid);
        }
        
        
        config.query("select * from  cb_mon_overtime_test('" + account_display_id + "', '" + service_id + "', '" + dateFilter + "','" + entityid + "'); ", function (err, result, fields) {
        //   config.query("select * from  sp_resource_usage_overtimetest('" + account_display_id + "', '" + service_id + "', '" + dateFilter + "','" + entityid + "');", function (err, result, fields) {

        if (!err) {
            //console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('error while performing query.', err);
        }
    });
}
exports.GetReportData_account = GetReportData_account;