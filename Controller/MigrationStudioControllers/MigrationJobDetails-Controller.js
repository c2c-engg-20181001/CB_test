var crypto = require('crypto');
var config = require('../../config');
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var request = require('request');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';
var migrationStudioControllerFile = require('./migration-studio-controller')

// var migration_ip_linux = "http://192.168.1.229/migration-studio/"

function create_token(req, res, next) {
    res.header("access-control-allow-origin", "*");

    //response skeleton for the api
    response = {
        "status": "",
        "token": "",
        "error": {
            "message": "",
            "code": 0
        }
    }
    //validation for the parameter is present or not
    if (!req.body.product_id) {
        response.status = "error";
        token = null;
        response.error.message = "product_id parameter is missing";
        return res.send(response);
    } else {
        id = req.body.product_id;
        //getting the details of the user whose id received by the api 
        config.query("select * from cb_mig_sp_get_user_details_for_notification(" + id + ",'select');", function (err, result) {
            if (!err) {
                if (!(result.rows[0].cb_mig_sp_get_user_details_for_notification == null)) {
                    query_result = result.rows[0].cb_mig_sp_get_user_details_for_notification[0];

                    //token generation
                    var data = {
                        "username": query_result.username,
                        "password": query_result.password_digest
                    }
                    var options = {
                        method: 'POST',
                        url: migration_ip_linux + 'create-token/',
                        headers:
                        {
                            'Content-Type': 'application/json'
                        },
                        body: data,
                        json: true
                    };
                    request(options, function (error, resp, body) {
                        token = body.token;
                        if (token != undefined && Object.keys("token").length != 0) {
                            response.status = "successful";
                            response.token = token;
                            return res.send(response);
                        }
                        else {
                            response.status = "error";
                            if (Object.keys("error").length != 0) {
                                //For specific error from the create token api
                                response.error.message = body.error;
                                response.error.code = body.error_code;
                            }
                            else
                                //Generalised error
                                response.error.message = "Token generation failed.";
                            return res.send(response);
                        }
                    });
                }
                else {
                    response.status = "error";
                    response.error.message = "product_id is invalid";
                    return res.send(response);
                }
            }
            else {
                response.status = "error";
                response.error.message = "Error while executing stored procedure. " + err;
                return res.send(response);
            }
        });
    }
}
exports.create_token = create_token;

