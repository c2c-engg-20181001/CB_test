var config = require('../../config');
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var migration_ip_windows = file.windows_migration_url
var opensds_ip = file.opensds_url
var request = require('request')
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';

// var migration_ip_linux = "http://192.168.1.229/migration-studio/"
// var migration_ip_windows = "http://192.168.1.111/migration-studio/"
// var opensds_ip = "http://192.168.3.112:8089/v1/adminTenantId/"


//response skeleton for the api
var response = {
    "status": "",
    "token": "",
    "error": {
        "message": "",
        "code": 0
    }
}


function user_login_logs(req, res, next) {
    username = req.body.username;
    user_password = req.body.user_password;
    request_ip = req.body.request_ip;
    request_region = req.body.request_region;
    config.query("select * from cb_mig_update_login_logs(" + "'" + username + "','" + user_password + "','" + request_ip + "','" + request_region + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.user_login_logs = user_login_logs;

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
        console.log("s2c_response", body)
        if (body != undefined) {
            res.send(body)
        }
        else {
            res.send(error)
        }
    })
}
exports.listS2CBuckets = listS2CBuckets;

function createS2CBucket(req, res, next) {
    var cloud_name = null;
    var data = null;
    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name
    }

    data = JSON.parse(req.body.data)

    var decipher = null;
    var dec = null;

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.source_cloud.secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.source_cloud.secret_key = dec

    if (cloud_name == 'CEPH') {
        migrationUrl = "s2c-migration/ceph-create-bucket";
    }
    else if (cloud_name == 'Azure') {
        migrationUrl = "s2c-migration/azure-create-bucket";
    }
    else if (cloud_name == 'AWS') {
        migrationUrl = "s2c-migration/aws-create-bucket";
    }
    else if (cloud_name == 'Google') {
        migrationUrl = "s2c-migration/gcp-create-bucket";
    }
    else if (cloud_name == 'IBM') {
        migrationUrl = "s2c-migration/ibm-create-bucket";
    }
    else if (cloud_name == 'Alibaba') {
        migrationUrl = "s2c-migration/alibaba-create-bucket";
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
            res.send(body)
        }
        else {
            res.send(error)
        }
    })
}
exports.createS2CBucket = createS2CBucket;

function startS2CMigration(req, res, next) {
    var s2c_migration_url = 's2c-migration/opensds-object-migration'

    data = JSON.parse(req.body.data)

    var decipher = null;
    var dec = null;

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.source_cloud.security, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.source_cloud.security = dec

    var decipher = null;
    var dec = null;

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.destination_cloud.security, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.destination_cloud.security = dec

    console.log("----data------", data)

    var options = {
        method: 'POST',
        url: migration_ip_linux + s2c_migration_url,
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
            // if (body.job_id != undefined) {
            //     job_id = body
            //     res.send(job_id)
            //     // callback(job_id, false)
            // }
            // else if (body.error != undefined) {
            //     res.send(body)
            //     // callback(body, true)
            // }
            // else {
            //     res.send(body)
            //     // callback(body, true)
            // }
            res.send(body)
        }
        else {
            res.send(error)
            // callback(body, true)
        }
    })
}
exports.startS2CMigration = startS2CMigration;


function getToken(req, res, next, callback) {
    //getting the details of the user whose id received by the api 
    config.query("select * from cb_mig_sp_get_user_details_for_notification(" + req.body.user_id + ",'select');", function (err, result) {
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
                    if (body != undefined) {
                        if (body.token != undefined) {
                            token = body.token;
                            if (token != undefined && Object.keys("token").length != 0) {
                                response.status = "successful";
                                response.token = token;
                                callback(response, false)
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
                                callback(response, true)
                            }
                        }
                        else {
                            callback(body, true)
                        }
                    }
                    else {
                        callback(error, true)
                    }
                });
            }
            else {
                response.status = "error";
                response.error.message = "product_id is invalid";
                callback(response, true);
            }
        }
        else {
            response.status = "error";
            response.error.message = "Error while executing stored procedure. " + err;
            callback(response, true);
        }
    });
}
exports.getToken = getToken;

