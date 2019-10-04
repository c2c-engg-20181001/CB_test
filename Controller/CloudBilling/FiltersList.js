var config = require('../../config');



//Get filter list for region and accounts on page load
function getBillingFillterList(req, res, next) {

     var cloud_list = "";
    var start_date = "";
    var end_date = "";
    var service_name= "";
    var selectMode = "";
    var tenantGroup = "";//"AlibabaGroup1";
    
    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.service_name) {
        service_name = req.query.service_name;
    }
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    if (req.query.tenantGroup) {
        tenantGroup = req.query.tenantGroup;
    }


    //no of parameter in cb_billing_sp_filters_v2
    //(p_group,p_cloud character varying, p_service character varying, p_region character varying, p_startdate character varying, p_enddate character varying, p_mode character, ref refcursor)
    //SELECT * from cb_billing_sp_filters_v2('Azure', 'Virtual Machines', '','2018-08-04', '2019-02-04', 'get_account_and_region_details','info'); fetch all in "info";

    config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup+"','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.getBillingFillterList = getBillingFillterList;

// using alibaba provider
//Get filter list for region and accounts on page load
function getBillingFillterList1(req, res, next) {

    var cloud_list = "";
    var start_date = "";
    var end_date = "";
    var service_name = "";
    var selectMode = "";
    var tenantGroup = "";//"AlibabaGroup1";

    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.service_name) {
        service_name = req.query.service_name;
    }
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    if (req.query.tenantGroup) {
        tenantGroup = req.query.tenantGroup;
    }

     
    //config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup + "','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

    config.query("select * from cb_billing_sp_filters_v2_new('" + tenantGroup + "','" + cloud_list + "','" + service_name + "','','" + start_date + "','" + end_date + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
         

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
exports.getBillingFillterList1 = getBillingFillterList1;

// using alibaba provider



function billingFillterTeamList_tco(req, res, next) {


    //var region_list = "";
    var selectedMode = "";
    var tenantGroup = "";//"AlibabaGroup1";

    // we temp not used provider id but we pass
    //if (req.query.region_list) {
    //    list_id = req.query.region_list;
    //}
    if (req.query.selectedMode) {
        selectedMode = req.query.selectedMode;
    }
    if (req.query.tenantGroup) {
        tenantGroup = req.query.tenantGroup;
    }

    config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup+"','','','','','','" + selectedMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

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
exports.billingFillterTeamList_tco = billingFillterTeamList_tco;

function billingFillterAccList_tco(req, res, next) {


     var team_list = "";
    var selectedMode = "";
    var tenantGroup = "";//"AlibabaGroup1";
    // we temp not used provider id but we pass
    if (req.query.team_list) {
        team_list = req.query.team_list;
    }
    //'get_tco_account'
    if (req.query.selectedMode) {
        selectedMode = req.query.selectedMode;
    }
     if (req.query.tenantGroup) {
        tenantGroup = req.query.tenantGroup;
    }
    config.query("select * from cb_billing_sp_filters_v2('" + tenantGroup+"','" + team_list + "','','','','','" + selectedMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

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
exports.billingFillterAccList_tco = billingFillterAccList_tco;

//Get filter list for region and accounts on page load for detail billing report
function getBillFillter_detailReport_List(req, res, next) {
    var cloud_list = "";   
    var selectMode = "";
    var tenantGroup = "";

    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }    
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    if (req.query.tenantGroup) {
        tenantGroup = req.query.tenantGroup;
    }

    config.query("select * from cb_billing_detailreport_sp_filters('" + tenantGroup + "','" + cloud_list + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.getBillFillter_detailReport_List = getBillFillter_detailReport_List;

//Get Usage data for region and accounts detail billing report
function getBillUsage_detailReport(req, res, next) { 
    var cloud_list = '';
    var acc_list = '';
    var region_list = '';
    var start_date = '';
    var end_date = '';

    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.acc_list) {
        acc_list = req.query.acc_list;
    }
    if (req.query.region_list) {
        region_list = req.query.region_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
        
    config.query("select * from cb_mon_alibaba_cloud_provider_billing_report_data('" + cloud_list + "','" + acc_list + "','" + region_list + "','" + start_date + "','" + end_date + "','mode');", function (err, result, fields) {
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
exports.getBillUsage_detailReport = getBillUsage_detailReport;