function getSrcDest(req, res, next) {
    var user_id = null;
    var migration_type = null;

    if (req.query.id1) {
        user_id = parseInt(req.query.id1);
    }
    if (req.query.id2) {
        migration_type = req.query.id2;
    }
    config.query("select * from cb_mig_sp_get_migrationname(" + user_id + ",'" + migration_type + "' ,'select');", function (err, result) {
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
exports.getSrcDest = getSrcDest;

/*---------- PopUp----------------*/
function migrationUserDetails(req, res, next) {
    var user_id = null;
    var source_details;
    var dest_details;
    var migration_type = null;
    var create_date = null;
    var modify_date = null;
    var migra_name = null;

    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.curr_date) {
        create_date = req.query.curr_date;
    }
    if (req.query.src_detail) {
        source_details = req.query.src_detail;
    }
    if (req.query.dest_detail) {
        dest_details = req.query.dest_detail;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.modify_date) {
        modify_date = req.query.modify_date;
    }
    if (req.query.migration_name) {
        migra_name = req.query.migration_name;
    }

    config.query("select * from cb_mig_sp_to_get_user_src_dest_details(" + user_id + " ,'" + create_date + "','" + modify_date + "','" + migration_type + "' ,'" + source_details + "','" + dest_details + "' ,'" + migra_name + "', 'insert', 'info');", function (err, result) {
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
exports.migrationUserDetails = migrationUserDetails;

function migrationAllDnDJobDetails(req, res, next) {
    var user_id = null;
    var job_id = null;
    var job_status = null;
    var source_cloud = null;
    var destination_cloud = null;
    var object_name = null;
    var migration_type = null;
    var error_message = null;
    var created_date = null;
    var topology_name = null;

    if (req.query.id1) {
        job_id = req.query.id1;
    }
    if (req.query.id2) {
        job_status = req.query.id2;
    }
    if (req.query.id3) {
        user_id = parseInt(req.query.id3);
    }
    if (req.query.id4) {
        source_cloud = req.query.id4;
    }
    if (req.query.id5) {
        destination_cloud = req.query.id5;
    }
    if (req.query.id6) {
        object_name = req.query.id6;
    }
    if (req.query.id7) {
        migration_type = req.query.id7;
    }
    if (req.query.id8) {
        error_message = req.query.id8;
    }
    if (req.query.id9) {
        created_date = req.query.id9;
    }
    if (req.query.id10) {
        topology_name = req.query.id10;
    }

    config.query("select * from cb_mig_sp_post_dnd_complete_migration_job_details('" + job_id + "','" + job_status + "'," + user_id + ",'" + source_cloud + "','" + destination_cloud + "','" + object_name + "','" + migration_type + "','" + error_message + "','" + created_date + "','" + topology_name + "', 'insert', 'info');", function (err, result) {
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
exports.migrationAllDnDJobDetails = migrationAllDnDJobDetails;


function migrationScheduledJobDetails(req, res, next, ssh_key, key_name, account_name, callback) {

    var user_id = null;
    var datetime = null;
    var source_details = {};
    var dest_details = {};
    var zone_id = null;
    var decipher = null;
    var dec = null;
    var src_data = null;
    var SSHKeyList = [];
    if (req.body.id1) {
        user_id = parseInt(req.body.id1);
    }
    if (req.body.id5) {
        migration_type = req.body.id5;
    }
    if (req.body.id2) {
        datetime = req.body.id2;
    }
    if (req.body.id3) {
        if (migration_type === 'D2C' || migration_type === 'V2C' || migration_type === 'V2V' || migration_type === 'S2C') {
            source_details = req.body.id3;
            source_details = JSON.parse(source_details);
            if (migration_type === 'V2C' && source_details.vmType === 'VMWare') {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.src_vmware_password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.src_vmware_password = dec
            }
            else if (migration_type === 'V2C' && source_details.vmType === 'Hyper-V') {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.src_password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.src_password = dec
            }
            else if (migration_type === 'V2V') {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.password = dec
            }
            // else if(migration_type === 'V2V' && source_details.vmType === 'Hyper-V') {
            //     decipher = crypto.createDecipher(algorithm, password)
            //     dec = decipher.update(source_details.hyperv_password, 'hex', 'utf8')
            //     dec += decipher.final('utf8');
            //     source_details.hyperv_password = dec
            // }
            else if (migration_type === 'S2C') {
                if (source_details.security) {
                    decipher = crypto.createDecipher(algorithm, password)
                    dec = decipher.update(source_details.security, 'hex', 'utf8')
                    dec += decipher.final('utf8');
                    source_details.security = dec
                }
            }
            else {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.password = dec
            }
            // source_details = JSON.stringify(source_details)
        }
        else {
            src_data = req.body.id3
            src_data = JSON.parse(src_data)
            source_details = src_data
        }
    }

    if (req.body.id4) {
        dest_details = req.body.id4;
        if (migration_type === 'D2C') {
            dest_details = JSON.parse(dest_details);
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(dest_details.password, 'hex', 'utf8')
            dec += decipher.final('utf8');
            dest_details.password = dec
        }
        else if (migration_type === 'V2V') {
            dest_details = JSON.parse(dest_details);
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(dest_details.password, 'hex', 'utf8')
            dec += decipher.final('utf8');
            dest_details.password = dec
            // if(dest_details.vmType === 'VMware') {
            //     decipher = crypto.createDecipher(algorithm, password)
            //     dec = decipher.update(dest_details.vm_ware_password, 'hex', 'utf8')
            //     dec += decipher.final('utf8');
            //     dest_details.vm_ware_password = dec
            // }
            // else if(dest_details.vmType === 'Hyper-V') {
            //     decipher = crypto.createDecipher(algorithm, password)
            //     dec = decipher.update(dest_details.hyperv_password, 'hex', 'utf8')
            //     dec += decipher.final('utf8');
            //     dest_details.hyperv_password = dec
            // }
        }
        else if (migration_type === 'V2C' || migration_type === 'C2C' || migration_type === 'P2C') {
            dest_details = JSON.parse(dest_details);
            if (source_details.destinationcloud == "Alibaba") {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(dest_details.dest_secret_key, 'hex', 'utf8')
                dec += decipher.final('utf8');
                dest_details.dest_secret_key = dec
            }
            else if (source_details.destinationcloud == "OTC") {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(dest_details.secret_key, 'hex', 'utf8')
                dec += decipher.final('utf8');
                dest_details.secret_key = dec

                decipher = null
                dec = null

                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(dest_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                dest_details.password = dec
            }

        }
        else if (migration_type === 'S2C') {
            dest_details = JSON.parse(dest_details);
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(dest_details.security, 'hex', 'utf8')
            dec += decipher.final('utf8');
            dest_details.security = dec
        }


        dest_details = JSON.stringify(dest_details)
    }

    if (req.body.zoneId) {
        zone_id = req.body.zoneId;
    }
    if (req.body.is_rsync) {
        is_rsync = req.body.is_rsync;
    }

    if (migration_type === 'C2C') {
        for (var i = 0; i < src_data.data.length; i++) {
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(src_data.data[i], 'hex', 'utf8')
            dec += decipher.final('utf8');
            src_data.data[i] = dec
            src_data.data[i] = JSON.parse(src_data.data[i]);
            // SSHKeyList.push(src_data.data[i].ssh_key)            
        }
        SSHKeyList.push(ssh_key)
        if (src_data.sourcecloud === 'Azure') {
            source_details.tenant_id = src_data.data[0].tenant_id
            if (is_rsync === 'true') {
                source_details.ssh_key = SSHKeyList
                source_details.key_pair_name = key_name
                source_details.account_name = account_name
            }
            else if (is_rsync === 'false') {
                source_details.client_id = src_data.data[0].client_id
                source_details.secret_key = src_data.data[0].client_secret
                source_details.tenant_id = src_data.data[0].tenant_id
                source_details.subscription_id = src_data.data[0].subscription_id
            }
        }
        else if (src_data.sourcecloud === 'Google') {
            source_details.tenant_id = src_data.data[0].project_id
            if (is_rsync === 'true') {
                source_details.ssh_key = SSHKeyList
                source_details.key_pair_name = key_name
                source_details.account_name = account_name
            }
            else if (is_rsync === 'false') {
                source_details.credentials = JSON.parse(src_data.data[0].service_account_json)
            }
        }
        else if (src_data.sourcecloud === 'Openstack') {
            source_details.auth_url = "http://" + src_data.data[0].hostname + ":" + parseInt(src_data.data[0].api_port) + "/" + src_data.data[0].api_version
            source_details.username = src_data.data[0].client_id
            source_details.password = src_data.data[0].client_secret
            source_details.domain_id = src_data.data[0].v3_domain_id
        }
        else if (src_data.sourcecloud === 'AWS') {
            source_details.access_key = src_data.data[0].client_id
            source_details.secret_key = src_data.data[0].client_secret
            source_details.tenant_id = src_data.data[0].client_id
            source_details.ssh_key = SSHKeyList
            source_details.key_pair_name = key_name
            source_details.account_name = account_name
        }
        delete source_details.data
        // source_details = JSON.stringify(source_details)
    }
    source_details = JSON.stringify(source_details)

    config.query("select * from cb_mig_sp_to_get_schedular_details(" + user_id + " ,'" + datetime + "','" + migration_type + "','" + source_details + "','" + dest_details + "','" + zone_id + "','" + is_rsync + "', 'insert', 'info');", function (err, result) {
        console.log(req.query)
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            callback(result, false)
            // res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
        }
    });
}
exports.migrationScheduledJobDetails = migrationScheduledJobDetails;

function migrationSrcDetails(req, res, next) {
    var user_id = null;
    var source_details;
    var migration_type = null;
    var ip_add = null;
    var migra_name = null;
    var mode = null;

    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }

    if (req.query.src_detail) {
        source_details = req.query.src_detail;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.ip_add) {
        ip_add = req.query.ip_add;
    }
    if (req.query.migration_name) {
        migra_name = req.query.migration_name;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    config.query("select * from cb_mig_sp_to_get_migration_src_details(" + user_id + " ,'" + migration_type + "','" + source_details + "' ,'" + migra_name + "' ,'" + ip_add + "', '" + mode + "', 'info');", function (err, result) {
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
exports.migrationSrcDetails = migrationSrcDetails;


function migrationDestDetails(req, res, next) {
    var user_id = null;
    var dest_details;
    var migration_type = null;
    var dest_host = null;
    var migra_name = null;
    var mode = null;
    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.dest_detail) {
        dest_details = req.query.dest_detail;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.migration_name) {
        migra_name = req.query.migration_name;
    }
    if (req.query.dest_host) {
        dest_host = req.query.dest_host;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("select * from cb_mig_sp_to_get_migration_dest_details(" + user_id + ",'" + migration_type + "','" + dest_details + "','" + migra_name + "','" + dest_host + "','" + mode + "','info');", function (err, result) {
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
exports.migrationDestDetails = migrationDestDetails;


function migrationSrcDestDetails(req, res, next) {
    var migration_type = null;
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    config.query("select * from cb_mig_sp_get_src_dest_type(" + migration_type + "' ,'select');", function (err, result) {
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
exports.migrationSrcDestDetails = migrationSrcDestDetails;

function migrationSrcIp(req, res, next) {
    var migration_type = null;
    var user_id = null;
    var dbType = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }

    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }
    config.query("select * from cb_mig_sp_get_src_ip_d2c(" + user_id + ",'" + migration_type + "','" + dbType + "' ,'select');", function (err, result) {
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
exports.migrationSrcIp = migrationSrcIp;

function migrationSrcIp_v2c(req, res, next) {
    var migration_type = null;
    var user_id = null;
    var dbType = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }

    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }
    //config.query("select * from cb_mig_sp_get_src_ip(" + user_id + ",'" + migration_type + "' ,'select');", function (err, result) {
    config.query("select * from cb_mig_sp_get_src_ip_v2c(" + user_id + ",'" + migration_type + "','" + dbType + "' ,'select');", function (err, result) {
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
exports.migrationSrcIp_v2c = migrationSrcIp_v2c;

function migrationSrcHostdetails(req, res, next) {
    var src_host = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    var cipher = null;
    var crypted = null;
    var mode = null;

    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.src_host) {
        src_host = req.query.src_host;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }

    if (migration_type == 'D2C' || migration_type == 'V2C') {
        mode = 'd2c_select'
    }
    else {
        mode = 'select'
    }

    config.query("select * from cb_mig_sp_get_sHost_details(" + user_id + ",'" + src_host + "','" + migration_type + "','" + dbType + "' ,'" + mode + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            // if (!(result.rows[0].cb_mig_sp_get_shost_details == null)) {
            //     if(migration_type == 'D2C') {
            //         cipher = crypto.createCipher(algorithm, password)
            //         crypted = cipher.update(result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password, 'utf8', 'hex')
            //         crypted += cipher.final('hex');
            //         result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password = crypted
            //     }    
            //     else if(migration_type == 'P2C' && dbType == 'Packet') {
            //         cipher = crypto.createCipher(algorithm, password)
            //         crypted = cipher.update(result.rows[0].cb_mig_sp_get_shost_details[0].src_details.auth_token, 'utf8', 'hex')
            //         crypted += cipher.final('hex');
            //         result.rows[0].cb_mig_sp_get_shost_details[0].src_details.auth_token = crypted
            //     }  
            //     else if(migration_type == 'P2C' && dbType == 'OnPremise') {
            //         cipher = crypto.createCipher(algorithm, password)
            //         crypted = cipher.update(result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password_ssh, 'utf8', 'hex')
            //         crypted += cipher.final('hex');
            //         result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password_ssh = crypted
            //     }   
            // }      
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.send(err);
        }
    });
}
exports.migrationSrcHostdetails = migrationSrcHostdetails;

function migrationDestList(req, res, next) {
    var migration_type = null;
    var user_id = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    config.query("select * from cb_mig_sp_get_dest_list_details(" + user_id + ",'" + migration_type + "' ,'select');", function (err, result) {
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
exports.migrationDestList = migrationDestList;

function migrationDestDetailsData(req, res, next) {
    var id = null;
    var user_id = null;
    var migration_type = null;
    var vmType = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.id != null) {
        id = parseInt(req.query.id);
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }

    config.query("select * from cb_mig_sp_get_dest_details_data(" + user_id + ",'" + id + "','" + migration_type + "','select');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            //encrypting password
            if (!(result.rows[0].cb_mig_sp_get_dest_details_data == null)) {
                // cipher = crypto.createCipher(algorithm, password)
                // crypted = cipher.update(result.rows[0].cb_mig_sp_get_dest_details_data[0].dest_details.dest_secret_key, 'utf8', 'hex')
                // crypted += cipher.final('hex');
                // result.rows[0].cb_mig_sp_get_dest_details_data[0].dest_details.dest_secret_key = crypted
                if (migration_type === 'P2C') {
                    //encrypting admin password
                    cipher = null;
                    crypted = null;
                    cipher = crypto.createCipher(algorithm, password)
                    crypted = cipher.update(result.rows[0].cb_mig_sp_get_dest_details_data[0].dest_details.dest_admin_password, 'utf8', 'hex')
                    crypted += cipher.final('hex');
                    result.rows[0].cb_mig_sp_get_dest_details_data[0].dest_details.dest_admin_password = crypted
                }
            }

            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.migrationDestDetailsData = migrationDestDetailsData;

function migrationSrcHostdetailsVM(req, res, next) {
    var src_host = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.src_host) {
        src_host = req.query.src_host;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }


    config.query("select * from cb_mig_sp_get_sHost_details(" + user_id + ",'" + src_host + "','" + migration_type + "','select');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            // if (!(result.rows[0].cb_mig_sp_get_shost_details == null)) {
            //     cipher = crypto.createCipher(algorithm, password)
            //     crypted = cipher.update(result.rows[0].cb_mig_sp_get_shost_details[0].src_details.src_vmware_password, 'utf8', 'hex')
            //     crypted += cipher.final('hex');
            //     result.rows[0].cb_mig_sp_get_shost_details[0].src_details.src_vmware_password = crypted
            // }
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.send(err);
        }
    });
}
exports.migrationSrcHostdetailsVM = migrationSrcHostdetailsVM;

function migrationDestIp(req, res, next) {
    var migration_type = null;
    var dbType = null;
    var user_id = null;
    var mode = null;
    if (req.body.user_id != null) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.dbType) {
        dbType = req.body.dbType;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    config.query("select * from cb_mig_sp_get_details_d2c_v2c(" + user_id + ",'" + migration_type + "' ,'" + dbType + "','" + mode + "');", function (err, result) {
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
exports.migrationDestIp = migrationDestIp;

/*function migrationDestIpDetails(req, res, next) {
    var dest_host = null;
    var user_id = null;
    var migration_type = null;
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.dest_host) {
        dest_host = req.query.dest_host;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    config.query("select * from cb_mig_sp_get_dest_ip_details(" + user_id + ",'" + dest_host + "','" + migration_type+"' ,'select');", function (err, result) {
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
exports.migrationDestIpDetails = migrationDestIpDetails;*/

function migrationDestIpDetails(req, res, next) {
    var dest_host = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    var cipher = null;
    var crypted = null;
    var mode = null;

    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.dest_host) {
        dest_host = req.query.dest_host;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }
    if (migration_type == 'D2C') {
        mode = 'd2c_select'
    }
    else {
        mode = 'select'
    }


    config.query("select * from cb_mig_sp_get_dest_ip_details(" + user_id + ",'" + dest_host + "','" + migration_type + "','" + dbType + "','" + mode + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            //if (!(result.rows[0].cb_mig_sp_get_dest_ip_details == null)) {
            //  cipher = crypto.createCipher(algorithm, password)
            //crypted = cipher.update(result.rows[0].cb_mig_sp_get_dest_ip_details[0].dest_details.password, 'utf8', 'hex')
            //crypted += cipher.final('hex');
            //result.rows[0].cb_mig_sp_get_dest_ip_details[0].dest_details.password = crypted
            //}
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.send(err);
        }
    });
}
exports.migrationDestIpDetails = migrationDestIpDetails;

function toCheckExistHost(req, res, next) {


    var host = null;
    var user_id = null;
    var migration_type = null;
    var vm_type = null;
    // var job_status = null;

    if (req.query.migration_type != null) {
        migration_type = req.query.migration_type;
    }
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }

    // }
    if (req.query.host) {
        host = req.query.host;
    }
    if (req.query.vm_type) {
        vm_type = req.query.vm_type;
    }
    // if (req.query.id2) {
    //     job_status = req.query.id2;
    // }
    // if (req.query.id3) {
    //     //job_status = parseInt(req.query.id3);
    // }

    // config.query("select * from sp_select_job_details('', " + user_id + " ,'','select', 'info');", function (err, result) {
    config.query("select * from cb_mig_sp_to_check_dup_values_for_src('" + host + "','" + migration_type + "'," + user_id + ",'" + vm_type + "' ,'select');", function (err, result) {
        //  config.query("select * from sp_get_complete_migration_job_details(17,'Running','select');", function (err, result) {
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
exports.toCheckExistHost = toCheckExistHost;


function toCheckExistHostInDest(req, res, next) {


    var host = null;
    var user_id = null;
    var migration_type = null;
    var migration_name = null;
    // var job_status = null;

    if (req.query.migration_type != null) {
        migration_type = req.query.migration_type;
    }
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.migration_name != null) {
        migration_name = req.query.migration_name;
    }

    // }
    if (req.query.host) {
        host = req.query.host;
    }
    // if (req.query.id2) {
    //     job_status = req.query.id2;
    // }
    // if (req.query.id3) {
    //     //job_status = parseInt(req.query.id3);
    // }

    // config.query("select * from sp_select_job_details('', " + user_id + " ,'','select', 'info');", function (err, result) {
    //config.query("select * from cb_mig_sp_to_check_dup_values_for_dest('" + host + "','" + migration_type + "'," + user_id + " ,'select');", function (err, result) {
    //  config.query("select * from sp_get_complete_migration_job_details(17,'Running','select');", function (err, result) {
    config.query("select * from cb_mig_sp_to_check_dup_values_for_dest('" + host + "','" + migration_type + "'," + user_id + ",'" + migration_name + "','select');", function (err, result) {
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
exports.toCheckExistHostInDest = toCheckExistHostInDest;

function toCheckExistMigrationInDest(req, res, next) {


    var migration_name = null;
    var user_id = null;
    var migration_type = null;
    // var job_status = null;

    if (req.query.migration_type != null) {
        migration_type = req.query.migration_type;

    }
    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);

    }

    // }
    if (req.query.migration_name) {
        migration_name = req.query.migration_name;
    }
    // if (req.query.id2) {
    //     job_status = req.query.id2;
    // }
    // if (req.query.id3) {
    //     //job_status = parseInt(req.query.id3);
    // }

    // config.query("select * from sp_select_job_details('', " + user_id + " ,'','select', 'info');", function (err, result) {
    //config.query("select * from cb_mig_sp_to_check_dup_values_for_dest('" + host + "','" + migration_type + "'," + user_id + " ,'select');", function (err, result) {
    //  config.query("select * from sp_get_complete_migration_job_details(17,'Running','select');", function (err, result) {
    config.query("select * from cb_mig_sp_to_check_dup_values_of_migration_name('" + migration_name + "','" + migration_type + "'," + user_id + " ,'select');", function (err, result) {
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
exports.toCheckExistMigrationInDest = toCheckExistMigrationInDest;

function s2c_input_details(req, res, next) {
    var user_id = null;
    var group_id = null;
    var tenant = null;
    var cloud_name = null;
    var account_name = null;
    var input_details = null;
    var migration_type = null;
    var query_type = null

    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.group_id) {
        group_id = parseInt(req.query.group_id);
    }
    // if (req.query.tenant) {
    //     tenant = req.query.tenant;
    // }
    if (req.query.cloud_name) {
        cloud_name = req.query.cloud_name;
    }
    if (req.query.account_name) {
        account_name = req.query.account_name;
    }
    if (req.query.input_details) {
        input_details = req.query.input_details;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.query_type) {
        query_type = req.query.query_type;
    }
    config.query("select * from cb_mig_sp_migration_details_s2c(" + user_id + " ," + group_id + ",'" + cloud_name + "' ,'" + account_name + "' ,'" + input_details + "','" + migration_type + "','" + query_type + "', 'info');", function (err, result) {
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
exports.s2c_input_details = s2c_input_details;

function migrationSrcIp_s2c(req, res, next) {
    var user_id = null;
    var group_id = null;
    // var tenant = null;
    var cloud_name = null;
    var migration_type = null;
    var account_name = null;
    var query_type = null
    var cipher = null;
    var cipher_cred = null;
    var crypted = null;
    var crypted_cred = null;

    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.group_id) {
        group_id = parseInt(req.query.group_id);
    }
    // if (req.query.tenant) {
    //     tenant = req.query.tenant;
    // }
    if (req.query.cloud_name) {
        cloud_name = req.query.cloud_name;
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.query_type) {
        query_type = req.query.query_type;
    }
    if (req.query.account_name) {
        account_name = req.query.account_name;
    }

    config.query("select * from cb_mig_sp_get_src_ip_s2c(" + user_id + " ," + group_id + ",'" + cloud_name + "' ,'" + account_name + "' ,'" + migration_type + "','" + query_type + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            if (!(result.rows[0].cb_mig_sp_get_src_ip_s2c == null)) {
                // if (query_type == 'select_details') {
                //     if(result.rows[0].cb_mig_sp_get_src_ip_s2c[0].input_details['credentials_json'] != undefined){
                //         cipher_cred = crypto.createCipher(algorithm, password)
                //         crypted_cred = cipher_cred.update(JSON.stringify(result.rows[0].cb_mig_sp_get_src_ip_s2c[0].input_details['credentials_json']), 'utf8', 'hex')
                //         crypted_cred += cipher_cred.final('hex');
                //         result.rows[0].cb_mig_sp_get_src_ip_s2c[0].input_details['credentials_json'] = crypted_cred
                //     }
                //     cipher = crypto.createCipher(algorithm, password)
                //     crypted = cipher.update(result.rows[0].cb_mig_sp_get_src_ip_s2c[0].input_details.secret_key, 'utf8', 'hex')
                //     crypted += cipher.final('hex');
                //     result.rows[0].cb_mig_sp_get_src_ip_s2c[0].input_details.secret_key = crypted
                // }
            }

            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.migrationSrcIp_s2c = migrationSrcIp_s2c;

function get_migration_details_for_edit_and_delete(req, res, next) {
    var user_id = null;
    var migration_type = null;
    var host = null;
    var dbType = null
    var mode = null;
    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.host) {
        host = req.query.host;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("select * from cb_mig_sp_to_get_schedule_details_for_edit_and_delete(" + user_id + ",'" + migration_type + "','" + host + "','" + dbType + "','" + mode + "');", function (err, result) {
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
exports.get_migration_details_for_edit_and_delete = get_migration_details_for_edit_and_delete;

function migrationScheduledJobDetailsInfo(req, res, next) {
    var migration_type = req.body.id5;
    var migration_method = req.body.is_rsync
    if (migration_type == "C2C" && migration_method != "false") {
        migrationStudioControllerFile.getSSHKey(req, res, next, function (ssh_key, err) {
            if (!err) {
                console.log(ssh_key)
                var key = ssh_key[0].private_key.trim()
                var key_name = ssh_key[0].key_name
                var account_name = ssh_key[0].account_name
                migrationScheduledJobDetails(req, res, next, key, key_name, account_name, function (job_response, err) {
                    if (!err) {
                        console.log(job_response)
                        res.send(job_response)
                    }
                    else {
                        console.log(job_response)
                        res.send(job_response)
                    }
                })
            }
            else {
                res.send(ssh_key)
            }
        })
    }
    else {
        migrationScheduledJobDetails(req, res, next, null, null, null, function (job_response, err) {
            if (!err) {
                console.log(job_response)
                res.send(job_response)
            }
            else {
                console.log(job_response)
                res.send(job_response)
            }
        })
    }
}
exports.migrationScheduledJobDetailsInfo = migrationScheduledJobDetailsInfo;

function getDestinationAccountDetails(req, res, next) {
    var dest_host_id = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    var cipher = null;
    var crypted = null;

    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.dest_host) {
        dest_host_id = parseInt(req.query.dest_host);
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }
    config.query("select * from cb_migration_get_dest_account_details(" + user_id + "," + dest_host_id + ",'" + migration_type + "','" + dbType + "','select');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.send(err);
        }
    });
}
exports.getDestinationAccountDetails = getDestinationAccountDetails;

function getSourceAccountDetails(req, res, next) {
    var src_host_id = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    var cipher = null;
    var crypted = null;

    if (req.query.user_id != null) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.src_host) {
        src_host_id = parseInt(req.query.src_host);
    }
    if (req.query.migration_type) {
        migration_type = req.query.migration_type;
    }
    if (req.query.dbType) {
        dbType = req.query.dbType;
    }

    config.query("select * from cb_migration_get_source_account_details(" + user_id + "," + src_host_id + ",'" + migration_type + "','" + dbType + "' ,'select');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.send(err);
        }
    });
}
exports.getSourceAccountDetails = getSourceAccountDetails;