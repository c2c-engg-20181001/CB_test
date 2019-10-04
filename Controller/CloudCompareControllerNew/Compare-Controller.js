var config = require('../../config');
var azure = require('./Azure-Controller');

function getCloud_Region(userName, userId, cloudName, inputData, region, spName, mode, req, res) {

    var user_name = null;
    var user_id = null;
    var cloud_name = null;
    var source = null;
    var sp_name = null;
    //var mode = null;

    if (userName) {
        user_name = userName;
    }
    if (userId) {
        user_id = userId;
    }
    if (cloudName) {
        cloud_name = cloudName;
    }
    if (spName) {
        sp_name = spName;
    }
    if (inputData) {
        inputData = inputData;
    }
    if (region) {
        region = region;
    }
    if (mode) {
        modes = mode;
    }
    //if (cloud_name == 'Azure') {
    //    var a = azure.azureFunction(cloud_name); 
    //}    


    config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "','" + inputData + "','" + region + "','" + user_id + "','info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result[1].rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getCloud_Region = getCloud_Region;


function getvmInfofunction(start_date, end_date,userDisplayName, account_id, region_list, modes, spName, req, res) {


    config.query("select * from " + spName + "('" + start_date + "','" + end_date + "','" + userDisplayName + "','" + account_id + "','" + region_list + "','" + modes + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getvmInfofunction = getvmInfofunction;

function getcostInfofunction(resource_id, start_date, end_date, modes, spName, req, res) {

    config.query("select * from " + spName + "('" + resource_id + "','" + start_date + "','" + end_date + "','" + modes + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getcostInfofunction = getcostInfofunction;

function get_azure_vm_info_function(cloudName, service, userDisplayName, region_list, start_date, end_date, subscription, modes, spName, req, res) {

    config.query("select * from " + spName + "('" + cloudName + "','" + service + "','" + userDisplayName + "','" + region_list + "','" + start_date + "','" + end_date + "','" + subscription + "','" + modes + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.get_azure_vm_info_function = get_azure_vm_info_function;

function get_gcp_vm_info_function(userName, region_list, subscription, modes, spName, req, res) {

    config.query("select * from " + spName + "('" + subscription + "','" + region_list + "','" + modes + "','" + userName + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.get_gcp_vm_info_function = get_gcp_vm_info_function;

function getvmPriceInfofunction(cloud_id, region_id, vcpu, memory, os, instanceType, destCloudId, userId,hours, modes, spName, req, res) {
    

    //config.query("select * from " + spName + "('" + cloud_id + "','" + region_id + "','" + vcpu + "','" + memory + "','" + os + "','" + instanceType + "','" + destCloudId+ "','" + userId + "','" + modes + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
         config.query("select * from " + spName + "('" + cloud_id + "','" + region_id + "','" + vcpu + "','" + memory + "','" + os + "','" + instanceType + "','" + destCloudId+ "','" + userId+ "','" + hours + "','" + modes + "');", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getvmPriceInfofunction = getvmPriceInfofunction;

function getdiskPriceInfofunction(cloud_id, region_id, vcpu, memory, os, instanceType, destCloudId, userId, modes, spName, req, res) {


    config.query("select * from " + spName + "('" + cloud_id + "','" + region_id + "','" + vcpu + "','" + memory + "','" + os + "','" + instanceType + "','" + destCloudId + "','" + userId + "','" + modes + "');", function (err, result, fields) {
        //config.query("select * from " + spName + "('" + user_name + "','" + cloud_name + "','" + modes + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);

            //after getting data if user wants to do calculations
            //if (cloud_name == 'Azure')modes
            //    var a = azure.azureFunction(cloud_name);
            //else if(cloud_name == 'AWS')
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getdiskPriceInfofunction = getdiskPriceInfofunction;

function get_aws_storage_info_function(cloud_id, region_id, region_name, spName, modes, req, res) {

    config.query("select * from " + spName + "('" + cloud_id + "','" + region_id + "','" + region_name + "','" + modes + "');", function (err, result, fields) {
        if (!err) {
            console.log(result);

            
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.get_aws_storage_info_function = get_aws_storage_info_function;

function get_storage_info_mapping_function(cloud_id,cloudName,spName, modes, req, res) {

    config.query("select * from " + spName + "('" + cloud_id + "','" + cloudName + "','" + modes + "');", function (err, result, fields) {
        if (!err) {
            console.log(result);

            
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.get_storage_info_mapping_function = get_storage_info_mapping_function;

function insertexcel(req,res){
    console.log("pratik"+req);
    // console.log("select _cb_comp_excel_insert('"+req.body['VM_Name']+"','"+req.body['OS_Family']+"','"+req.body['OS_Name']+"',"+req.body['RAM']+","+req.body['CPU']+","+req.body['Disk_Size']+")");
    config.query("select _cb_comp_excel_insert('"+req.body.VM_Name+"','"+req.body.OS_Family+"','"+req.body.OS_Name+"',"+req.body.RAM+","+req.body.CPU+","+req.body.Disk_Size+")", function (err, result, fields) {
        if (!err) {
            console.log(result);

            
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.insertexcel = insertexcel; 

function get_document_info_function(doc_id,spName, modes, req, res) {

    config.query("select * from " + spName + "('" + modes + "','" + doc_id + "','info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
           var out = result[1].rows
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.get_document_info_function = get_document_info_function;
