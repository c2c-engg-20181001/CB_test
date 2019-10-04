var config = require('../../config');
var request = require('request')
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';

//migration_ip_linux = "http://192.168.1.229/migration-studio/"
//migration_ip_windows= "http://192.168.1.111/migration-studio/"
//node_url="http://192.168.1.182:3001/api/v1/"
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var migration_ip_windows = file.windows_migration_url



          
//dashboard for start

// to add details of from in database
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
                if (!(result.rows[0].cb_dashboard_sp_get_user_details_for_notification == null)) {
                    query_result = result.rows[0].cb_dashboard_sp_get_user_details_for_notification[0];

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


function selectAddEditDeleteMigrationAccounts(req, res, next) {
    var account_id = null
    var user_id = null
    var group_id = null
    var migration_type = null
    var cloud_name = null
    var account_name = null
    var account_details = null

    var query_type = null

    var decipher = null
    var decipher_cred = null
    var dec = null
    var dec_cred = null
    var secret_key_changed_pass = null
    var cred_key_changed = null

    if (req.body.account_id) {
        account_id = parseInt(req.body.account_id);
    }
    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.group_id) {
        group_id = parseInt(req.body.group_id);
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name;
    }
    if (req.body.account_name) {
        account_name = req.body.account_name;
    }
    if (req.body.account_details) {
        account_details = req.body.account_details;
    }
    if (req.body.query_type) {
        query_type = req.body.query_type;
    }
    if (req.body.secret_key_changed_pass) {
        secret_key_changed_pass = req.body.secret_key_changed_pass;
    }
    if (req.body.cred_key_changed) {
        cred_key_changed = req.body.cred_key_changed;
    }

    if (secret_key_changed_pass === 'true') {
        account_details = JSON.parse(account_details);
        
         if (migration_type == "D2C") {
            cipher = crypto.createCipher(algorithm, password)
            crypted = cipher.update(account_details.password, 'utf8', 'hex')
            crypted += cipher.final('hex');
            account_details.password = crypted
        }
        account_details = JSON.stringify(account_details)
    }

   
        var query = "select * from cb_migration_add_edit_delete_accounts(" + account_id + " ," + user_id + " ," + group_id + ",'" + migration_type + "' ,'" + cloud_name + "' ,'" + account_name + "','" + account_details + "','" + query_type + "', 'info');"
    
    config.query(query, function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.selectAddEditDeleteMigrationAccounts = selectAddEditDeleteMigrationAccounts;

///to check if account already present
function checkAccountNameExists(req, res, next) {
    var account_name = null
    var user_id = null
    var group_id = null
    var migration_type = null

    if (req.body.migration_type != null) {
        migration_type = req.body.migration_type;
    }
    if (req.body.user_id != null) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.group_id != null) {
        group_id = parseInt(req.body.group_id);
    }
    if (req.body.account_name != null) {
        account_name = req.body.account_name;
    }

    config.query("select * from cb_migration_check_account_name_exists(" + user_id + "," + group_id + ",'" + migration_type + "','" + account_name + "');", function (err, result) {

        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(err);
            console.log('Error while performing Query.', err);
        }
    });
}
exports.checkAccountNameExists = checkAccountNameExists;

