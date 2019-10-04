var config = require('../../config');



// get report using Account
function getAnnualProjectedReportUsingAccount(req, res, next) {

    var cloud_provider = null;
    var service_id = null;
    var account_display_id = null;

    if (req.query.cloud_provider_id) {
        cloud_provider = req.query.cloud_provider_id;
    }

    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }

    if (req.query.service_id) {
        service_id = req.query.service_id;
    }

    //config.query("select * from sp_get_annualprojected_report_cost2('" + account_display_id + "'," + cloud_provider + "," + service_id + ",'usingaccount','info');  FETCH ALL IN \"info\"; ", function (err, result, fields) {
    config.query("select * from cb_mon_sp_get_annualprojected_report_cost('" + account_display_id + "','" + cloud_provider + "','" + service_id + "','select','info');  FETCH ALL IN \"info\"; ", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);

        }

    });
}
exports.getAnnualProjectedReportUsingAccount = getAnnualProjectedReportUsingAccount;


function getAnnualProjectedReportUsingAllAccount(req, res, next) {

    var cloud_provider = null;
    var service_id = null;
    var account_display_id = null;

    if (req.query.cloud_provider_id) {
        cloud_provider = 0;//req.query.cloud_provider_id;
    }

    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }    
    if (req.query.service_id) {
        service_id = 0;// req.query.service_id;
    }



    config.query("select * from cb_mon_sp_get_annualprojected_report_allaccount('" + account_display_id + "','" + cloud_provider + "','" + service_id + "',0,'all_account','info');  FETCH ALL IN \"info\"; ", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);

        }

    });
}
exports.getAnnualProjectedReportUsingAllAccount = getAnnualProjectedReportUsingAllAccount;