function addS2CInputDetails(req, res, next) {
    var user_id = null;
    var group_id = null;
    var cloud_name = null;
    var account_name = null;
    var input_details = null;
    var migration_type = null;
    var query_type = null
    var decipher = null;
    var decipher_cred = null;
    var dec = null;
    var dec_cred = null;
    var secret_key_changed = null;
    var cred_key_changed = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.group_id) {
        group_id = parseInt(req.body.group_id);
    }
    // if (req.body.tenant) {
    //     tenant = req.body.tenant;
    // }
    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name;
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
    if (req.body.cred_key_changed) {
        cred_key_changed = req.body.cred_key_changed;
    }

    // if (secret_key_changed === 'false') {
    //     input_details = JSON.parse(input_details);
    //     decipher_cred = crypto.createDecipher(algorithm, password)
    //     dec_cred = decipher_cred.update(input_details.secret_key, 'hex', 'utf8')
    //     dec_cred += decipher_cred.final('utf8');
    //     input_details.secret_key = dec_cred
    //     input_details = JSON.stringify(input_details)
    // }

    if (secret_key_changed === 'true') {
        input_details = JSON.parse(input_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(input_details.secret_key, 'utf8', 'hex')
        crypted += cipher.final('hex');
        input_details.secret_key = crypted
        input_details = JSON.stringify(input_details)
    }

    config.query("select * from cb_mig_sp_migration_details_s2c(" + user_id + " ," + group_id + ",'" + cloud_name + "' ,'" + account_name + "' ,'" + input_details + "','" + migration_type + "','" + query_type + "', 'info');", function (err, result) {
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
exports.addS2CInputDetails = addS2CInputDetails;

function listD2CDatabases(req, res, next) {

    var data = null;
    var migrationType = null;
    var getDatabaseListURL = null;

    // if (req.body.mode == 'src_select') {
    //     data = {
    //         "host": details.src_details.host,
    //         "port": parseInt(details.src_details.port),
    //         "username": details.src_details.username,
    //         "password": details.src_details.password,
    //         "ssl": details.src_details.SSL,
    //         "token": token
    //     };
    //     migrationType = details.src_details.source;
    // }
    // else if (req.body.mode == 'dest_select') {
    //     data = {
    //         "host": details.dest_details.host,
    //         "port": parseInt(details.dest_details.port),
    //         "username": details.dest_details.username,
    //         "password": details.dest_details.password,
    //         "ssl": details.dest_details.SSL,
    //         "token": token
    //     };
    //     migrationType = details.dest_details.destination;
    // }

    data = JSON.parse(req.body.data)
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.password = dec

    data = {
        "host": data.host,
        "port": parseInt(data.port),
        "username": data.username,
        "password": data.password,
        "ssl": data.ssl,
        "databases": [],
        "token": data.token
    };
    migrationType = req.body.dbType;

    if (req.body.mode == 'src_select') {

        // migrationType = req.body.dbType;
        if (migrationType == "MySQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-database-objects")
        }
        else if (migrationType == "MSSQL") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-database-object")
        }
        else if (migrationType == "PostgreSQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-database-objects")
        }
        else if (migrationType == "ORACLE") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
        }
        else if (migrationType == "MongoDB") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-database-objects")
        }
    }
    else if (req.body.mode == 'dest_select') {
        // data = {
        //     "host": data.host,
        //     "port": parseInt(details.dest_details.port),
        //     "username": details.dest_details.username,
        //     "password": details.dest_details.password,
        //     "ssl": details.dest_details.SSL,
        //     "databases": [],
        //     "token": token
        // };
        // migrationType = details.dest_details.destination;
        if (migrationType == "MySQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
        }
        else if (migrationType == "MSSQL") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
        }
        else if (migrationType == "PostgreSQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
        }
        else if (migrationType == "ORACLE") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
        }
        else if (migrationType == "MongoDB") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-database-objects")
        }
    }


    // var getDatabaseListURL = null;
    // if (migrationType == "MySQL") {
    //     getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
    // } else if (migrationType == "MSSQL") {
    //     getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
    // } else if (migrationType == "PostgreSQL") {
    //     getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
    // }

    var options = {
        method: 'POST',
        url: getDatabaseListURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        console.log(body)
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
exports.listD2CDatabases = listD2CDatabases;

function getD2CDetails(req, res, next, type, callback) {
    var dest_host = null;
    var src_host = null;
    var user_id = null;
    var migration_type = null;
    var dbType = null;
    var mode = null;

    if (req.body.user_id != null) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.dest_host) {
        dest_host = req.body.dest_host;
    }
    if (req.body.src_host) {
        src_host = req.body.src_host;
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.dbType) {
        dbType = req.body.dbType;
    }
    if (req.body.mode == 'src_select') {
        mode = 'source'
    }
    if (req.body.mode == 'dest_select') {
        mode = 'destination'
    }
    if (type == 'source') {
        mode = 'source'
    }
    if (type == 'destination') {
        mode = 'destination'
    }

    res.header("access-control-allow-origin", "*");
    if (mode === 'destination') {
        config.query("select * from cb_mig_sp_get_dest_ip_details(" + user_id + ",'" + dest_host + "','" + migration_type + "','" + dbType + "','d2c_select');", function (err, result) {
            if (!err) {
                console.log(result);

                var decipher = null;
                var dec = null;
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(result.rows[0].cb_mig_sp_get_dest_ip_details[0].dest_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                result.rows[0].cb_mig_sp_get_dest_ip_details[0].dest_details.password = dec

                callback(result.rows[0].cb_mig_sp_get_dest_ip_details[0], false)
            }
            else {
                console.log('Error while performing Query.', err);
                callback(err, true)
            }
        });
    }
    else if (mode === 'source') {
        config.query("select * from cb_mig_sp_get_sHost_details(" + user_id + ",'" + src_host + "','" + migration_type + "','" + dbType + "' ,'d2c_select');", function (err, result) {
            if (!err) {
                console.log(result);

                var decipher = null;
                var dec = null;
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                result.rows[0].cb_mig_sp_get_shost_details[0].src_details.password = dec

                callback(result.rows[0].cb_mig_sp_get_shost_details[0], false)
            }
            else {
                console.log('Error while performing Query.', err);
                callback(err, true)
            }
        });

    }
}
exports.getD2CDetails = getD2CDetails;

function getD2CDatabaseList(req, res, next, details, token, callback) {
    var data = null;
    var migrationType = null;
    if (req.body.mode == 'src_select') {
        migrationType = details.src_details.source;

        if (migrationType == "ORACLE") {
            data = {
                "username": details.src_details.username,
                "password": details.src_details.password,
                "host": details.src_details.host,
                "token": token
            }
        }
        else {
            data = {
                "host": details.src_details.host,
                "port": parseInt(details.src_details.port),
                "username": details.src_details.username,
                "password": details.src_details.password,
                "ssl": details.src_details.SSL,
                "token": token
            };
        }
        console.log("src_select", data)

        // migrationType = details.src_details.source;
    }
    else if (req.body.mode == 'dest_select') {
        migrationType = details.dest_details.destination;
        if (migrationType == "ORACLE") {
            data = {
                "username": details.dest_details.username,
                "password": details.dest_details.password,
                "host": details.dest_details.host,
                "token": token
            }
        }
        else {
            data = {
                "host": details.dest_details.host,
                "port": parseInt(details.dest_details.port),
                "username": details.dest_details.username,
                "password": details.dest_details.password,
                "ssl": details.dest_details.SSL,
                "token": token
            };
        }

        console.log("dest_select", data)

    }


    var getDatabaseListURL = null;
    if (migrationType == "MySQL") {
        getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
    } else if (migrationType == "MSSQL") {
        getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
    } else if (migrationType == "PostgreSQL") {
        getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
    }
    else if (migrationType == "ORACLE") {
        getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
    }
    else if (migrationType == "MongoDB") {
        getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-databases")
    }

    var options = {
        method: 'POST',
        url: getDatabaseListURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.getD2CDatabaseList = getD2CDatabaseList;

function migrationHostNames(req, res, next) {
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
    config.query("SELECT * FROM cb_mig_sp_get_details_d2c_v2c(" + user_id + ",'" + migration_type + "' ,'" + dbType + "','" + mode + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.migrationHostNames = migrationHostNames;

function startD2CMigration(req, res, next) {
    var job_id = null
    // var src_ssl = null
    // var src_username = null
    // var src_password = null
    // var src_port = null
    // var src_host = null
    // var dest_ssl = null
    // var dest_port = null
    // var dest_host = null
    // var dest_password = null;
    // var dest_username = null
    // var dest_overwrite = null;
    var selected_database_list = null;
    var database_type = null;
    var D2CmigrationURL = null;
    // var src_service_id = null;
    var src_data = null
    var dest_data = null

    if (req.body.dbType) {
        database_type = req.body.dbType;
    }

    src_data = JSON.parse(req.body.src_data)
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(src_data.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    src_data.password = dec

    dest_data = JSON.parse(req.body.dest_data)
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(dest_data.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    dest_data.password = dec

    // src_ssl = source_details.src_details.SSL;

    // if (source_details.src_details.host) {
    //     src_host = source_details.src_details.host;
    // }
    // if (source_details.src_details.service_id) {
    //     src_service_id = source_details.src_details.service_id;
    // }
    // if (source_details.src_details.port) {
    //     src_port = parseInt(source_details.src_details.port);
    // }
    // if (source_details.src_details.password) {
    //     src_password = source_details.src_details.password;
    // }
    // if (source_details.src_details.username) {
    //     src_username = source_details.src_details.username;
    // }
    // if (req.body.database_list) {
    //     selected_database_list = req.body.database_list;
    //     selected_database_list = selected_database_list.split(',');
    // }


    // dest_ssl = destination_details.dest_details.SSL;

    // if (destination_details.dest_details.host) {
    //     dest_host = destination_details.dest_details.host;
    // }
    // if (destination_details.dest_details.port) {
    //     dest_port = parseInt(destination_details.dest_details.port);
    // }
    // if (destination_details.dest_details.password) {
    //     dest_password = destination_details.dest_details.password;
    // }
    // if (destination_details.dest_details.username) {
    //     dest_username = destination_details.dest_details.username;
    // }
    // dest_overwrite = destination_details.dest_details.overwrite;

    var data = {
        "source": {
            "host": src_data.host,
            "password": src_data.password,
            "port": parseInt(src_data.port),
            "username": src_data.username,
            "ssl": src_data.ssl,
            "service_id": src_data.service_id,
        },
        "destination": {
            "overwrite": dest_data.overwrite,
            "host": dest_data.host,
            "password": dest_data.password,
            "port": parseInt(dest_data.port),
            "username": dest_data.username,
            "ssl": dest_data.ssl
        },
        "token": token
    }

    console.log("data", data)

    if (database_type == "ORACLE") {
        data['source']['schemas'] = src_data.databases
    }
    else {
        data['source']['databases'] = src_data.databases
    }

    if (database_type == "MySQL") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/mysql/migration")
    } else if (database_type == "MSSQL") {
        D2CmigrationURL = (migration_ip_windows + "d2c-migration/mssql/migration")
    } else if (database_type == "PostgreSQL") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/postgresql/migration")
    } else if (database_type == "ORACLE") {
        D2CmigrationURL = (migration_ip_windows + "d2c-migration/oracle/migration")
    }
    else if (database_type == "MongoDB") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/mongodb/migration")
    }

    var options = {
        method: 'POST',
        url: D2CmigrationURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            // if (body.job_id != undefined) {
            //     job_id = body
            //     // callback(job_id, false)
            //     res.send(job_id)
            // }
            // else if (body.error != undefined) {
            //     callback(body, true)
            // }
            // else {
            //     callback(body, true)
            // }
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    })
}
exports.startD2CMigration = startD2CMigration;

// function startD2CMigration(req, res, next) {
//     getD2CDetails(req, res, next, 'source', function (source_details, err) {
//         if (!err) {
//             console.log(source_details)
//             getD2CDetails(req, res, next, 'destination', function (destination_details, err) {
//                 if (!err) {
//                     console.log(destination_details)
//                     getToken(req, res, next, function (body, err) {
//                         if (!err) {
//                             console.log(body.token)
//                             D2CMigrationAPICall(req, res, next, source_details, destination_details, body.token, function (response, err) {
//                                 if (!err) {
//                                     console.log(response)
//                                     res.send(response)
//                                 }
//                                 else {
//                                     console.log(response)
//                                     res.send(response)
//                                 }
//                             })
//                         }
//                         else {
//                             res.send(body)
//                         }
//                     })
//                 }
//                 else {
//                     console.log(destination_details)
//                 }
//             })
//         }
//         else {
//             console.log(source_details)
//         }
//     })
// }
// exports.startD2CMigration = startD2CMigration;

function D2CMigrationAPICall(req, res, next, source_details, destination_details, token, callback) {
    var job_id = null
    var src_ssl = null
    var src_username = null
    var src_password = null
    var src_port = null
    var src_host = null
    var dest_ssl = null
    var dest_port = null
    var dest_host = null
    var dest_password = null;
    var dest_username = null
    var dest_overwrite = null;
    var selected_database_list = null;
    var database_type = null;
    var D2CmigrationURL = null;
    var src_service_id = null;

    if (req.body.dbType) {
        database_type = req.body.dbType;
    }

    src_ssl = source_details.src_details.SSL;

    if (source_details.src_details.host) {
        src_host = source_details.src_details.host;
    }
    if (source_details.src_details.service_id) {
        src_service_id = source_details.src_details.service_id;
    }
    if (source_details.src_details.port) {
        src_port = parseInt(source_details.src_details.port);
    }
    if (source_details.src_details.password) {
        src_password = source_details.src_details.password;
    }
    if (source_details.src_details.username) {
        src_username = source_details.src_details.username;
    }
    if (req.body.database_list) {
        selected_database_list = req.body.database_list;
        selected_database_list = selected_database_list.split(',');
    }


    dest_ssl = destination_details.dest_details.SSL;

    if (destination_details.dest_details.host) {
        dest_host = destination_details.dest_details.host;
    }
    if (destination_details.dest_details.port) {
        dest_port = parseInt(destination_details.dest_details.port);
    }
    if (destination_details.dest_details.password) {
        dest_password = destination_details.dest_details.password;
    }
    if (destination_details.dest_details.username) {
        dest_username = destination_details.dest_details.username;
    }
    dest_overwrite = destination_details.dest_details.overwrite;

    var data = {
        "source": {
            "host": src_host,
            "password": src_password,
            "port": src_port,
            "username": src_username,
            "ssl": src_ssl,
            "service_id": src_service_id,
        },
        "destination": {
            "overwrite": dest_overwrite,
            "host": dest_host,
            "password": dest_password,
            "port": dest_port,
            "username": dest_username,
            "ssl": dest_ssl
        },
        "token": token
    }

    console.log("data", data)

    if (database_type == "ORACLE") {
        data['source']['schemas'] = selected_database_list
    }
    else {
        data['source']['databases'] = selected_database_list
    }

    if (database_type == "MySQL") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/mysql/migration")
    } else if (database_type == "MSSQL") {
        D2CmigrationURL = (migration_ip_windows + "d2c-migration/mssql/migration")
    } else if (database_type == "PostgreSQL") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/postgresql/migration")
    } else if (database_type == "ORACLE") {
        D2CmigrationURL = (migration_ip_windows + "d2c-migration/oracle/migration")
    }
    else if (database_type == "MongoDB") {
        D2CmigrationURL = (migration_ip_linux + "d2c-migration/mongodb/migration")
    }

    var options = {
        method: 'POST',
        url: D2CmigrationURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            // if (body.job_id != undefined) {
            //     job_id = body
            //     callback(job_id, false)
            // }
            // else if (body.error != undefined) {
            //     callback(body, true)
            // }
            // else {
            //     callback(body, true)
            // }
            callback(body, true)
        }
        else {
            callback(error, true)
        }
    })

}
exports.D2CMigrationAPICall = D2CMigrationAPICall;

