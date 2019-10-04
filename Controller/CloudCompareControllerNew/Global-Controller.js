var config = require('../../config');
var compare = require('./Compare-Controller');

function globalFunction(req, res, next) {
    var userName = null;
    var userId = 0;
    var cost_type = null;
    var cloudName = null;
    var cloud_id = null;
    var source = null;
    var spName = null;
    var mode = null;
    var region = null;
    var inputData = null;
    var region_name = null;
    var doc_id = null;
    var acc_list = '';
    var vcpu = 0;
    var memory = 0;
    var os = null;
    var instanceType = null;
    var destCloudId = 0;
    var hours=0;
    var userDisplayName=null;



    //get date-------------------------------
   //last month date
    first = new Date()
    date = new Date(first);
    year = date.getFullYear();
    month = date.getMonth()-1;
    dt = date.getDate() - 1;

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    console.log(year + '-' + month + '-' + dt);
    start_date = year + '-' + month + '-' + dt

    //current date
    last = new Date()
    date1 = new Date(last);
    year1 = date1.getFullYear();
    month1 = date1.getMonth() + 1;
    dt1 = date1.getDate();

    if (dt1 < 10) {
        dt1 = '0' + dt1;
    }
    if (month1 < 10) {
        month1 = '0' + month1;
    }

    console.log(year1 + '-' + month1 + '-' + dt);
    end_date = year1 + '-' + month1 + '-' + dt1

//----------------

    res.setHeader("access-control-allow-origin", "*");
    if (req.body.doc_id) {
        doc_id= req.body.doc_id;
    }
    if (req.body.userName) {
        userName = req.body.userName;
    }
    if (req.body.userId) {
        userId = req.body.userId;
    }
    if (req.body.cloudName) {
        cloudName = req.body.cloudName;
    }
    if (req.body.region) {
        region = req.body.region;
    }
    if (req.body.inputData) {
        inputData = req.body.inputData;
    }
    if (req.body.cloud_id) {
        cloud_id = req.body.cloud_id;
    }
    if (req.body.region_id) {
        region_id = req.body.region_id;
    }
    if (req.body.cost_type) {
        cost_type = req.body.cost_type;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.subscription) {
        subscription = req.body.subscription;
    }
    if (req.body.service) {
        service = req.body.service;
    }
    if (req.body.region_list) {
        region_list = req.body.region_list;
    }
    if (req.body.resource_id) {
        resource_id = req.body.resource_id.toString();
    }
    if (req.body.account_id) {
        account_id = req.body.account_id;
    }
    if (req.body.vcpu) {
        vcpu = req.body.vcpu;
    }
    if (req.body.os) {
        os = req.body.os;
    }
    if (req.body.memory) {
        memory = req.body.memory;
    }
    if (req.body.instanceType) {
        instanceType = req.body.instanceType;
    }
    if (req.body.destCloudId) {
        destCloudId = req.body.destCloudId;
    } 
    if (req.body.region_name) {
        region_name = req.body.region_name;
    }
    if (req.body.userDisplayName) {
        userDisplayName = req.body.userDisplayName;
    }
    /*if (req.body.hours) {
        hours = req.body.hours;
    }*/
    

    if (req.body.source) {
        source = req.body.source;
        if (source == 'cloudList') {
            spName = 'cb_comp_sp_cloud_regions';
            mode = '';
        }
        else if (source == 'srcRegion') { //to get source regions
            spName = 'cb_comp_sp_cloud_regionnew';
            modes = mode;
        }
        else if (source == 'destRegion') { //to get destination regions
            spName = 'cb_comp_sp_get_dest_cloud_regions1';
            modes = 'get_destination_regions';
        }
        else if (source == 'topology') {
            spName = 'cb_comp_sp_cloud_regions'; //to get topology details
            modes = mode;
        }
        else if (source == 'awsVmInfo') {
            spName = '_aws_vm_storage_combine_info'; //to get topology details
            modes = mode;
            compare.getvmInfofunction(start_date, end_date,userDisplayName, account_id, region_list, modes,spName,req, res);
        }
       /* else if (source == 'awsVmPriceInfo') {
            spName = '_cb_comp_sp_get_cost_list_aws_compute'; //to get topology details
            modes = mode;
            compare.getvmPriceInfofunction(cloud_id, region_id, vcpu, memory, os, instanceType, destCloudId, userId,hours, modes, spName, req, res);
        }*/
        else if (source == 'awsVmPriceInfo') {
            spName = '_cb_comp_sp_get_cost_list_aws_compute'; //to get topology details
            modes = mode;
            compare.getvmPriceInfofunction(cloud_id, region_id, vcpu, memory, os, instanceType, destCloudId, userId, hours, modes, spName, req, res);
        }
        else if (source == 'gcpDiskPriceInfo') {
            spName = '_cb_comp_sp_get_cost_list_aws_compute'; //to get topology details
            modes = mode;
            compare.getdiskPriceInfofunction(cloud_id, region_id, vcpu, memory, os, instanceType, destCloudId, userId, modes, spName, req, res);
        }
        else if (source == 'awscostInfo') {
            spName = '_aws_vm_storage_combine_cost'; //to get topology details
            modes = mode;
            compare.getcostInfofunction(resource_id, start_date, end_date, modes, spName, req, res);
        }
        else if (source == 'azureVmInfo') {
            spName = '_azure_vm_storage_info'; //to get topology details
            modes = mode;
            compare.get_azure_vm_info_function(cloudName, service, userDisplayName, region_list, start_date, end_date, subscription, modes, spName, req, res);
        }
        else if (source == 'gcpVmInfo') {
            spName = '_google_vm_storage_combine_info'; //to get topology details
            modes = mode;
            compare.get_gcp_vm_info_function(userName, region_list, subscription, modes, spName, req, res);
        }
        else if (source == 'awsStorageInfo') {
            spName = '_cb_comp_sp_get_aws_storage_cost_list1'; //to get STORAGE details
            modes = mode;
            compare.get_aws_storage_info_function(cloud_id, region_id, region_name, spName, modes, req, res);
        }
        else if (source == 'StorageMappingInfo') {
            spName = '_cb_comp_sp_get_storage_service_mapping1'; //to get STORAGE details
            modes = mode;
            compare.get_storage_info_mapping_function(cloud_id,cloudName,spName, modes, req, res);
        }
         else if (source == 'cloud_document') {
            spName = '_cb_comp_sp_get_cloud_document'; 
            modes = mode;
            compare.get_document_info_function(doc_id,spName, modes, req, res);
        }
       

    }
    res.header("access-control-allow-origin", "*");
    compare.getCloud_Region(userName, userId, cloudName, inputData, region, spName, modes, req, res);
   
}
exports.globalFunction = globalFunction;


