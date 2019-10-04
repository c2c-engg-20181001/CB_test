var config = require('../../config');
var request = require('request');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var migration_ip_windows = file.windows_migration_url


// var migration_ip_linux = "http://192.168.1.229/migration-studio/" 
// var migration_ip_windows = "http://192.168.1.111/migration-studio/" 

function GetV2VAccountList(req, res, next) {
    var user_id = null;
    var group_id = null;
    var user_group = null;
    var virtualization_type = null;
    var migration_type = null;
    var account_name = null;
    var query_type = null
    var cipher = null;
    var crypted = null;

    if (req.query.user_id) {
        user_id = parseInt(req.query.user_id);
    }
    if (req.query.group_id) {
        group_id = parseInt(req.query.group_id);
    }
    // if (req.query.user_group) {
    //     user_group = req.query.user_group;
    // }
    if (req.query.virtualization_type) {
        virtualization_type = req.query.virtualization_type;
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

    config.query("select * from cb_mig_sp_v2v_get_details(" + user_id + " ," + group_id + ",'" + virtualization_type + "' ,'" + account_name + "' ,'" + migration_type + "','" + query_type + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");

            // if (query_type == 'select_details' && result.rows[0].cb_mig_sp_v2v_get_details!=null) {
            //     cipher = crypto.createCipher(algorithm, password)
            //     crypted = cipher.update(result.rows[0].cb_mig_sp_v2v_get_details[0].input_details.password, 'utf8', 'hex')
            //     crypted += cipher.final('hex');
            //     result.rows[0].cb_mig_sp_v2v_get_details[0].input_details.password = crypted
            // }

            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.GetV2VAccountList = GetV2VAccountList;

function addV2VInputDetails(req, res, next) {
    var user_id = null;
    var group_id = null;
    var user_group = null;
    var virtualization_type = null;
    var account_name = null;
    var input_details = null;
    var migration_type = null;
    var query_type = null
    var decipher = null;
    var dec = null;
    var secret_key_changed = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.group_id) {
        group_id = parseInt(req.body.group_id);
    }
    // if (req.body.user_group) {
    //     user_group = req.body.user_group;
    // }
    if (req.body.virtualization_type) {
        virtualization_type = req.body.virtualization_type;
    }
    if (req.body.account_name) {
        account_name = req.body.account_name;
    }
    if (req.body.input_details) {
        input_details = req.body.input_details;
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.query_type) {
        query_type = req.body.query_type;
    }
    if (req.body.secret_key_changed) {
        secret_key_changed = req.body.secret_key_changed;
    }

    // if (secret_key_changed === 'false') {
    //     input_details = JSON.parse(input_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(input_details.password, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     input_details.password = dec
    //     input_details = JSON.stringify(input_details)
    // }

    if (secret_key_changed === 'true') {
        input_details = JSON.parse(input_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(input_details.password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        input_details.password = crypted
        input_details = JSON.stringify(input_details)
    }

    config.query("select * from cb_mig_sp_v2v_insert_delete_update_details(" + user_id + " ," + group_id + ",'" + virtualization_type + "' ,'" + account_name + "' ,'" + input_details + "','" + migration_type + "','" + query_type + "', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(err);
            //console.log('Error while performing Query.', err);
        }
    });
}
exports.addV2VInputDetails = addV2VInputDetails;

function listV2VVMs(req, res, next) {
    var source_platform = null;
    var request_data = null;
    if (req.body.virtualization_platform) {
        source_platform = req.body.virtualization_platform
    }

    request_data = JSON.parse(req.body.data)

    var decipher = null;
    var dec = null;

    if (source_platform.toLowerCase() == 'vmware') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(request_data.src_vmware_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        request_data.src_vmware_password = dec
        migrationUrl = migration_ip_linux + "v2c-migration/vmwareserver-vm-list-details/";
        // migrationUrl = migration_ip_linux + "v2c-migration/vmwareserver/vm-list_vm_details";
    }
    else if (source_platform.toLowerCase() == 'hyper-v') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(request_data.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        request_data.password = dec
        migrationUrl = migration_ip_windows + "v2v-migration/hyperv-list-vm";
        // migrationUrl = migration_ip_windows + "v2v-migration/hyperv/list-vm/";
    }
    console.log("request_data  ", request_data)
    var options = {
        method: 'POST',
        url: migrationUrl,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };

    request(options, function (error, resp, body) {
        res.header("access-control-allow-origin", "*");
        if (body != undefined) {
            console.log('body  ', body)
            res.send(body)
        }
        else {
            console.log('error  ', error)
            res.send(error)
        }
    })
}
exports.listV2VVMs = listV2VVMs;

function v2vMigration(req, res, next) {
    var source_details = null;
    var dest_details = null;
    var token = null;
    var source_platform = null;
    var destination_platform = null;

    var source = null;
    var destination = null;

    var action = null;

    if (req.body.src_flag != null || req.body.src_flag != undefined) {
        source_platform = req.body.src_flag
    }
    if (req.body.dest_flag != null || req.body.dest_flag != undefined) {
        destination_platform = req.body.dest_flag
    }

    if (req.body.source) {
        source_details = JSON.parse(req.body.source);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source_details['password'], 'hex', 'utf8')
        dec += decipher.final('utf8');
        source_details['password'] = dec
    }

    if (req.body.destination) {
        dest_details = JSON.parse(req.body.destination);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(dest_details['password'], 'hex', 'utf8')
        dec += decipher.final('utf8');
        dest_details['password'] = dec
    }
    if (req.body.token) {
        token = req.body.token;
    }

    if (source_platform.toLowerCase() == 'vmware' && destination_platform.toLowerCase() == 'hyper-v') {
        action = "vmware-to-hyperv"
        migration_url = migration_ip_windows + "v2v-migration/vmware-to-hyperv"
    }
    else if (source_platform.toLowerCase() == 'hyper-v' && destination_platform.toLowerCase() == 'vmware') {
        action = "hyperv-to-vmware"
        migration_url = migration_ip_windows + "v2v-migration/hyperv-to-vmware"
        source_details['vm_name'] = source_details['vmname']
    }

    var data = {
        "action": action,
        "source": source_details,
        "destination": dest_details,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    })

}
exports.v2vMigration = v2vMigration;

function ValidateV2VCredentials(req, res, next) {
    var source_platform = null;
    var request_data = null;
    if (req.body.virtualization_platform) {
        source_platform = req.body.virtualization_platform
    }

    request_data = JSON.parse(req.body.input_details)

    var decipher = null;
    var dec = null;

    if (req.body.secret_key_changed == "false") {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(request_data.src_vmware_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        request_data.src_vmware_password = dec
    }

    var data = {
        "host": request_data.src_vmware_ip_address,
        "username": request_data.src_vmware_username,
        "password": request_data.src_vmware_password,
        "token": req.body.token
    }

    if (source_platform.toLowerCase() == 'vmware') {
        migrationUrl = migration_ip_windows + "v2v-migration/vmware-auth";
    }
    else if (source_platform.toLowerCase() == 'hyper-v') {
        migrationUrl = migration_ip_windows + "v2v-migration/hyperv-auth";
    }

    var options = {
        method: 'POST',
        url: migrationUrl,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        res.header("access-control-allow-origin", "*");
        if (body != undefined) {
            res.send(body)
        }
        else {
            res.send(error)
        }
    })
}
exports.ValidateV2VCredentials = ValidateV2VCredentials;