function addMigrationSrcDetails(req, res, next) {
    var user_id = null;
    var source_details;
    var migration_type = null;
    var ip_add = null;
    var migra_name = null;
    var mode = null;
    var secret_key_changed = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }

    if (req.body.src_detail) {
        source_details = req.body.src_detail;
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.ip_add) {
        ip_add = req.body.ip_add;
    }
    if (req.body.migration_name) {
        migra_name = req.body.migration_name;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.secret_key_changed) {
        secret_key_changed = req.body.secret_key_changed;
    }

    // if (migration_type === 'D2C' && secret_key_changed === 'false') {
    //     source_details = JSON.parse(source_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(source_details.password, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     source_details.password = dec
    //     source_details = JSON.stringify(source_details)
    // }

    if (migration_type === 'D2C' && secret_key_changed === 'true') {
        source_details = JSON.parse(source_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(source_details.password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        source_details.password = crypted
        source_details = JSON.stringify(source_details)
    }

    // if (migration_type === 'P2C' && secret_key_changed === 'false' && migra_name == 'Packet') {
    //     source_details = JSON.parse(source_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(source_details.auth_token, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     source_details.auth_token = dec
    //     source_details = JSON.stringify(source_details)
    // }
    // else if (migration_type === 'P2C' && secret_key_changed === 'false' && migra_name == 'OnPremise') {
    //     source_details = JSON.parse(source_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(source_details.password_ssh, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     source_details.password_ssh = dec
    //     source_details = JSON.stringify(source_details)
    // }

    if (migration_type === 'P2C' && secret_key_changed === 'true' && migra_name == 'Packet') {
        source_details = JSON.parse(source_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(source_details.auth_token, 'utf8', 'hex')
        crypted += cipher.final('hex');
        source_details.auth_token = crypted
        source_details = JSON.stringify(source_details)
    }
    else if (migration_type === 'P2C' && secret_key_changed === 'true' && migra_name == 'Baremetal') {
        // else if (migration_type === 'P2C' && secret_key_changed === 'true' && migra_name == 'OnPremise') {
        source_details = JSON.parse(source_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(source_details.password_ssh, 'utf8', 'hex')
        crypted += cipher.final('hex');
        source_details.password_ssh = crypted
        source_details = JSON.stringify(source_details)
    }

    if (migration_type == 'D2C' || migration_type == 'V2C' || migration_type == 'P2C') {
        if (mode == 'delete') {
            mode = 'd2c_delete'
        }
    }

    config.query("select * from cb_mig_sp_to_get_migration_src_details(" + user_id + " ,'" + migration_type + "','" + source_details + "' ,'" + migra_name + "' ,'" + ip_add + "', '" + mode + "', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.addMigrationSrcDetails = addMigrationSrcDetails;

function addMigrationDestDetails(req, res, next) {
    var user_id = null;
    var dest_details;
    var migration_type = null;
    var dest_host = null;
    var migra_name = null;
    var mode = null;
    var secret_key_changed = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.dest_detail) {
        dest_details = req.body.dest_detail;
    }
    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }
    if (req.body.migration_name) {
        migra_name = req.body.migration_name;
    }
    if (req.body.dest_host) {
        dest_host = req.body.dest_host;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.secret_key_changed) {
        secret_key_changed = req.body.secret_key_changed;
    }

    // if (migration_type === 'D2C' && secret_key_changed === 'false') {
    //     dest_details = JSON.parse(dest_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(dest_details.password, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     dest_details.password = dec
    //     dest_details = JSON.stringify(dest_details)
    // }

    if (migration_type === 'D2C' && secret_key_changed === 'true') {
        dest_details = JSON.parse(dest_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(dest_details.password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        dest_details.password = crypted
        dest_details = JSON.stringify(dest_details)
    }

    if (migration_type === 'C2C' && secret_key_changed === 'false') {
        dest_details = JSON.parse(dest_details);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(dest_details.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        dest_details.dest_secret_key = dec
        dest_details = JSON.stringify(dest_details)
    }

    if (migration_type == 'D2C' || migration_type == 'V2C') {
        if (mode == 'delete') {
            mode = 'd2c_delete'
        }
    }

    config.query("select * from cb_mig_sp_to_get_migration_dest_details(" + user_id + ",'" + migration_type + "','" + dest_details + "','" + migra_name + "','" + dest_host + "','" + mode + "','info');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.addMigrationDestDetails = addMigrationDestDetails;

function listV2CVMs(req, res, next) {
    var data = null;
    var virtualization_platform_name = null;
    var user_id = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.virtualization_platform_name) {
        virtualization_platform_name = req.body.virtualization_platform_name;
    }
    if (req.body.src_host) {
        data = req.body.src_host;
    }

    data = JSON.parse(data);
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.password = dec
    // data = JSON.stringify(data)

    if (virtualization_platform_name == 'XenServer') {
        // listURL = migration_ip_linux + "v2c-migration/xenserver/vm-list";
        listURL = migration_ip_linux + "v2c-migration/xenserver-vm-list/";
    }
    else if (virtualization_platform_name == 'KVM') {
        // listURL = migration_ip_linux + "v2c-migration/kvm/vm-list";
        listURL = migration_ip_linux + "v2c-migration/kvm-vm-list/";
    }
    else if (virtualization_platform_name == 'VMWare') {
        data = {
            "src_vmware_ip_address": data.host,
            "src_vmware_username": data.username,
            "src_vmware_password": data.password,
            "token": data.token
        }

        // listURL = migration_ip_linux + "v2c-migration/vmwareserver/vm-list_vm_details";
        listURL = migration_ip_linux + "v2c-migration/vmwareserver-vm-list-details/";
    }
    else if (virtualization_platform_name == 'Hyper-V') {
        data = {
            "hyperv_host": data.host,
            "hyperv_username": data.username,
            "hyperv_password": data.password,
            "token": data.token
        }
        listURL = migration_ip_windows + "v2v-migration/hyper-v/vm-list/";
        // listURL = migration_ip_windows + "v2v-migration/hyperv-list-vm/";
    }

    var options = {
        method: 'POST',
        url: listURL,
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
            //callback(body, false)            
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })

}
exports.listV2CVMs = listV2CVMs;

function createNetwork(req, res, next) {
    var dest_access_key = null;
    var dest_secret_key = null;
    var dest_region = null;
    var zone_id = null;
    var data = JSON.parse(req.body.data)

    if (data.dest_access_key) {
        dest_access_key = data.dest_access_key;
    }
    if (data.dest_secret_key) {
        dest_secret_key = data.dest_secret_key;
    }
    if (data.dest_region) {
        dest_region = data.dest_region;
    }
    if (data.zone_id) {
        zone_id = data.zone_id;
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(dest_secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    dest_secret_key = dec

    var data = {
        "dest_access_key": dest_access_key,
        "dest_secret_key": dest_secret_key,
        "dest_region": dest_region,
        "zone_id": zone_id
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/alibaba-create-network-new/",
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
exports.createNetwork = createNetwork;

function getGcpData(req, res, next) {
    getSSHKey(req, res, next, function (ssh_key, err) {
        // if (!err) {
        if (ssh_key.length > 0 && ssh_key != "Please map ssh key to this vm") {
            var key = ssh_key[0].private_key.trim()
        }
        else {
            var key = null
        }
        // console.log(ssh_key)
        // var key = ssh_key[0].private_key.trim()
        GCPInstanceInfoAPICall(req, res, next, key, function (job_response, err) {
            if (!err) {
                console.log(job_response)
                res.header("access-control-allow-origin", "*");
                res.send(job_response)
            }
            else {
                console.log(job_response)
                res.header("access-control-allow-origin", "*");
                res.send(job_response)
            }
        })
        // }
        // else {
        //     res.send(ssh_key)
        // }
    })
}
exports.getGcpData = getGcpData;

function GCPInstanceInfoAPICall(req, res, next, key, callback) {

    var data = null;
    var token = null;
    var zone = null;
    var request_data = null;
    var instance_name = null;
    var SSHKeyList = []

    if (req.body.token) {
        token = req.body.token;
    }
    if (req.body.data) {
        data = req.body.data;
    }
    if (req.body.zone) {
        zone = req.body.zone;
    }
    if (req.body.instance_name) {
        instance_name = req.body.instance_name;
    }

    data = data.split(",")
    SSHKeyList.push(key)

    for (var i = 0; i < data.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data[i] = dec
        data[i] = JSON.parse(data[i]);
        data[i].service_account_json = JSON.parse(data[i].service_account_json)
    }


    request_data = {
        "instance_name": instance_name,
        "zone": zone,
        "token": token,
        "credentials": data[0].service_account_json,
        "ssh_key": SSHKeyList
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/gcp-instance-info/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            // res.header("access-control-allow-origin", "*");
            // res.send(body)
            callback(body, false)
        }
        else {
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
            callback(error, true)
        }
    })

}
exports.GCPInstanceInfoAPICall = GCPInstanceInfoAPICall;

function AWSInstanceInfo(req, res, next) {
    getSSHKey(req, res, next, function (ssh_key, err) {
        if (!err) {
            console.log(ssh_key)
            var key = ssh_key[0].private_key.trim()
            AWSInstanceInfoAPICall(req, res, next, key, function (job_response, err) {
                if (!err) {
                    res.header("access-control-allow-origin", "*");
                    console.log(job_response)
                    res.send(job_response)
                }
                else {
                    res.header("access-control-allow-origin", "*");
                    console.log(job_response)
                    res.send(job_response)
                }
            })
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(ssh_key)
        }
    })
}
exports.AWSInstanceInfo = AWSInstanceInfo;

function AWSInstanceInfoAPICall(req, res, next, key, callback) {

    var data = null;
    var token = null;
    var region_id = null;
    var request_data = null;
    var instance_id = null;
    // var SSHKeyList = [];

    if (req.body.token) {
        token = req.body.token;
    }
    if (req.body.data) {
        data = req.body.data;
    }
    if (req.body.zone) {
        region_id = req.body.zone;
    }
    if (req.body.instance_id) {
        instance_id = req.body.instance_id;
    }

    data = data.split(",")


    for (var i = 0; i < data.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data[i] = dec
        data[i] = JSON.parse(data[i]);
        // SSHKeyList.push(data[i].ssh_key)
    }

    // SSHKeyList.push(key)


    request_data = {
        "access_key": data[0].client_id,
        "secret_key": data[0].client_secret,
        "region_id": region_id,
        "instance_id": instance_id,
        "ssh_key": key,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/aws-instance-info/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            // res.header("access-control-allow-origin", "*");
            // res.send(body)
            callback(body, false)
        }
        else {
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
            callback(error, true)
        }
    })

}
exports.AWSInstanceInfoAPICall = AWSInstanceInfoAPICall;

function checkAzureResourceGroupPermission(req, res, next) {

    var data1 = null;
    var data2 = null;
    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    data1 = JSON.parse(data1)

    //data = JSON.parse(data);
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2 = dec
    data2 = JSON.parse(data2)

    var request_data = {
        "client_id": data2.client_id,
        "secret_key": data2.client_secret,
        "tenant_id": data2.tenant_id,
        "subscription_id": data2.subscription_id,
        "resource_group": data1.resource_group
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/check-azure-resource-group-permissions/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            body.client_id = data2.client_id
            body.tenant_id = data2.tenant_id
            body.subscription_id = data2.subscription_id
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)            
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })

}
exports.checkAzureResourceGroupPermission = checkAzureResourceGroupPermission;

function getAzureInstanceInfo(req, res, next) {
    getSSHKey(req, res, next, function (ssh_key, err) {
        // if (!err ||) {
        console.log(ssh_key)
        if (ssh_key.length > 0 && ssh_key != "Please map ssh key to this vm") {
            var key = ssh_key[0].private_key.trim()
        }
        else {
            var key = null
        }
        AzureInstanceInfoAPICall(req, res, next, key, function (job_response, err) {
            if (!err) {
                console.log(job_response)
                res.header("access-control-allow-origin", "*");
                res.send(job_response)
            }
            else {
                console.log(job_response)
                res.header("access-control-allow-origin", "*");
                res.send(job_response)
            }
        })
        // }
        // else {
        //     res.send(ssh_key)
        // }
    })
}
exports.getAzureInstanceInfo = getAzureInstanceInfo;

function AzureInstanceInfoAPICall(req, res, next, key, callback) {

    var data = null;
    var resource_group = null;
    var vm_name = null;
    var request_data = null;
    var ssh_key = [];

    if (req.body.data) {
        data = req.body.data;
    }
    if (req.body.resource_group) {
        resource_group = req.body.resource_group;
    }
    if (req.body.vm_name) {
        vm_name = req.body.vm_name;
    }
    if (req.body.vm_name) {
        vm_name = req.body.vm_name;
    }
    if (req.body.public_ip) {
        public_ip = req.body.public_ip;
    }

    ssh_key.push(key)

    data = data.split(",")

    for (var i = 0; i < data.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data[i] = dec
        data[i] = JSON.parse(data[i]);
    }

    request_data = {
        "client_id": data[0].client_id,
        "secret_key": data[0].client_secret,
        "tenant_id": data[0].tenant_id,
        "subscription_id": data[0].subscription_id,
        "resource_group": resource_group,
        "vm_name": vm_name,
        "ssh_key": ssh_key,
        "public_ip": public_ip
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/azure-get-vm-username/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            // res.header("access-control-allow-origin", "*");
            // res.send(body)
            callback(body, false)
        }
        else {
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
            callback(error, true)
        }
    })

}
exports.AzureInstanceInfoAPICall = AzureInstanceInfoAPICall;

function ValidateC2CData(req, res, next) {
    var c2c_validation_response = {
        "regionList": [],
        "zoneList": [],
        "InstanceTypeList": []
    }
    getRegionsAlibaba(req, res, next, function (regionList, err) {
        if (!err) {
            console.log(regionList)
            c2c_validation_response.regionList = regionList.regions
            getZonesAlibaba(req, res, next, regionList, function (zoneList, err) {
                if (!err) {
                    c2c_validation_response.zoneList = zoneList.zones
                    getInstanceTypeAlibaba(req, res, next, regionList, zoneList, function (InstanceTypeList, err) {
                        if (!err) {
                            c2c_validation_response.InstanceTypeList = InstanceTypeList.instance_types
                            console.log(regionList, zoneList, InstanceTypeList)
                            res.header("access-control-allow-origin", "*");
                            res.send(c2c_validation_response)
                        }
                        else {
                            res.send(InstanceTypeList)
                            console.log(InstanceTypeList)
                        }
                    })
                }
                else {
                    res.send(zoneList)
                }
            })
        }
        else {
            console.log(regionList)
        }
    });
}
exports.ValidateC2CData = ValidateC2CData;

function getRegionsAlibaba(req, res, next, callback) {
    var data = null;

    // if (req.body.user_id) {
    //     user_id = parseInt(req.body.user_id);
    // }
    if (req.body) {
        data = req.body;
    }

    // data = JSON.parse(data) secret_key_changed
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-regions/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        console.log(body)
        if (body.error == undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, true)
        }
    })
}
exports.getRegionsAlibaba = getRegionsAlibaba;