function comp_onprem_user(req, res, next) {

        console.log("select _cb_comp_onprem_users('" + req.body.usergroup + "','"+ req.body.user_name +"')");
        config.query("select _cb_comp_onprem_users('" + req.body.usergroup + "','"+ req.body.user_name +"')", function (err, result, fields) {
            if (!err) {
                console.log(result);


                var out = result
                res.header("access-control-allow-origin", "*");
                //res.setheader("access-control-allow-origin", "*");
                res.send(out);
            }
            else {
                console.log('error while performing query.', err);
                res.send(err);
            }
        });


}
exports.comp_onprem_user = comp_onprem_user;

function onprem_excel_insert(req, res, next) {
    console.log("select _cb_comp_insert_excel('" + req.body.mode + "','" + req.body.name + "','" + req.body.usergroup + "','" + req.body.user_name + "','" + req.body.VM_Name + "','" + req.body.OS_Family + "','" + req.body.OS_Name + "'," + req.body.RAM + "," + req.body.CPU + "," + req.body.Disk_Size + ",'" + req.body.storagename + "'," + req.body.storagesize + ",'" + req.body.storagetype + "'," + req.body.readop + "," + req.body.writeop + "," + req.body.deleteop + "," + req.body.Data_Transferred_out_from_VM_in_size + ",'" + req.body.VM_Hosted_Region + "','" + req.body.Data_Transferred_To_Country + "')");
    config.query("select _cb_comp_insert_excel('" + req.body.mode + "','" + req.body.name + "','" + req.body.usergroup + "','" + req.body.user_name + "','" + req.body.VM_Name + "','" + req.body.OS_Family + "','" + req.body.OS_Name + "'," + req.body.RAM + "," + req.body.CPU + "," + req.body.Disk_Size + ",'" + req.body.storagename + "'," + req.body.storagesize + ",'" + req.body.storagetype + "'," + req.body.readop + "," + req.body.writeop + "," + req.body.deleteop + "," + req.body.Data_Transferred_out_from_VM_in_size + ",'" + req.body.VM_Hosted_Region + "','" + req.body.Data_Transferred_To_Country + "')", function (err, result, fields) {
        if (!err) {
            console.log(result);


            var out = result
            res.header("access-control-allow-origin", "*");
            //res.setheader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('error while performing query.', err);
            res.send(err);
        }
    });
}
exports.onprem_excel_insert = onprem_excel_insert;

function onpremgetDatauser(req, res, next) {
    config.query("select * from getData_onprem_new(" + req.body.id + ")", function (err, result, fields) {
        if (!err) {
            console.log(result);


            var out = result
            res.header("access-control-allow-origin", "*");
            //res.setheader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('error while performing query.', err);
            res.send(err);
        }
    });
}
exports.onpremgetDatauser = onpremgetDatauser;

function onpremusertable(req, res, next) {
    console.log("select _cb_comp_onprem_username('" + req.body.name + "','" + req.body.usergroup + "','" + req.body.user_name + "')");
    config.query("select _cb_comp_onprem_username('" + req.body.name + "','" + req.body.usergroup + "','" + req.body.user_name + "')", function (err, result, fields) {
        if (!err) {
            console.log(result);


            var out = result
            res.header("access-control-allow-origin", "*");
            //res.setheader("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('error while performing query.', err);
            res.send(err);
        }
    });
}
exports.onpremusertable = onpremusertable;