function validateD2CCredentials(req, res, next) {
    var data = null;
    var migrationType = null;
    var data_to_validate = null
    var secret_key_changed = null;
    var details = null
    var decipher = null;
    var dec = null;
    var token = null
    var getDatabaseListURL = null;

    try {

        token = req.body.token
        details = JSON.parse(req.body.detail)

        if (details.source != undefined) {
            migrationType = details.source
        }
        else if (details.destination != undefined) {
            migrationType = details.destination
        }

        secret_key_changed = req.body.secret_key_changed

        if (secret_key_changed == "false") {
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(details.password, 'hex', 'utf8')
            dec += decipher.final('utf8');
            details.password = dec
        }

        data_to_validate = {
            "host": details.host,
            "password": details.password,
            "port": parseInt(details.port),
            "ssl": details.SSL,
            "token": token,
            "databases": [],
            "username": details.username
        }

        if (migrationType.toLowerCase() == "mysql") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
        }
        else if (migrationType.toLowerCase() == "mssql") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
        }
        else if (migrationType.toLowerCase() == "postgresql") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
        }
        else if (migrationType.toLowerCase() == "oracle") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
        }
        else if (migrationType.toLowerCase() == "mongodb") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-databases")
        }

        var options = {
            method: 'POST',
            url: getDatabaseListURL,
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: data_to_validate,
            json: true
        };
        request(options, function (error, resp, body) {
            console.log(body)
            res.header("access-control-allow-origin", "*");
            if (body != undefined) {
                res.send(body)
            }
            else {
                res.send(error)
            }
        })
    }
    catch (e) {
        console.log(e)
        res.header("access-control-allow-origin", "*");
        res.send("Something went wrong")
    }

}
exports.validateD2CCredentials = validateD2CCredentials;

//get usergroup and userid
function getUserIdFromUsername(req, res, next) {
    res.header("access-control-allow-origin", "*");
    var userName = null;
    var userId = null;
    //response skeleton for the api
    response = {
        "status": "",
        "user_id": "",
        "group_id": "",
        "error": {
            "message": "",
            "code": 0
        }
    }
    //validation for the parameter is present or not
    if (!req.body.user_name) {
        response.status = "error";
        user_id = null;
        response.error.message = "user_name parameter is missing";
        res.send(response);
    }
    else {
       userName = req.body.user_name;
    }

    config.query("SELECT * FROM cb_mig_sp_get_user_id_from_username('" + userName + "');", function (err, result) {
        if (!err) {
            if (!(result.rows[0].cb_mig_sp_get_user_id_from_username == null)) {
                userId = result.rows[0].cb_mig_sp_get_user_id_from_username[0].user_id;
                groupId = result.rows[0].cb_mig_sp_get_user_id_from_username[0].group_id;
                response.status = "successful";
                response.user_id = userId;
                response.group_id = groupId;
                res.send(response);
            }
            else {
                response.user_id = '';
                response.status = "error";
                response.error.message = "No data is avaialable";
                res.send(response);
            }
        }
        else {
            response.status = "error";
            response.error.message = "Error while executing stored procedure. " + err;
            res.send(response);
        }
    });

}
exports.getUserIdFromUsername = getUserIdFromUsername;

// To validate details of storage form
function listS2CBuckets(req, res, next) {
    var cloud_name = null;
    var data = null;
    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name
    }

    data = JSON.parse(req.body.data)

    var decipher = null;
    var dec = null;

    if (!data.editSecret) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.source_cloud.secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.source_cloud.secret_key = dec
    }

    if (cloud_name == 'CEPH') {
        migrationUrl = "s2c-migration/ceph-list-bucket";
    }
    else if (cloud_name == 'Azure') {
        migrationUrl = "s2c-migration/azure-list-bucket";
    }
    else if (cloud_name == 'AWS') {
        migrationUrl = "s2c-migration/aws-list-bucket";
    }
    else if (cloud_name == 'Google') {
        migrationUrl = "s2c-migration/gcp-list-bucket-details";
    }
    else if (cloud_name == 'IBM') {
        migrationUrl = "s2c-migration/ibm-list-bucket-details";
    }
    else if (cloud_name == 'Alibaba') {
        migrationUrl = "s2c-migration/alibaba-list-bucket";
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + migrationUrl,
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
            if (body.list != undefined) {
                bucketList = body
                res.send(bucketList)
            }
            else if (body.error != undefined) {
                res.send(body)
            }
            else {
                res.send(body)
            }
        }
        else {
            res.send(body)
        }
    })
}
exports.listS2CBuckets = listS2CBuckets;

//GET REGIONS FOR CLOUD IN Storage Form

function getCloudRegionMapping(req, res, next) {
    var cloud_name = null;

    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name;
    }
    config.query("select * from cb_mig_sp_get_cloud_regions('" + cloud_name + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
    });
}
exports.getCloudRegionMapping = getCloudRegionMapping;

//dashboard form for database and storage  end