function getZonesAlibaba(req, res, next, regionList, callback) {
    var data = null
    if (req.body) {
        data = req.body;
    }

    //data = JSON.parse(data)
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec
    }
    // data.dest_region = regionList.regions[7]

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-zones/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })
}
exports.getZonesAlibaba = getZonesAlibaba;

function getInstanceTypeAlibaba(req, res, next, regionList, zoneList, callback) {
    var data = null
    if (req.body) {
        data = req.body;
    }
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-instance_type/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })
}
exports.getInstanceTypeAlibaba = getInstanceTypeAlibaba;

function physicalToAlibabaMigration(req, res, next, ssh_key, key_name, src_account_name, callback) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var SSHKeyList = [];
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
        // SSHKeyList.push(data3[i].ssh_key)
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.dest_secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.dest_secret_key = dec

    SSHKeyList.push(ssh_key)
    data1.ssh_key = SSHKeyList
    data1.key_pair_name = key_name
    data1.account_name = src_account_name

    console.log(data1.ssh_key)

    request_data = {
        "source_cloud": data1,
        "destination_cloud": data2,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "p2c-migration/physical-to-alibaba-new/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            callback(body, false)
            // res.send(body)         
        }
        else {
            res.header("access-control-allow-origin", "*");
            // res.send(error)
            callback(error, true)
        }
    })

}
exports.physicalToAlibabaMigration = physicalToAlibabaMigration;

function openstackToAlibabaMigration(req, res, next) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var SSHKeyList = [];
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.dest_secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.dest_secret_key = dec

    data1.auth_url = "http://" + data3[0].hostname + ":" + data3[0].api_port + "/" + data3[0].api_version
    data1.username = data3[0].client_id
    data1.password = data3[0].client_secret
    data1.domain_id = data3[0].v3_domain_id

    request_data = {
        "source_cloud": data1,
        "destination_cloud": data2,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/openstack-to-alibaba-migration/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)            
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })

}
exports.openstackToAlibabaMigration = openstackToAlibabaMigration;

