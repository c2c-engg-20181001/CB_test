var config = require('../../config');



//Get Network page load
function getAwsStorageNetwork_billing(req, res, next) {

    var cloud_list = "";
    var start_date = "";
    var end_date = "";
    var acc_list = "";
    var selectMode = "";
    var region_list = "";


    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.acc_list) {
        acc_list = req.query.acc_list;
    }
    if (req.query.region_list) {
        region_list = req.query.region_list;
    }
    //mode=getAwsStorageNetwork
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    
    config.query("select * from cb_bil_sp_get_aws_network('" + start_date + "','" + end_date + "','" + acc_list + "','" + region_list + "','" + selectMode + "');", function (err, result, fields) {
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
exports.getAwsStorageNetwork_billing = getAwsStorageNetwork_billing;
//get Azure Topology
function getAzureTopology_billing(req, res, next) {
    var cloud_list = "";
    var start_date = "";
    var end_date = "";
    var acc_list = "";
    var selectMode = "";
    var region_list = "";
    var service = "";

    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.acc_list) {
        acc_list = req.query.acc_list;
    }
    if (req.query.region_list) {
        region_list = req.query.region_list;
    }
    if (req.query.service) {
        service = req.query.service;
    }
    //mode=getAwsStorageNetwork
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }

    //'Azure',
    //    'Virtual Machines',
    //    'US West,US East',
    //    '2019-01-10',
    //    '2019-01-31',
    //    'efbaf842-f428-4020-8718-9e3a642fa2c6',
    //    'get_cloud_topology_price',
    //    'info'


   // config.query("select * from cb_billing_get_topology('" + cloud_list + "','" + service + "','" + region_list + "','" + start_date + "','" + end_date + "','" + acc_list + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
      
      config.query("select * from cb_billing_get_topology1('" + cloud_list + "','" + service + "','" + region_list + "','" + start_date + "','" + end_date + "','" + acc_list + "','" + selectMode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {  

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
exports.getAzureTopology_billing = getAzureTopology_billing;

function getAzureTopology_billing_storage(req, res, next) {
    var cloud_list = "";
    var start_date = "";
    var end_date = "";
    var acc_list = "";
    var selectMode = "";
    var region_list = "";
    var service = "";

    if (req.query.cloud_list) {
        cloud_list = req.query.cloud_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.acc_list) {
        acc_list = req.query.acc_list;
    }
    if (req.query.region_list) {
        region_list = req.query.region_list;
    }
    if (req.query.service) {
        service = req.query.service;
    }
    //mode=getAwsStorageNetwork
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }

    //'Azure',
    //    'Virtual Machines',
    //    'US West,US East',
    //    '2019-01-10',
    //    '2019-01-31',
    //    'efbaf842-f428-4020-8718-9e3a642fa2c6',
    //    'get_cloud_topology_price',
    //    'info'


    config.query("select * from _cb_bil_azure_storage_topology('" + cloud_list + "','" + service + "','" + region_list + "','" + start_date + "','" + end_date + "','" + acc_list + "','" + selectMode + "');", function (err, result, fields) {
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
exports.getAzureTopology_billing_storage = getAzureTopology_billing_storage;

//Get cost of Resource
function getResourceCost_billing(req, res, next) {

    var resource_list = "";
    var start_date = "";
    var end_date = "";
    var selectMode = "";
    


    if (req.query.resource_list) {
        resource_list = req.query.resource_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
   
    //mode=getResourceCost
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }

    config.query("select * from cb_bil_sp_get_aws_cost('" + resource_list + "','" + start_date + "','" + end_date + "','','','" + selectMode + "');", function (err, result, fields) {
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
exports.getResourceCost_billing = getResourceCost_billing;

//Get cost of TCO
function getTco_billing(req, res, next) {

    var account_list = "";
    var start_date = "";
    var end_date = "";
    var region_list = "";
    var selectMode = "";



    if (req.query.account_list) {
        account_list = req.query.account_list;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    if (req.query.region_list) {
        region_list = req.query.region_list;
    }
    //mode=getResourceCost
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }

    config.query("select * from cb_bil_sp_get_tco_cost('" + account_list + "','" + start_date + "','" + end_date + "','" + region_list + "','','" + selectMode + "');", function (err, result, fields) {
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
exports.getTco_billing = getTco_billing;
