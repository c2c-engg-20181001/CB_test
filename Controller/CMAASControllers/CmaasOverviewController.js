var config = require('../../config');
var request = require("request");
function cmaasOverview(req, res, next) {

    var user_id = null;
    var cloud_id = null;
    var section_id = null;
    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
    }
    if (req.query.section_id) {
        section_id = req.query.section_id;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    
    config.query("SELECT * from cb_cmaas_sp_get_overview(null,'" + cloud_id + "','" + mode + "');", function (err, result, fields) {
        //config.query("select * from cb_cost_trend_sp_get_azure_service_cost('" + subscriptionid + "','" + start_date + "','" + end_date + "','" + region_list + "','" + mode + "');", function (err, result, fields) {
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
exports.cmaasOverview = cmaasOverview;

function cmaasOverviewProgress(req, res, next) {

    var user_id = null;
    var cloud_id = null;
    var section_id = null;
    var mode = '';
    var surveyid = null;
    // we temp not used provider id but we pass
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
    }
    if (req.query.section_id) {
        section_id = req.query.section_id;
    }
    if (req.query.surveyid) {
        surveyid = req.query.surveyid;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_overview2('" + user_id + "',null,'" + section_id + "','"+ surveyid + "','"+ mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        //config.query("select * from cb_cost_trend_sp_get_azure_service_cost('" + subscriptionid + "','" + start_date + "','" + end_date + "','" + region_list + "','" + mode + "');", function (err, result, fields) {
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
exports.cmaasOverviewProgress = cmaasOverviewProgress;

function cmaasOverviewDelete(req, res, next) {

    var user_id = null;
    var cloud_id = null;
    var section_id = null;
    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
    }
    if (req.query.section_id) {
        section_id = req.query.section_id;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_overview2('" + user_id + "',null,'" + section_id + "',null,'" + mode + "','info');", function (err, result, fields) {
        //config.query("select * from cb_cost_trend_sp_get_azure_service_cost('" + subscriptionid + "','" + start_date + "','" + end_date + "','" + region_list + "','" + mode + "');", function (err, result, fields) {
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
exports.cmaasOverviewDelete = cmaasOverviewDelete;

function cmaasDashboardCloudList(req, res, next) {

    var user_id = null;
 
    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
   
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_dashboard(null,null,null,null,'" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        //config.query("select * from cb_cost_trend_sp_get_azure_service_cost('" + subscriptionid + "','" + start_date + "','" + end_date + "','" + region_list + "','" + mode + "');", function (err, result, fields) {
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
exports.cmaasDashboardCloudList = cmaasDashboardCloudList;

function cmaasDashboardExistingList(req, res, next) {

    var user_id = null;
    var user_name = null;
    var cloudid = null;

    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
    if (req.query.user_name) {
        user_name = req.query.user_name;
    }
    if (req.query.cloudid) {
        cloudid = req.query.cloudid;
    }

    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_dashboard('" + user_id + "',null,null,'"  +cloudid+ "','" +mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        //config.query("select * from cb_cost_trend_sp_get_azure_service_cost('" + subscriptionid + "','" + start_date + "','" + end_date + "','" + region_list + "','" + mode + "');", function (err, result, fields) {
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
exports.cmaasDashboardExistingList = cmaasDashboardExistingList;

function cmaasUserList(req, res, next) {

    var user_id = null;
    var user_name = null;
    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_name) {
        user_name = req.query.user_name;
    }

    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_dashboard(null,'" + user_name + "',null,'" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        
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
exports.cmaasUserList = cmaasUserList;

function cmaasUserid(req, res, next) {

    var user_id = null;
    var user_name = null;
    var mode = '';

    // we temp not used provider id but we pass
    if (req.query.user_name) {
        user_name = req.query.user_name;
    }

    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_dashboard(null,'" + user_name + "',null,'" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

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
exports.cmaasUserid = cmaasUserid;
function cmaasSurvey(req, res, next) {
    var userid = null;
    var surveyname = null;
    var cloudid = null;
 
    var mode = null;


    if (req.query.userid) {
        userid = req.query.userid;
    }
    if (req.query.surveyname) {
        surveyname = req.query.surveyname;
    }

    if (req.query.cloudid) {
        cloudid = req.query.cloudid;
    }
   
    if (req.query.mode) {
        mode = req.query.mode;
    }


    config.query("select * from cb_cmaas_sp_get_dashboard('" + userid + "',null,'" + surveyname + "','" + cloudid + "','" + mode + "','info');FETCH ALL IN \"info\";", function (err, result) {
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
exports.cmaasSurvey = cmaasSurvey; 

function cmaasGetVmsAppnDetails(req, res, next) {
   

    var mode = null;



    if (req.query.mode) {
        mode = req.query.mode;
    }


    config.query("select * from cb_cmaas_sp_get_vms_appn_details('"  + mode + "','info');FETCH ALL IN \"info\";", function (err, result) {
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
exports.cmaasGetVmsAppnDetails = cmaasGetVmsAppnDetails; 

function cmaasGetOperations(req, res, next) {
    var p_client_id = '4e159677-fa99-447b-8e62-196dbe13432e';
    var p_client_secret = 'ULcQVGQRhikrHTJh9ugPL+yajd8SBzZatXONmvnEjl0=';
    var p_grant_type = 'client_credentials';
    var p_resource = 'https://management.azure.com/';
    var tenantId = '8d701aac-2869-431d-9b81-9720beb26fb9';
    var contents = req.query.vm_detailsss;

    var options = {
        method: 'POST',
        url: 'https://login.microsoftonline.com/' + tenantId +'/oauth2/token',
        headers:
        {
            'Postman-Token': '162cff28-089a-4d30-bdc1-30b3e6c1e8f1',
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form:
        {
            client_id: '4e159677-fa99-447b-8e62-196dbe13432e',
            client_secret: 'ULcQVGQRhikrHTJh9ugPL+yajd8SBzZatXONmvnEjl0=',
            grant_type: 'client_credentials',
            resource: 'https://management.core.windows.net/',
            undefined: undefined
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        // console.log(body);
        var object1 = JSON.parse(body);
        var token =  object1.access_token ;

      

        var bearerToken = 'Bearer ' + token;
    var options = {
        method: 'GET',
        url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/aniazrhelclirsgrp/providers/Microsoft.Compute/virtualMachines/centos-7-6/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU&timespan=2019-05-15T05:47:00Z/2019-05-15T14:18:00Z&aggregation=Average,minimum,maximum,total',
        qs: { 'api-version': '2018-01-01' },
        headers:
        {
            'Postman-Token': '9174cf4e-5a33-4354-9f1c-828dca1ed43e',
            'cache-control': 'no-cache',
            'Authorization': bearerToken

        }

    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.header("access-control-allow-origin", "*");
        res.send(body);

       
      
        });
    });
}
exports.cmaasGetOperations = cmaasGetOperations; 