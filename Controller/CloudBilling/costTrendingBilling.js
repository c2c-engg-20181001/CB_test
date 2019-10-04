var config = require('../../config');
function costTrendingBill(req, res, next) {

    var region_list = null;
    var start_date = null;
    var end_date = null;
    var subscriptionid = null;
    var mode = null;
    var region_list1 = [];
    var region_data = [];
    var region_data1 = [];
    var final_result = [];
    var k = 0;
    var t = 0;
    var unique = [];
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    // we temp not used provider id but we pass
    if (req.query.region_list) {
        region_list = req.query.region_list;
        unique = region_list.split(",");
        region_list1 = unique.filter(onlyUnique);

    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.subscriptionid) {
        subscriptionid = req.query.subscriptionid;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    if (req.query.cloud) {
        cloud = req.query.cloud;
    }
    config.query("SELECT * from cb_cost_trend_sp_get_azure_service_cost('" + region_list + "','" + start_date + "','" + end_date + "','" + subscriptionid + "','" + mode + "','" + cloud + "');", function (err, result, fields) {
        
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            if (result.rows[0].cb_cost_trend_sp_get_azure_service_cost != null && result.rows[1].cb_cost_trend_sp_get_azure_service_cost != null) {
                for (var i = 0; i < result.rows[0].cb_cost_trend_sp_get_azure_service_cost.length; i++) {
                    for (var j = 0; j < region_list1.length; j++) {

                        if (result.rows[0].cb_cost_trend_sp_get_azure_service_cost[i].region1 === region_list1[j]) {
                            region_data[k] = result.rows[0].cb_cost_trend_sp_get_azure_service_cost[i];
                            k++;
                        }
                    }

                }
                for (var m = 0; m < result.rows[1].cb_cost_trend_sp_get_azure_service_cost.length; m++) {
                    for (var n = 0; n < region_list1.length; n++) {

                        if (result.rows[1].cb_cost_trend_sp_get_azure_service_cost[m].region1 === region_list1[n]) {
                            region_data1[t] = result.rows[1].cb_cost_trend_sp_get_azure_service_cost[m];
                            t++;
                        }
                    }

                }
                final_result[0] = region_data;
                final_result[1] = region_data1;
                res.send(final_result);
            }
            else {
                res.send(result);
            }                             
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.costTrendingBill = costTrendingBill;

function filterDetails(req, res, next) {
    var group = "";
    var cloud = "";
    var mode = "";


    if (req.query.cloud) {
        cloud = req.query.cloud;
    }
    if (req.query.group) {
        group = req.query.group;

    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    spName = 'cb_billing_details_filters'

    //config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup + "','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

    //config.query("select * from _cb_bil_alibaba_compute_topology('" + cloud + "','" + region + "','" + start_date + "','"  + end_date + "','" + account + "','" + mode + "','info');", function (err, result, fields) {
    config.query("select * from " + spName + "('" + group + "','" + cloud + "','" + mode + "');", function (err, result, fields) {

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
exports.filterDetails = filterDetails;

function tablesData(req, res, next) {

    var cloud = "";
    var region = "";
    var start_date = "";
    var end_date = "";
    var account = "";
    var mode = "";
    var service = "";


    if (req.query.cloud) {
        cloud = req.query.cloud;
    }
    if (req.query.region) {
        region = req.query.region;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.account) {
        account = req.query.account;
    }
   
    if (req.query.mode) {
        mode = req.query.mode;
    }

    spName = '_cb_new_cost_trend_service_filter'

    //config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup + "','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

    //config.query("select * from _cb_bil_alibaba_compute_topology('" + cloud + "','" + region + "','" + start_date + "','"  + end_date + "','" + account + "','" + mode + "','info');", function (err, result, fields) {
    config.query("select * from " + spName + "('" + region + "','" + start_date + "','" + end_date+ "','" + account + "','" + mode + "','" + cloud + "');", function (err, result, fields) {

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
exports.tablesData = tablesData;



function newfilterDetails(req, res, next) {
   

    //config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup + "','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

    //config.query("select * from _cb_bil_alibaba_compute_topology('" + cloud + "','" + region + "','" + start_date + "','"  + end_date + "','" + account + "','" + mode + "','info');", function (err, result, fields) {
    config.query("select _cb_billing_costtrend('" + req.body.group + "','"  + req.body.mode + "')", function (err, result, fields) {

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
exports.newfilterDetails = newfilterDetails;