var config = require('../../config');
function billingCostAggReport(req, res, next) {

    var provider_id = null;
    var account_display_id = null;
    var region = null;
    var services = null;
    var dateRange = null;
    var selectMode = null;
    // we temp not used provider id but we pass
    if (req.query.provider_id) {
        provider_id = req.query.provider_id;
    }
    if (req.query.account) {
        account_display_id = req.query.account;
    }
    if (req.query.region) {
        region = req.query.region;
    }
    if (req.query.services) {
        services = req.query.services;
    }
    if (req.query.dateRange) {
        dateRange = req.query.dateRange;
    }
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    config.query("select * from cb_bil_sp_get_billing_cost_report('" + provider_id + "','" + account_display_id + "','" + region + "','" + services + "','" + dateRange + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        //config.query("select demoset_table();", function (err, result, fields) {

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
exports.billingCostAggReport = billingCostAggReport;

function getBillingDetails(req, res, next) {
    var cloud = "";
    var region = "";
    var start_date = "";
    var end_date = "";
    var account = "";
    var mode = "";



    if (req.query.cloud_list) {
        cloud = req.query.cloud_list;
    }
    if (req.query.region_list) {
        region = req.query.region_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.acc_list) {
        account = req.query.acc_list;
    }
    mode = '';




    config.query("select * from cb_mon_cloud_provider_detail_report ('" + cloud + "','" + account + "','" + region + "','" + start_date + "','" + end_date + "','" + mode + "');", function (err, result, fields) {
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
exports.getBillingDetails = getBillingDetails;