function googleToAlibabaMigration(req, res, next) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var SSHKeyList = [];
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.dest_secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.dest_secret_key = dec

    data1.credentials = JSON.parse(data3[0].service_account_json)

    request_data = {
        "source_cloud": data1,
        "destination_cloud": data2,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/google-to-alibaba-migration/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.googleToAlibabaMigration = googleToAlibabaMigration;

function azureToAlibabaMigration(req, res, next) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.dest_secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.dest_secret_key = dec

    data1.client_id = data3[0].client_id
    data1.secret_key = data3[0].client_secret
    data1.tenant_id = data3[0].tenant_id
    data1.subscription_id = data3[0].subscription_id

    request_data = {
        "source_cloud": data1,
        "destination_cloud": data2,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/azure-to-alibaba-migration-new/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.azureToAlibabaMigration = azureToAlibabaMigration;

// function startV2CMigration(req, res, next) {
//     var source = null;
//     var virtualization_platform_name = null;
//     var destination = null;
//     var token = null;
//     var dec = null;

//     if (req.body.source) {
//         source = JSON.parse(req.body.source);

//     }
//     if (req.body.virtualization_platform_name) {
//         virtualization_platform_name = req.body.virtualization_platform_name;
//     }
//     if (req.body.destination) {
//         destination = JSON.parse(req.body.destination);
//         decipher = crypto.createDecipher(algorithm, password)
//         dec = decipher.update(destination.dest_secret_key, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         destination.dest_secret_key = dec
//     }
//     if (req.body.token) {
//         token = req.body.token;
//     }

//     //data = JSON.parse(data);
//     //decipher = crypto.createDecipher(algorithm, password)
//     //dec = decipher.update(data.password, 'hex', 'utf8')
//     //dec += decipher.final('utf8');
//     //data.password = dec
//     // data = JSON.stringify(data)

//     if (virtualization_platform_name == 'XenServer') {
//         listURL = migration_ip_linux + "v2c-migration/xenserver/vm-migrate";
//         decipher = crypto.createDecipher(algorithm, password)
//         dec = decipher.update(source.password, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         source.password = dec

//     }
//     else if (virtualization_platform_name == 'KVM') {
//         listURL = migration_ip_linux + "v2c-migration/kvm/vm-migrate";
//         decipher = crypto.createDecipher(algorithm, password)
//         dec = decipher.update(source.password, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         source.password = dec   
//     }
//     else if (virtualization_platform_name == 'VMWare') {
//         listURL = migration_ip_linux + "v2c-migration/vmware-to-apsara-stack/";
//         decipher = crypto.createDecipher(algorithm, password)
//         dec = decipher.update(source.src_vmware_password, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         source.src_vmware_password = dec        
//     }
//     else if (virtualization_platform_name == 'Hyper-V') {
//         listURL = migration_ip_windows + "v2c-migration/hyperv-to-apsara-stack/";
//         decipher = crypto.createDecipher(algorithm, password)
//         dec = decipher.update(source.src_password, 'hex', 'utf8')
//         dec += decipher.final('utf8');
//         source.src_password = dec
//     }
//     if (destination.dest_admin_password != undefined) {
//             decipher = crypto.createDecipher(algorithm, password)
//             dec = decipher.update(destination.dest_admin_password, 'hex', 'utf8')
//             dec += decipher.final('utf8');
//             destination.dest_admin_password = dec
//         }
//     var data = {
//         "source": source,
//         "destination": destination,
//         "token": token
//     }
//     var options = {
//         method: 'POST',
//         url: listURL,
//         headers:
//         {
//             'Content-Type': 'application/json'
//         },
//         body: data,
//         json: true
//     };
//     request(options, function (error, resp, body) {
//         if (body != undefined) {
//             res.header("access-control-allow-origin", "*");
//             res.send(body)
//         }
//         else {
//             res.header("access-control-allow-origin", "*");
//             res.send(error)
//         }
//     })
// }
// exports.startV2CMigration = startV2CMigration;


function startV2CMigration(req, res, next) {
    console.log('hitted')
    var source = null;
    var virtualization_platform_name = null;
    var destination = null;
    var token = null;
    var dec = null;

    if (req.body.source) {
        source = JSON.parse(req.body.source);

    }
    if (req.body.virtualization_platform_name) {
        virtualization_platform_name = req.body.virtualization_platform_name;
    }
    console.log('hitted', source)

    if (req.body.destination) {
        destination = JSON.parse(req.body.destination);
        decipher = crypto.createDecipher(algorithm, password)
        if (destination.cloud_name == 'OTC') {
            dec = decipher.update(destination.secret_key, 'hex', 'utf8')
            dec += decipher.final('utf8');
            destination.secret_key = dec

            decipher_pass = crypto.createDecipher(algorithm, password)
            dec_pass = decipher_pass.update(destination.password, 'hex', 'utf8')
            dec_pass += decipher_pass.final('utf8');
            destination.password = dec_pass
        }
        else {
            dec = decipher.update(destination.dest_secret_key, 'hex', 'utf8')
            dec += decipher.final('utf8');
            destination.dest_secret_key = dec
        }

    }
    console.log('hitted', destination)

    if (req.body.token) {
        token = req.body.token;
    }

    //data = JSON.parse(data);
    //decipher = crypto.createDecipher(algorithm, password)
    //dec = decipher.update(data.password, 'hex', 'utf8')
    //dec += decipher.final('utf8');
    //data.password = dec
    // data = JSON.stringify(data)

    if (virtualization_platform_name == 'XenServer') {
        // listURL = migration_ip_linux + "v2c-migration/xenserver/vm-migrate";
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        source.password = dec

        if (destination.cloud_name == 'OTC') {
            listURL = migration_ip_linux + "v2c-migration/xenserver-to-otc/";
        }
        else if (destination.cloud_name == 'Alibaba') {
            listURL = migration_ip_linux + "v2c-migration/xenserver-to-apsara-stack/";
            // listURL = migration_ip_linux + "v2c-migration/xenserver/vm-migrate";
        }

    }
    else if (virtualization_platform_name == 'KVM') {
        // listURL = migration_ip_linux + "v2c-migration/kvm/vm-migrate";
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        source.password = dec

        if (destination.cloud_name == 'OTC') {
            listURL = migration_ip_linux + "v2c-migration/kvm-to-otc/";
        }
        else if (destination.cloud_name == 'Alibaba') {
            // listURL = migration_ip_linux + "v2c-migration/kvm/vm-migrate";
            listURL = migration_ip_linux + "v2c-migration/kvm-to-apsara-stack/";
        }
    }
    else if (virtualization_platform_name == 'VMWare') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source.src_vmware_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        source.src_vmware_password = dec


        if (destination.cloud_name == 'OTC') {
            listURL = migration_ip_linux + "v2c-migration/vmware-to-otc/";
            var source = {
                "host": source['src_vmware_ip_address'],
                "username": source['src_vmware_username'],
                "password": source['src_vmware_password'],
                "os_name": source['os_name'],
                "vm_name": source['src_vm_name']
            }
        }
        else if (destination.cloud_name == 'Alibaba') {
            listURL = migration_ip_linux + "v2c-migration/vmware-to-apsara-stack/";
        }
    }
    else if (virtualization_platform_name == 'Hyper-V') {
        listURL = migration_ip_windows + "v2c-migration/hyperv-to-apsara-stack/";
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source.src_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        source.src_password = dec
    }
    var data = {
        "source": source,
        "destination": destination,
        "token": token
    }
    console.log(data)
    var options = {
        method: 'POST',
        url: listURL,
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
exports.startV2CMigration = startV2CMigration;


function get_ms_sql_diagnosis_data(req, res, next) {

    var source;
    var dest_details;
    var token;


    if (req.body.source) {
        source = req.body.source;

        source = JSON.parse(source)
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(source.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        source.password = dec




    }
    if (req.body.destination) {
        dest_details = req.body.destination;

        dest_details = JSON.parse(dest_details)
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(dest_details.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        dest_details.password = dec




    }
    if (req.body.token) {
        token = req.body.token;
    }

    var ms_data = {
        "source": source,
        "destination": dest_details,
        "token": token
    }


    var options = {
        method: 'POST',
        url: migration_ip_windows + 'd2c-migration/mssql/diagnosis',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: ms_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_ms_sql_diagnosis_data = get_ms_sql_diagnosis_data;

function get_my_sql_diagnosis_data(req, res, next) {


    var host;
    var port = null;
    var username;
    var src_password;
    var ssl;
    var token;


    if (req.body.src_password) {

        src_password = req.body.src_password;
        //source = JSON.parse(source);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(src_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        src_password = dec
        src_password = src_password
    }

    if (req.body.host) {
        host = req.body.host;
    }

    if (req.body.port) {
        port = parseInt(req.body.port);
    }
    if (req.body.username) {
        username = req.body.username;
    }

    if (req.body.ssl == 'true') {
        ssl = true
    }
    if (req.body.ssl == 'false') {
        ssl = false
    }
    else {
        ssl = req.body.ssl
    }

    if (req.body.token) {
        token = req.body.token;
    }


    var db_data = {
        "host": host,
        "port": parseInt(port),
        "username": username,
        "password": src_password,
        "ssl": ssl,
        "token": token
    }





    //get data for diagnosis 


    var options = {
        method: 'POST',
        url: migration_ip_linux + 'd2c-migration/mysql/diagnosis-report',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: db_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_my_sql_diagnosis_data = get_my_sql_diagnosis_data;

function get_postgres_sql_diagnosis_data(req, res, next) {


    var host;
    var port = null;
    var username;
    var src_password;
    var ssl;
    var token;


    if (req.body.src_password) {

        src_password = req.body.src_password;
        //source = JSON.parse(source);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(src_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        src_password = dec
        src_password = src_password



    }

    if (req.body.host) {
        host = req.body.host;
    }

    if (req.body.port) {
        port = parseInt(req.body.port);
    }
    if (req.body.username) {
        username = req.body.username;
    }


    if (req.body.ssl == 'true') {
        ssl = true
    }
    if (req.body.ssl == 'false') {
        ssl = false
    }
    else {
        ssl = req.body.ssl
    }

    if (req.body.token) {
        token = req.body.token;
    }


    var db_data = {
        "host": host,
        "port": parseInt(port),
        "username": username,
        "password": src_password,
        "ssl": ssl,
        "token": token
    }
    var options = {
        method: 'POST',
        url: migration_ip_linux + 'd2c-migration/postgresql/diagnosis-report',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: db_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_postgres_sql_diagnosis_data = get_postgres_sql_diagnosis_data;

function get_xen_server_diagnosis_data(req, res, next) {


    var host;
    var username;
    var server_password;
    var token;


    if (req.body.password) {

        server_password = req.body.password;
        //source = JSON.parse(source);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(server_password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        server_password = dec
        server_password = server_password



    }

    if (req.body.host) {
        host = req.body.host;
    }


    if (req.body.username) {
        username = req.body.username;
    }


    if (req.body.token) {
        token = req.body.token;
    }


    var xen_data = {
        "host": host,
        "username": username,
        "password": server_password,
        "token": token
    }

    //get data for diagnosis 

    var options = {
        method: 'POST',
        // url: migration_ip_linux + 'v2c-migration/xenserver/vm-diagnosis',
        url: migration_ip_linux + 'v2c-migration/xenserver-vm-diagnosis/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: xen_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_xen_server_diagnosis_data = get_xen_server_diagnosis_data;

function get_put_edit_data_of_src(req, res, next) {

    var user_id = null;
    var migration_type = null;
    var src_details = null;
    var migra_name = null;
    var src_host = null;
    var mode = null;
    var dec = null;
    var secret_key_changed = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }

    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }

    if (req.body.src_details) {
        src_details = req.body.src_details;
    }

    if (req.body.migra_name) {
        migra_name = req.body.migra_name;
    }

    if (req.body.src_host) {
        src_host = req.body.src_host;
    }

    if (req.body.mode) {
        mode = req.body.mode;
    }

    if (req.body.secret_key_changed) {
        secret_key_changed = req.body.secret_key_changed;
    }

    // if (secret_key_changed === 'false') {
    //     src_details = JSON.parse(src_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(src_details.src_vmware_password, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     src_details.src_vmware_password = dec
    //     src_details = JSON.stringify(src_details)
    // }

    if (secret_key_changed === 'true') {
        src_details = JSON.parse(src_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(src_details.src_vmware_password, 'utf8', 'hex')
        crypted += cipher.final('hex');
        src_details.src_vmware_password = crypted
        src_details = JSON.stringify(src_details)
    }


    //get data for diagnosis 

    config.query("select * from cb_mig_sp_to_get_migration_src_details(" + user_id + ",'" + migration_type + "','" + src_details + "','" + migra_name + "','" + src_host + "','" + mode + "','info');", function (err, result) {
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
exports.get_put_edit_data_of_src = get_put_edit_data_of_src;

function get_put_edit_data_of_dest(req, res, next) {

    var user_id = null;
    var migration_type = null;
    var dest_details = null;
    var migra_name = null;
    var dest_host = null;
    var mode = null;
    var dec = null;
    var secret_key_changed_pass = null;
    var secret_key_changed_secret = null;


    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }

    if (req.body.migration_type) {
        migration_type = req.body.migration_type;
    }

    if (req.body.dest_details) {
        dest_details = req.body.dest_details;
    }

    if (req.body.migra_name) {
        migra_name = req.body.migra_name;
    }

    if (req.body.dest_host) {
        dest_host = req.body.dest_host;
    }

    if (req.body.mode) {
        mode = req.body.mode;
    }

    if (req.body.secret_key_changed_pass) {
        secret_key_changed_pass = req.body.secret_key_changed_pass;
    }
    if (req.body.secret_key_changed_secret) {
        secret_key_changed_secret = req.body.secret_key_changed_secret;
    }

    if (secret_key_changed_pass === 'true') {
        dest_details = JSON.parse(dest_details);
        cipher = crypto.createCipher(algorithm, password)
        if (migra_name == "Alibaba") {
            // dec = decipher.update(dest_details.dest_admin_password, 'hex', 'utf8')
            // dec += decipher.final('utf8');
            // dest_details.dest_admin_password = dec
            crypted = cipher.update(dest_details.dest_admin_password, 'utf8', 'hex')
            crypted += cipher.final('hex');
            dest_details.dest_admin_password = crypted
        }
        else if (migra_name == "OTC") {
            // dec = decipher.update(dest_details.dest_secret_key, 'hex', 'utf8')
            // dec += decipher.final('utf8');
            // dest_details.dest_secret_key = dec
            crypted = cipher.update(dest_details.dest_secret_key, 'utf8', 'hex')
            crypted += cipher.final('hex');
            dest_details.dest_secret_key = crypted
        }
        dest_details = JSON.stringify(dest_details)
    }
    // if (secret_key_changed_secret === 'false') {
    //     dest_details = JSON.parse(dest_details);
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(dest_details.dest_secret_key, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     dest_details.dest_secret_key = dec
    //     dest_details = JSON.stringify(dest_details)
    // }

    if (secret_key_changed_secret === 'true') {
        dest_details = JSON.parse(dest_details);
        cipher = crypto.createCipher(algorithm, password)
        crypted = cipher.update(dest_details.dest_secret_key, 'utf8', 'hex')
        crypted += cipher.final('hex');
        dest_details.dest_secret_key = crypted
        dest_details = JSON.stringify(dest_details)
    }

    config.query("select * from cb_mig_sp_to_get_migration_dest_details(" + user_id + ",'" + migration_type + "','" + dest_details + "','" + migra_name + "','" + dest_host + "','" + mode + "','info');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });


}
exports.get_put_edit_data_of_dest = get_put_edit_data_of_dest;

function getVpcsAlibaba(req, res, next, regionList, callback) {
    var data = null
    if (req.body) {
        data = req.body;
    }

    //data = JSON.parse(data)
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec

    }


    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-vpcs/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })
}
exports.getVpcsAlibaba = getVpcsAlibaba;

function getSecurityGroupAlibaba(req, res, next, regionList, zoneList, vpcs_list, callback) {
    var data = null
    if (req.body) {
        data = req.body;
    }

    //data = JSON.parse(data)
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-security-groups/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })
}
exports.getSecurityGroupAlibaba = getSecurityGroupAlibaba;

function getVswitchesAlibaba(req, res, next, regionList, zoneList, vpcs_list, callback) {
    var data = null
    if (req.body) {
        data = req.body;
    }

    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.dest_secret_key = dec
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/alibaba/list-vswitches/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
            //callback(body, false)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })
}
exports.getVswitchesAlibaba = getVswitchesAlibaba;

function get_gcp_cloud_diagnosis_data(req, res, next) {


    //var credentials;
    var data = null;
    var token = null;
    var zone = null;

    if (req.body.token) {
        token = req.body.token;
    }
    if (req.body.data) {
        data = req.body.data;
    }
    if (req.body.zone) {
        zone = req.body.zone;
    }


    data = data.split(",")


    for (var i = 0; i < data.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data[i] = dec
        data[i] = JSON.parse(data[i]);
        data[i].service_account_json = JSON.parse(data[i].service_account_json)
    }

    var gcp_data = {
        "zone": zone,
        "credentials": data[0].service_account_json,
        "token": token
    };

    //get data for diagnosis 

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'c2c-migration/gcp-diagnosis-report/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: gcp_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_gcp_cloud_diagnosis_data = get_gcp_cloud_diagnosis_data;


function get_openstack_cloud_diagnosis_data(req, res, next) {


    var open_password = null;
    var data3 = null;
    var data = null;
    var token = null;
    var username = null;
    var auth_url = null;
    var domain_id = null;


    if (req.body.token) {
        token = req.body.token;
    }
    if (req.body.data) {
        data = req.body.data;
    }

    //data = data.split(",")
    data3 = data.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    auth_url = "http://" + data3[0].hostname + ":" + data3[0].api_port + "/" + data3[0].api_version
    username = data3[0].client_id
    open_password = data3[0].client_secret
    domain_id = data3[0].v3_domain_id


    var openstack_data = {
        "auth_url": auth_url,
        "username": username,
        "password": open_password,
        "domain_id": domain_id,
        "token": token
    };

    //get data for diagnosis 

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'c2c-migration/openstack-premigration-test/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: openstack_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }



    });
}
exports.get_openstack_cloud_diagnosis_data = get_openstack_cloud_diagnosis_data;

function getUserId(req, res, next) {
    res.header("access-control-allow-origin", "*");
    var userGroup = null;
    var tenantId = null;
    var userId = null;
    //response skeleton for the api
    response = {
        "status": "",
        "user_id": "",
        "error": {
            "message": "",
            "code": 0
        }
    }
    //validation for the parameter is present or not
    if (!req.body.user_group) {
        response.status = "error";
        user_id = null;
        response.error.message = "user_group parameter is missing";
        res.send(response);
    }
    else {
        userGroup = req.body.user_group;
    }
    if (!req.body.tenant_id) {
        response.status = "error";
        user_id = null;
        response.error.message = "tenant_id parameter is missing";
        res.send(response);
    }
    else {
        tenantId = req.body.tenant_id;
    }

    config.query("SELECT * FROM cb_mig_sp_get_user_id('" + userGroup + "','" + tenantId + "');", function (err, result) {
        if (!err) {
            if (!(result.rows[0].cb_mig_sp_get_user_id == null)) {
                userId = result.rows[0].cb_mig_sp_get_user_id;
                response.status = "successful";
                response.user_id = userId;
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
exports.getUserId = getUserId;


function listInprogressMigrationsC2C(req, res, next) {
    var resp = {
        "status": "",
        "is_migrating_already": false,
        "cloud_name": "",
        "source_vm_name": "",
        "error": {
            "message": "",
            "code": 0
        }
    }
    var userId = null;
    var sourceCloud = null;
    var sourceVM = null;
    if (req.body.user_id) {
        userId = req.body.user_id;
    }
    if (req.body.source_cloud) {
        sourceCloud = req.body.source_cloud;
        resp.cloud_name = sourceCloud;

    }
    if (req.body.source_vm) {
        sourceVM = req.body.source_vm;
        resp.source_vm_name = sourceVM;
    }
    config.query("SELECT * FROM cb_mig_sp_get_inprogress_migration_c2c(" + userId + ");", function (err, result) {
        console.log(req.query)
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            if (result.rows.length !== 0) {
                for (jobStatus of result.rows) {
                    console.log(jobStatus)
                    if (jobStatus.cb_mig_sp_get_inprogress_migration_c2c === '' || jobStatus.cb_mig_sp_get_inprogress_migration_c2c === null) {
                        resp.status = 'successful'
                        resp.is_migrating_already = false
                        resp.error.message = ''
                    }
                    else {
                        jobStatus = JSON.parse(jobStatus.cb_mig_sp_get_inprogress_migration_c2c)
                        console.log(jobStatus)
                        if (jobStatus != undefined) {
                            if (jobStatus.source != undefined) {
                                if (jobStatus.source.cloud === sourceCloud && sourceVM === jobStatus.source.instance) {
                                    resp.status = 'successful'

                                    resp.error.message = ''
                                    resp.is_migrating_already = true
                                    break;
                                }
                                else {
                                    resp.status = 'successful'

                                    resp.is_migrating_already = false
                                    resp.error.message = ''
                                }
                            }
                            else {
                                resp.status = 'successful'

                                resp.is_migrating_already = false
                                resp.error.message = ''
                            }
                        }
                        else {
                            resp.status = 'successful'

                            resp.is_migrating_already = false
                            resp.error.message = ''
                        }
                    }
                }
            }
            else {
                resp.status = 'successful'

                resp.is_migrating_already = false
                resp.error.message = ''
            }

            res.send(resp);
        }
        else {
            resp.status = 'error'
            res.header("access-control-allow-origin", "*");
            resp.error.message = "Error while performing Query. " + err
            console.log('Error while performing Query.', err);
            res.send(resp);
        }
    });
}
exports.listInprogressMigrationsC2C = listInprogressMigrationsC2C;

function listP2CVMs(req, res, next) {
    var data = null;
    var virtualization_platform_name = null;
    var user_id = null;

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.virtualization_platform_name) {
        virtualization_platform_name = req.body.virtualization_platform_name;
    }
    if (req.body.src_host) {
        data = req.body.src_host;
    }

    data = JSON.parse(data);
    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data.auth_token, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data.auth_token = dec

    if (virtualization_platform_name == 'Packet') {
        listURL = migration_ip_linux + "p2c-migration/baremetal-machine-info/";
    }

    var options = {
        method: 'POST',
        url: listURL,
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
            //callback(body, false)            
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
            //callback(body, true)
        }
    })

}
exports.listP2CVMs = listP2CVMs;

function startP2CMigration(req, res, next) {
    var source = null;
    var platform_name = null;
    var destination = null;
    var token = null;
    var dec = null;

    if (req.body.source) {
        source = JSON.parse(req.body.source);
    }
    if (req.body.platform_name) {
        platform_name = req.body.platform_name;
    }
    if (req.body.destination) {
        destination = JSON.parse(req.body.destination);
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(destination.dest_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        destination.dest_secret_key = dec
    }
    if (req.body.token) {
        token = req.body.token;
    }
    // if (destination.password != undefined) {
    //     decipher = crypto.createDecipher(algorithm, password)
    //     dec = decipher.update(destination.password, 'hex', 'utf8')
    //     dec += decipher.final('utf8');
    //     destination.password = dec
    // }
    if (platform_name === 'Baremetal') {
        // if (platform_name === 'OnPremise') {
        if (source.password != '') {
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(source.password, 'hex', 'utf8')
            dec += decipher.final('utf8');
            source.password = dec
        }
        else if (source.ssh_key != '') {
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(source.ssh_key, 'hex', 'utf8')
            dec += decipher.final('utf8');
            source.ssh_key = dec
        }
    }

    listURL = migration_ip_linux + "p2c-migration/baremetal-to-alibaba/";

    var data = {
        "source": source,
        "destination": destination,
        "token": token
    }
    var options = {
        method: 'POST',
        url: listURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            console.log(body)
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
        else {
            console.log(error)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    })
}
exports.startP2CMigration = startP2CMigration;

function authenticateP2CVMs(req, res, next) {
    var data = null;
    var virtualization_platform_name = null;
    var user_id = null;
    var secret_key_changed = null

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.virtualization_platform_name) {
        virtualization_platform_name = req.body.virtualization_platform_name;
    }
    if (req.body.src_host) {
        data = req.body.src_host;
    }
    if (req.body.secret_key_changed) {
        secret_key_changed = req.body.secret_key_changed;
    }

    if (virtualization_platform_name == 'Baremetal') {
        // if (virtualization_platform_name == 'OnPremise') {
        data = JSON.parse(data);
        if (secret_key_changed === 'false') {
            if (data.password != '') {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(data.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                data.password = dec
            }
            else if (data.ssh_key != '') {
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(data.ssh_key, 'hex', 'utf8')
                dec += decipher.final('utf8');
                data.ssh_key = dec
            }

        }
        listURL = migration_ip_linux + "p2c-migration/lan-machine-auth/";
    }

    var options = {
        method: 'POST',
        url: listURL,
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
exports.authenticateP2CVMs = authenticateP2CVMs;

function listP2COnPremiseVMs(req, res, next) {
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
    config.query("SELECT * FROM cb_mig_sp_get_details_p2c_on_premise(" + user_id + ",'" + migration_type + "' ,'" + dbType + "','" + mode + "');", function (err, result) {
        if (!err) {
            res.header("access-control-allow-origin", "*");
            // if (!(result.rows[0].cb_mig_sp_get_details_p2c_on_premise == null)) {
            //     for(var c=0; c<result.rows[0].cb_mig_sp_get_details_p2c_on_premise.length; c++) {
            //         if(migration_type == 'P2C' && dbType == 'OnPremise') {
            //             cipher = crypto.createCipher(algorithm, password)
            //             crypted = cipher.update(result.rows[0].cb_mig_sp_get_details_p2c_on_premise[c].src_details.password_ssh, 'utf8', 'hex')
            //             crypted += cipher.final('hex');
            //             result.rows[0].cb_mig_sp_get_details_p2c_on_premise[c].src_details.password_ssh = crypted
            //         } 
            //     }      
            // }       
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.listP2COnPremiseVMs = listP2COnPremiseVMs;

function validateAzureParameters(req, res, next) {

    var data = {
        "client_id": req.query.id1,
        "secret_key": req.query.id2,
        "tenant_id": req.query.id3,
        "subscription_id": req.query.id4
    }

    var URL = migration_ip_linux + "c2c-migration/check-azure-all-resource-group-permissions/";

    var options = {
        method: 'POST',
        url: URL,
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
exports.validateAzureParameters = validateAzureParameters;

function SSHKeyOperations(req, res, next) {
    var userid = null;
    var group_id = null;
    var key_id = null;
    var key_name = null;
    var vmname = null;
    var zone_name = null;
    var cloudname = null;
    var accountid = null;
    var ref = null;
    var accountname = null;

    if (req.body.userid != null) {
        userid = parseInt(req.body.userid);
    }
    if (req.body.groupid) {
        group_id = parseInt(req.body.groupid);
    }
    if (req.body.key_id) {
        key_id = parseInt(req.body.key_id);
    }
    if (req.body.key_name) {
        key_name = req.body.key_name;
    }
    if (req.body.vm_name) {
        vmname = req.body.vm_name;
    }
    if (req.body.zone_name) {
        zone_name = req.body.zone_name;
    }
    if (req.body.cloud_name) {
        cloudname = req.body.cloud_name;
    }
    if (req.body.account_id) {
        accountid = parseInt(req.body.account_id);
    }
    if (req.body.ref) {
        ref = req.body.ref;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.account_name) {
        accountname = req.body.account_name;
    }

    if (req.body.mode == 'insert_ssh_key_mapping' || req.body.mode == 'delete_ssh_key_mapping' || req.body.mode == 'delete_ssh_key_mapping_with_vm') {
        config.query("SELECT * FROM cb_migration_sp_ssh_key_mapping_with_vm(" + userid + "," + group_id + " ," + key_id + ",'" + key_name + "','" + vmname + "','" + zone_name + "','" + cloudname + "'," + accountid + ",'" + accountname + "','" + mode + "','" + ref + "');", function (err, result) {
            if (!err) {
                console.log(result);
                res.header("access-control-allow-origin", "*");
                res.send(result);
            }
            else {
                console.log('Error while performing Query.', err);
                res.header("access-control-allow-origin", "*");
                res.send(err);
            }
        });
    }

    else if (req.body.mode == 'select_ssh_key_mapping') {
        config.query("SELECT * FROM cb_migration_sp_ssh_key_mapping_with_vm(" + userid + "," + group_id + " ," + key_id + ",'" + key_name + "','" + vmname + "','" + zone_name + "','" + cloudname + "'," + accountid + ",'" + accountname + "','" + mode + "','" + ref + "');fetch all in \"info\";", function (err, result) {
            if (!err) {
                console.log(result);
                res.header("access-control-allow-origin", "*");
                res.send(result);
            }
            else {
                console.log('Error while performing Query.', err);
                res.header("access-control-allow-origin", "*");
                res.send(err);
            }
        });
    }

}
exports.SSHKeyOperations = SSHKeyOperations;

function getSSHKey(req, res, next, callback) {
    var source_data = null;
    var keyname = null;
    var privatekey = null;
    var publickey = null;
    var groupid = null;
    var accountname = null;
    var cloudname = null;
    var regionname = null;
    var zonename = null;
    var actions = 'select_key';
    var ref = 'info';
    var keyid = null;

    if (req.body.data1 != null) {
        source_data = JSON.parse(req.body.data1);
        keyid = parseInt(source_data.key_id);
    }
    else if (req.body.id3 != null) {
        source_data = JSON.parse(req.body.id3);
        keyid = parseInt(source_data.key_id);
    }
    else if (req.body.ssh_key_ids != null) {
        // source_data = JSON.parse(req.body.id3);
        keyid = parseInt(req.body.ssh_key_ids);
    }

    if (!isNaN(keyid)) {
        config.query("SELECT * FROM cb_mig_sp_ssh_keys('" + keyname + "','" + privatekey + "' ," + publickey + ",'" + groupid + "','" + accountname + "','" + cloudname + "','" + regionname + "','" + zonename + "','" + actions + "','" + ref + "'," + keyid + ");fetch all in \"info\";", function (err, result) {
            if (!err) {
                console.log(result);
                res.header("access-control-allow-origin", "*");
                callback(result[1].rows, false)
                // res.send(result);
            }
            else {
                console.log('Error while performing Query.', err);
                res.header("access-control-allow-origin", "*");
                callback(err, true)
                // res.send(err);
            }
        });
    }
    else {
        callback('Please map ssh key to this vm', true)
    }

}
exports.getSSHKey = getSSHKey;

function fetchP2CMigrationDetails(req, res, next) {
    getSSHKey(req, res, next, function (ssh_key, err) {
        if (!err) {
            console.log(ssh_key)
            var key = ssh_key[0].private_key.trim()
            var key_name = ssh_key[0].key_name
            var src_account_name = ssh_key[0].account_name
            physicalToAlibabaMigration(req, res, next, key, key_name, src_account_name, function (job_response, err) {
                if (!err) {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)
                }
                else {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)
                }
            })
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(ssh_key)
        }
    })
}
exports.fetchP2CMigrationDetails = fetchP2CMigrationDetails;

function listD2CDatabasesNew(req, res, next) {
    getD2CDetails(req, res, next, null, function (details, err) {
        if (!err) {
            console.log(details)
            getToken(req, res, next, function (body, err) {
                if (!err) {
                    console.log(body)
                    getD2CDatabaseListNew(req, res, next, details, body.token, function (result, err) {
                        if (!err) {
                            console.log(result)
                            res.send(result)
                        }
                        else {

                            console.log(result)
                            res.send(result)
                        }
                    })
                }
                else {
                    console.log(body)
                    res.send(body)
                }
            })
        }
        else {
            console.log(details)
            res.send(details)

        }

    })
}
exports.listD2CDatabasesNew = listD2CDatabasesNew;

function getD2CDatabaseListNew(req, res, next, details, token, callback) {
    var data = null;
    var migrationType = null;
    var getDatabaseListURL = null;
    // if (req.body.mode == 'src_select') {
    //     data = {
    //         "host": details.src_details.host,
    //         "port": parseInt(details.src_details.port),
    //         "username": details.src_details.username,
    //         "password": details.src_details.password,
    //         "ssl": details.src_details.SSL,
    //         "token": token
    //     };
    //     migrationType = details.src_details.source;
    // }
    // else if (req.body.mode == 'dest_select') {
    //     data = {
    //         "host": details.dest_details.host,
    //         "port": parseInt(details.dest_details.port),
    //         "username": details.dest_details.username,
    //         "password": details.dest_details.password,
    //         "ssl": details.dest_details.SSL,
    //         "token": token
    //     };
    //     migrationType = details.dest_details.destination;
    // }

    if (req.body.mode == 'src_select') {
        data = {
            "host": details.src_details.host,
            "port": parseInt(details.src_details.port),
            "username": details.src_details.username,
            "password": details.src_details.password,
            "ssl": details.src_details.SSL,
            "databases": [],
            "token": token
        };
        migrationType = details.src_details.source;
        if (migrationType == "MySQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-database-objects")
        }
        else if (migrationType == "MSSQL") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-database-object")
        }
        else if (migrationType == "PostgreSQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-database-objects")
        }
        else if (migrationType == "ORACLE") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
        }
        else if (migrationType == "MongoDB") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-database-objects")
        }
    }
    else if (req.body.mode == 'dest_select') {
        data = {
            "host": details.dest_details.host,
            "port": parseInt(details.dest_details.port),
            "username": details.dest_details.username,
            "password": details.dest_details.password,
            "ssl": details.dest_details.SSL,
            "databases": [],
            "token": token
        };
        migrationType = details.dest_details.destination;
        if (migrationType == "MySQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
        }
        else if (migrationType == "MSSQL") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
        }
        else if (migrationType == "PostgreSQL") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
        }
        else if (migrationType == "ORACLE") {
            getDatabaseListURL = (migration_ip_windows + "d2c-migration/oracle/list_users_objects")
        }
        else if (migrationType == "MongoDB") {
            getDatabaseListURL = (migration_ip_linux + "d2c-migration/mongodb/list-database-objects")
        }
    }


    // var getDatabaseListURL = null;
    // if (migrationType == "MySQL") {
    //     getDatabaseListURL = (migration_ip_linux + "d2c-migration/mysql/list-databases")
    // } else if (migrationType == "MSSQL") {
    //     getDatabaseListURL = (migration_ip_windows + "d2c-migration/mssql/list-databases")
    // } else if (migrationType == "PostgreSQL") {
    //     getDatabaseListURL = (migration_ip_linux + "d2c-migration/postgresql/list-databases")
    // }

    var options = {
        method: 'POST',
        url: getDatabaseListURL,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(body, true)
        }
    })

}
exports.getD2CDatabaseListNew = getD2CDatabaseListNew;

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

function getS2CLogs(req, res, next) {

    var openSDSJobID = req.body.openSDSJobID

    var options = {
        method: 'GET',
        url: opensds_ip + "jobs/" + openSDSJobID + "/logs",
        json: true,
        headers:
        {
            'access-control-allow-origin': '*',
        },
    };
    request(options, function (error, resp, body) {
        try {
            res.header("access-control-allow-origin", "*");
            if (body != undefined) {
                console.log(body)
                if (body.logs != undefined) {
                    res.send(body.logs)
                }
                else {
                    res.send("Something went wrong")
                }
            }
            else {
                console.log(error)
                res.send(error)
            }
        }
        catch (e) {
            console.log(e)
            res.header("access-control-allow-origin", "*");
            res.send("Something went wrong")
        }
    })
}
exports.getS2CLogs = getS2CLogs;


function getMigrationLogs(req, res, next) {

    var job_id = null;
    var user_id = null

    if (req.body.job_id) {
        job_id = req.body.job_id;
    }
    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
    }
    config.query("select * from cb_mig_get_migration_log(" + user_id + ", '" + job_id + "');", function (err, result) {
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
exports.getMigrationLogs = getMigrationLogs;

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

function abortS2CMigration(req, res, next) {

    var openSDSJobID = req.body.openSDSJobID

    var options = {
        method: 'POST',
        url: opensds_ip + "jobs/" + openSDSJobID + "/abort",
        json: true,
        headers:
        {
            'access-control-allow-origin': '*',
            'Content-Type': 'application/json'
        },
    };
    request(options, function (error, resp, body) {
        try {
            res.header("access-control-allow-origin", "*");
            if (body != undefined) {
                console.log(body)
                res.send(body)
            }
            else {
                console.log(error)
                res.send(error)
            }
        }
        catch (e) {
            console.log(e)
            res.header("access-control-allow-origin", "*");
            res.send("Something went wrong")
        }
    })
}
exports.abortS2CMigration = abortS2CMigration;

function get_migration_details_of_user(req, res, next) {
    res.header("access-control-allow-origin", "*");

    var user_name = null;
    var group_id = null;

    //response skeleton for the api
    response = {
        "list": "",
        "error_status": false,
        "error": {
            "message": null,
            "code": 0
        }
    }
    //validation for the parameter is present or not
    if (!req.body.user_name) {
        response.error_status = true;
        list = null;
        response.error.message = "user_name parameter is missing";
        return res.send(response);
    }
    else if (!req.body.group_id) {
        response.error_status = true;
        list = null;
        response.error.message = "group_id parameter is missing";
        return res.send(response);
    }
    else {
        user_name = req.body.user_name;
        group_id = req.body.group_id;
        var data = {
            "user_name": user_name,
            "group_id": group_id
        }
        var options = {
            method: 'POST',
            url: migration_ip_linux + "all-job-status-for-notification",
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
                    response.list = body.list
                }
                else {
                    response.error_status = true
                    response.list = body
                }
            }
            else {
                response.error_status = true
                response.list = error
            }
            res.send(response)
        })
    }
}
exports.get_migration_details_of_user = get_migration_details_of_user;

function get_in_progress_migration_count(req, res, next) {
    var user_name = null;

    user_name = req.body.user_name;
    config.query("select * from cb_migration_sp_get_in_progress_migration_count('" + user_name + "');", function (err, result) {
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
exports.get_in_progress_migration_count = get_in_progress_migration_count;

function get_notification_data_for_selected_migration_type(req, res, next) {

    var user_name = req.body.user_name
    var migration_type = req.body.migration_type

    if (migration_type.toLowerCase() != "storage to cloud") {
        var notification_data = {
            "user_name": user_name,
            "migration_type": migration_type
        }
    }
    else {
        var notification_data = {
            "user_name": user_name,
            "migration_type": migration_type,
            "token": req.body.token
        }
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "job-status-for-selected_migration_type",
        json: true,
        headers:
        {
            'access-control-allow-origin': '*',
            'Content-Type': 'application/json'
        },
        body: notification_data
    };
    request(options, function (error, resp, body) {
        try {
            res.header("access-control-allow-origin", "*");
            if (body != undefined) {
                console.log(body)
                res.send(body)
            }
            else {
                console.log(error)
                res.send(error)
            }
        }
        catch (e) {
            console.log(e)
            res.header("access-control-allow-origin", "*");
            res.send("Something went wrong")
        }
    })
}
exports.get_notification_data_for_selected_migration_type = get_notification_data_for_selected_migration_type;

function getInstanceTypeListOTC(req, res, next) {
    var data = null
    if (req.body) {
        data = req.body;
    }
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.password = dec
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/otc/list-flavours/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body.error == undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
    })
}
exports.getInstanceTypeListOTC = getInstanceTypeListOTC;

function AuthenticationOTC(req, res, next) {
    var data = null
    if (req.body) {
        data = req.body;
    }
    if (data.secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.password, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.password = dec
    }
    if (data.destination_secret_key_changed === 'false') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data.secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        data.secret_key = dec
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/otc/auth/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, resp, body) {
        console.log(body)
        if (body.error == undefined) {
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(body)
        }
    })
}
exports.AuthenticationOTC = AuthenticationOTC;

function azureToOTCMigration(req, res, next) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.secret_key = dec

    decipher = null
    dec = null

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.password = dec

    data1.client_id = data3[0].client_id
    data1.secret_key = data3[0].client_secret
    data1.tenant_id = data3[0].tenant_id
    data1.subscription_id = data3[0].subscription_id

    request_data = {
        "source_cloud": data1,
        "destination_cloud": data2,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/azure-to-otc-migration-new/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.azureToOTCMigration = azureToOTCMigration;

function SSHKeyOperationsOld(req, res, next) {
    var userid = null;
    var usergroup = null;
    var key_id = null;
    var key_name = null;
    var vmname = null;
    var zone_name = null;
    var cloudname = null;
    var tenantid = null;
    var ref = null;
    var accountname = null;

    if (req.body.userid != null) {
        userid = parseInt(req.body.userid);
    }
    if (req.body.user_group) {
        usergroup = req.body.user_group;
    }
    if (req.body.key_id) {
        key_id = parseInt(req.body.key_id);
    }
    if (req.body.key_name) {
        key_name = req.body.key_name;
    }
    if (req.body.vm_name) {
        vmname = req.body.vm_name;
    }
    if (req.body.zone_name) {
        zone_name = req.body.zone_name;
    }
    if (req.body.cloud_name) {
        cloudname = req.body.cloud_name;
    }
    if (req.body.tenant_id) {
        tenantid = req.body.tenant_id;
    }
    if (req.body.ref) {
        ref = req.body.ref;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.account_name) {
        accountname = req.body.account_name;
    }

    if (req.body.mode == 'insert_ssh_key_mapping') {
        config.query("SELECT * FROM cb_mig_sp_ssh_key_mapping_with_vm(" + userid + ",'" + usergroup + "' ," + key_id + ",'" + key_name + "','" + vmname + "','" + zone_name + "','" + cloudname + "','" + tenantid + "','" + accountname + "','" + mode + "','" + ref + "');", function (err, result) {
            if (!err) {
                console.log(result);
                res.header("access-control-allow-origin", "*");
                res.send(result);
            }
            else {
                console.log('Error while performing Query.', err);
                res.header("access-control-allow-origin", "*");
                res.send(err);
            }
        });
    }

    else if (req.body.mode == 'select_ssh_key_mapping') {
        config.query("SELECT * FROM cb_mig_sp_ssh_key_mapping_with_vm(" + userid + ",'" + usergroup + "' ," + key_id + ",'" + key_name + "','" + vmname + "','" + zone_name + "','" + cloudname + "','" + tenantid + "','" + accountname + "','" + mode + "','" + ref + "');fetch all in \"info\";", function (err, result) {
            if (!err) {
                console.log(result);
                res.header("access-control-allow-origin", "*");
                res.send(result);
            }
            else {
                console.log('Error while performing Query.', err);
                res.header("access-control-allow-origin", "*");
                res.send(err);
            }
        });
    }

}
exports.SSHKeyOperationsOld = SSHKeyOperationsOld;

function awsToOTCMigration(req, res, next) {
    var data1 = null;
    var data2 = null;
    var data3 = null;
    var request_data = null;
    var token = null;

    if (req.body.data1) {
        data1 = req.body.data1;
    }
    if (req.body.data2) {
        data2 = req.body.data2;
    }
    if (req.body.data3) {
        data3 = req.body.data3;
    }
    if (req.body.token) {
        token = req.body.token;
    }

    data1 = JSON.parse(data1)
    data2 = JSON.parse(data2)
    data3 = data3.split(",")

    for (var i = 0; i < data3.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(data3[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        data3[i] = dec
        data3[i] = JSON.parse(data3[i]);
    }

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.secret_key, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.secret_key = dec

    decipher = null
    dec = null

    decipher = crypto.createDecipher(algorithm, password)
    dec = decipher.update(data2.password, 'hex', 'utf8')
    dec += decipher.final('utf8');
    data2.password = dec

    data1.access_key = data3[0].client_id
    data1.secret_key = data3[0].client_secret

    request_data = {
        "source": data1,
        "destination": data2,
        "token": token
    }

    console.log("request_data", request_data)

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/aws-to-opentelekom-migration/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.awsToOTCMigration = awsToOTCMigration;

function getAWSSystemDiskSize(req, res, next) {
    var region = null;
    var aws_data = null;
    var request_data = null;
    var token = null;

    if (req.body.region) {
        region = req.body.region;
    }
    if (req.body.aws_data) {
        aws_data = req.body.aws_data;
    }
    if (req.body.token) {
        token = req.body.token;
    }
    aws_data = aws_data.split(",")

    for (var i = 0; i < aws_data.length; i++) {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(aws_data[i], 'hex', 'utf8')
        dec += decipher.final('utf8');
        aws_data[i] = dec
        aws_data[i] = JSON.parse(aws_data[i]);
    }

    request_data = {
        "access_key": aws_data[0].client_id,
        "secret_key": aws_data[0].client_secret,
        "region_id": region,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/aws-instance-list/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.getAWSSystemDiskSize = getAWSSystemDiskSize;

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
        if (migration_type == "P2C") {
            if (cloud_name == "Packet") {
                cipher = crypto.createCipher(algorithm, password)
                crypted = cipher.update(account_details.auth_token, 'utf8', 'hex')
                crypted += cipher.final('hex');
                account_details.auth_token = crypted
            }
            else if (cloud_name == "Baremetal") {
                cipher = crypto.createCipher(algorithm, password)
                crypted = cipher.update(account_details.password_ssh, 'utf8', 'hex')
                crypted += cipher.final('hex');
                account_details.password_ssh = crypted
            }
        }
        else if (migration_type == "V2C") {
            // if (cloud_name == "XenServer") {
            cipher = crypto.createCipher(algorithm, password)
            crypted = cipher.update(account_details.src_vmware_password, 'utf8', 'hex')
            crypted += cipher.final('hex');
            account_details.src_vmware_password = crypted
            // }
        }
        else if (migration_type == "C2C/V2C/P2C") {
            if (cloud_name == "OTC") {
                cipher = crypto.createCipher(algorithm, password)
                crypted = cipher.update(account_details.dest_secret_key, 'utf8', 'hex')
                crypted += cipher.final('hex');
                account_details.dest_secret_key = crypted
            }
        }
        else if (migration_type == "S2C") {
            cipher = crypto.createCipher(algorithm, password)
            crypted = cipher.update(account_details.secret_key, 'utf8', 'hex')
            crypted += cipher.final('hex');
            account_details.secret_key = crypted
        }
        else if (migration_type == "D2C") {
            cipher = crypto.createCipher(algorithm, password)
            crypted = cipher.update(account_details.password, 'utf8', 'hex')
            crypted += cipher.final('hex');
            account_details.password = crypted
        }
        account_details = JSON.stringify(account_details)
    }

    if (query_type == "select_accounts" || query_type == "select_account_details" || query_type == "select_account_details_p2c" || query_type == "select_accounts_cb") {
        var query = "select * from cb_migration_add_edit_delete_accounts(" + account_id + " ," + user_id + " ," + group_id + ",'" + migration_type + "' ,'" + cloud_name + "' ,'" + account_name + "','" + account_details + "','" + query_type + "', 'info');fetch all in \"info\";"
    }
    else {
        var query = "select * from cb_migration_add_edit_delete_accounts(" + account_id + " ," + user_id + " ," + group_id + ",'" + migration_type + "' ,'" + cloud_name + "' ,'" + account_name + "','" + account_details + "','" + query_type + "', 'info');"
    }
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

function checkScheduledMigrationBeforeEditDelete(req, res, next) {
    var user_id = null
    var migration_type = null
    var cloud_name = null
    var account_name = null

    var query_type = null

    if (req.body.user_id) {
        user_id = parseInt(req.body.user_id);
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
    if (req.body.query_type) {
        query_type = req.body.query_type;
    }

    // if (query_type == "select_accounts" || query_type == "select_account_details" || query_type == "select_account_details_p2c" || query_type == "select_accounts_cb") {
    //     var query = "select * from cb_migration_add_edit_delete_accounts(" + account_id + " ," + user_id + " ," + group_id + ",'" + migration_type + "' ,'" + cloud_name + "' ,'" + account_name + "','" + account_details + "','" + query_type + "', 'info');fetch all in \"info\";"
    // }
    // else {
    var query = "select * from cb_migration_sp_to_check_scheduled_accounts(" + user_id + " ,'" + migration_type + "' ,'" + cloud_name + "' ,'" + account_name + "','" + query_type + "');"
    // }
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
exports.checkScheduledMigrationBeforeEditDelete = checkScheduledMigrationBeforeEditDelete;

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

function getDetailsOfInProgressMigration(req, res, next) {
    var cloud_name = null
    var user_id = null
    var instance_id = null
    var instance_name = null
    var migration_type = null

    if (req.body.migration_type != null) {
        migration_type = req.body.migration_type;
    }
    if (req.body.user_id != null) {
        user_id = parseInt(req.body.user_id);
    }
    if (req.body.instance_id != null) {
        instance_id = req.body.instance_id;
    }
    if (req.body.instance_name != null) {
        instance_name = req.body.instance_name;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }

    config.query("select * from cb_migration_get_inprogress_vm_details(" + user_id + ",'" + migration_type + "','" + cloud_name + "','" + instance_id + "','" + instance_name + "');", function (err, result) {

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
exports.getDetailsOfInProgressMigration = getDetailsOfInProgressMigration;

function delete_scheduled_migration(req, res, next) {
    user_id = parseInt(req.body.user_id);
    schedule_id = parseInt(req.body.schedule_id);
    config.query("UPDATE _cb_mig_sched_migra SET is_deleted=true WHERE user_id=" + user_id + " and id=" + schedule_id + ";", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send("Success");
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send("Error");
        }
    });
}
exports.delete_scheduled_migration = delete_scheduled_migration;

function fetch_source_and_destination_migration_platforms(req, res, next) {
    migration_type = req.body.migration_type;
    // var query_to_execute = "SELECT * FROM _cb_mig_menu_master WHERE migration_type='" + migration_type + "' and type='" + type + "';"
    var query_to_execute = "SELECT * FROM _cb_mig_menu_master WHERE migration_type='" + migration_type + "';"

    config.query(query_to_execute, function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send("Error");
        }
    });
}
exports.fetch_source_and_destination_migration_platforms = fetch_source_and_destination_migration_platforms;

function c2cSSHKeyOperations(req, res, next) {
    var key_name = null;
    var private_key = null;
    var public_key = null;
    var group_id = null;
    var account_name = null;
    var cloud_name = null;
    var region = null;
    var zone = null;
    var actions = null;
    var key_id = null;
    var ref = null;

    if (req.body.key_name) {
        key_name = req.body.key_name;
    }
    if (req.body.private_key) {
        private_key = req.body.private_key;
    }
    if (req.body.public_key) {
        public_key = req.body.public_key;
    }
    if (req.body.group_id) {
        group_id = req.body.group_id;
    }
    if (req.body.account_name) {
        account_name = req.body.account_name;
    }
    if (req.body.cloud_name) {
        cloud_name = req.body.cloud_name;
    }
    if (req.body.region) {
        region = req.body.region;
    }
    if (req.body.zone) {
        zone = req.body.zone;
    }
    if (req.body.actions) {
        actions = req.body.actions;
    }
    if (req.body.key_id) {
        key_id = parseInt(req.body.key_id);
    }
    if (req.body.ref) {
        ref = req.body.ref;
    }
    var request_data = {
        "key_name": key_name,
        "private_key": private_key,
        "public_key": public_key,
        "group_id": group_id,
        "account_name": account_name,
        "cloud_name": cloud_name,
        "region": region,
        "zone": zone,
        "actions": actions,
        "ref": ref,
        "key_id": key_id
    }


    var options = {
        method: 'POST',
        url: migration_ip_linux + "c2c-migration/ssh-key-operation/",
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: request_data,
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
exports.c2cSSHKeyOperations = c2cSSHKeyOperations;