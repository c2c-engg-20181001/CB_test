var crypto = require('crypto');
var config = require('../../config');
var cron = require('node-cron');
var request = require('request');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';

var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var migration_ip_windows = file.windows_migration_url
var node_url = file.node_url

// var migration_ip_linux = "http://192.168.1.229/migration-studio/"
// var migration_ip_windows = "http://192.168.1.111/migration-studio/"
// var node_url = "http://192.168.1.182:3001/api/v1/" 

var source_details = null;
var dest_details = null;
var user_id = null;

function userMigrationallJobDetails(req, res, next) {
    var user_id = null;
    var job_id = null;
    var job_status = null;

    if (req.query.id1 != null) {
        user_id = parseInt(req.query.id1);
    }
    if (req.query.id2) {
        job_status = req.query.id2;
    }
    if (req.query.id3) {
        //job_status = parseInt(req.query.id3);
    }
    config.query("select * from cb_mig_sp_get_complete_migration_job_details(" + user_id + ", '" + job_status + "' ,'select');", function (err, result) {
        if (!err) {
            console.log(result);
            //res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.userMigrationallJobDetails = userMigrationallJobDetails;

async function getScheduledJobDetailsD2C(req, res, next, callback) {
    //res.header("access-control-allow-origin", "*");
    var user_id = null;
    var schedule_date = null;
    console.log("API Hitted");
    cron.schedule('00 0-23 * * *', () => {
        console.log("chron started");
        config.query("select * from cb_mig_sp_get_schedule_details('select');", async function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details != null) {
                rowcount = result.rows[0].cb_mig_sp_get_schedule_details.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                //var index = 0;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details) {
                    console.log(item);
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");

                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);

                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    // console.log(typeof sched_date_time)

                    current_date = new Date()

                    //Adding 5 hours 30 mins when deployed on GCP
                    /*current_date.setMinutes(current_date.getMinutes() + 330);
                    current_date = new Date(current_date);*/

                    console.log("Current date " + current_date)
                    // console.log(typeof current_date)
                    //var source_details = null;
                    //var dest_details = null;



                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;
                        if (item.migration_type == 'D2C' && item.is_success == null) {
                            console.log("Initiating the process of migration for the D2C")
                            //start migration for the d2c
                            source_details = item.source_details;
                            dest_details = item.dest_details;
                            schedule_date = item.datetime;
                            token = null;
                            var data = "product_id=" + user_id;
                            var options = {
                                method: 'POST',
                                url: node_url + 'get_token',
                                headers:
                                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: data,
                                json: true
                            };
                            migrationJobD2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback);

                        }
                    }
                    else {
                        console.log("date are different")
                    }
                    //index = index + 1;
                }


            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    //await res.send("Scheduling migration cron started for d2c");

}
exports.getScheduledJobDetailsD2C = getScheduledJobDetailsD2C;

function migrationJobD2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback) {
    request(options, async function (error, response, body) {
        token = body.token;
        if (token != undefined) {

            console.log("schedule_id=" + schedule_id);
            console.log("token=" + token);
            console.log("source_details=" + source_details);
            console.log("dest_details=" + dest_details);
            console.log("schedule_date=" + schedule_date);
            console.log("user_id=" + user_id);

            await callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
        }
        else {
            console.log("token is not defined");
            console.log(token);
            console.log("schedule_id=" + schedule_id);
            console.log("token=" + token);
            console.log("source_details=" + source_details);
            console.log("dest_details=" + dest_details);
            console.log("schedule_date=" + schedule_date);
            console.log("user_id=" + user_id);
            await callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
        }
    });
}

function updateErrorMessage(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    console.log("token error");
    config.query("select * from cb_mig_sp_schedular_error(" + schedule_id + ", 'Token Generation Failed', 'error_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
        }
    });
}
exports.updateErrorMessage = updateErrorMessage;

function updateErrorMessageJobDetails(req, res, next, body, schedule_id, callback) {
    console.log("JobId error");

    var schedule_id = schedule_id;
    var command = "select * from cb_mig_sp_schedular_error(" + schedule_id + ",'" + body + "', 'error_message', 'info');"
    console.log("command", command)
    config.query(command, function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
        }
    });
}
exports.updateErrorMessageJobDetails = updateErrorMessageJobDetails;

function jobIdCreationD2C(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null;
    var migrationUrl = null;
    dbType = source_details.dbType;

    if (dbType == "ORACLE") {
        var source_details = {
            "username": source_details.username,
            "host": source_details.host,
            "password": source_details.password,
            "port": source_details.port,
            "schemas": source_details.databases,
            "service_id": source_details.service_id,
        };
    }
    else {
        var source_details = {
            "username": source_details.username,
            "host": source_details.host,
            "password": source_details.password,
            "port": source_details.port,
            "databases": source_details.databases,
            "ssl": source_details.ssl,
        };
    }
    var data = {
        "source": source_details,
        "destination": dest_details,
        "token": token
    }
    if (dbType == 'MySQL')
        migrationUrl = migration_ip_linux + 'd2c-migration/mysql/migration';
    else if (dbType == 'MSSQL')
        migrationUrl = migration_ip_windows + 'd2c-migration/mssql/migration';
    else if (dbType == 'PostgreSQL')
        migrationUrl = migration_ip_linux + 'd2c-migration/postgresql/migration'
    else if (dbType == 'ORACLE')
        migrationUrl = migration_ip_windows + 'd2c-migration/oracle/migration'
    else if (dbType == 'MongoDB')
        migrationUrl = migration_ip_linux + 'd2c-migration/mongodb/migration'
    else
        console.log("Unexpected database type for d2c migration");



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
    console.log("============Inside JObId Creation=============")
    console.log("schedule_id=" + schedule_id);
    console.log("token=" + token);
    console.log("source_details=" + source_details);
    console.log("dest_details=" + dest_details);
    //console.log("schedule_date=" + schedule_date);
    //console.log("user_id=" + user_id);
    request(options, async function (error, response, body) {

        console.log("body", body)
        console.log("error", error)
        console.log("response", response)

        if (body != undefined) {
            if (body.job_id != undefined) {
                job_id = body.job_id;
                if (job_id != undefined) {
                    console.log(body);
                    await callback(body, dbType, false);
                }
            }
            else {
                console.log("job_id is not defined");

                var error = body.error;
                if (error != undefined) {
                    if (error.error_msg != undefined) {
                        error = error.error_msg
                    }
                    else if (error.error_message != undefined) {
                        error = error.error_message
                    }
                    else if (error.message != undefined) {
                        error = error.message
                    }
                    else if (Array.isArray(error)) {
                        error = error[0].error.keys + " " + error[0].error.message;
                    }
                    console.log("===error before replacement" + error);
                    error = error.replace("'", "")
                    console.log("===error after replacement" + error);

                    await callback(error, dbType, true);
                }
                else if (error == undefined && typeof (body == "string")) {
                    await callback(body, dbType, true);
                }
                else {
                    await callback("Error inscheduling migration", dbType, true);
                }
            }
        }
        else {
            await callback(error, null, true);
        }
    });
}
exports.jobIdCreationD2C = jobIdCreationD2C;

function migrationAllDnDJobDetailsD2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, dbType, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_cloud = source_details["host"];
    var destination_cloud = dest_details["host"];
    var object_name = source_details["dbType"];
    var migration_type = 'D2C'; //d2c
    var error_message = '';
    var created_date = schedule_date; //now
    var topology_name = '';
    config.query("select * from cb_mig_sp_post_dnd_complete_migration_job_details('" + job_id + "','" + job_status + "'," + user_id + ",'" + source_cloud + "','" + destination_cloud + "','" + object_name + "','" + migration_type + "','" + error_message + "','" + created_date + "','" + topology_name + "', 'insert', 'info');", async function (err, result) {
        if (!err) {
            console.log("Inside migrationAllDnDJobDetailsD2c");
            await callback(result, false);
        }
        else {
            console.log('Error while performing Query.', err);
            await callback(err, true);
        }
    });
}
exports.migrationAllDnDJobDetailsD2C = migrationAllDnDJobDetailsD2C;

async function updateCompleteSuccessStatusD2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    await config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", async function (err, result) {
        if (!err) {
            console.log("Inside updateCompleteSuccessStatusD2c");
            await callback(result, false)
        }
        else {
            console.log('Error while performing Query.', err);
            await callback(err, true)
        }
    });
}
exports.updateCompleteSuccessStatusD2C = updateCompleteSuccessStatusD2C;

function getScheduledJobDetailsV2C(req, res, next, callback) {
    //res.header("access-control-allow-origin", "*");
    cron.schedule('00 0-23 * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_V2C('select');", function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details_v2c != null) {

                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_v2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details_v2c) {
                    console.log("id==" + item.id);
                    console.log("time===" + item.datetime);
                    console.log("temp");
                    //Converting the string  to date 
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");

                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);

                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    console.log(typeof sched_date_time)

                    current_date = new Date()
                    console.log("Current date " + current_date)
                    console.log(typeof current_date)
                    //var source_details = null;
                    //var dest_details = null;
                    var schedule_date = null;
                    schedule_date = dt_tm;
                    var user_id = null;

                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;
                        if (item.migration_type == 'V2C' && item.is_success == null) {
                            console.log("Initiating the process of migration for the V2C")
                            //start migration for the d2c
                            var source_details = item.source_details;
                            var dest_details = item.dest_details;

                            var token = null;

                            var data = "product_id=" + user_id;
                            var options = {
                                method: 'POST',
                                url: node_url + 'get_token',
                                headers:
                                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: data,
                                json: true
                            };
                            migrationJobV2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback);
                        }
                        else {
                            console.log("migration type or is_success data is wrong.")
                        }
                    }
                    else {
                        console.log("date are different");
                    }
                }
            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    //res.send("Scheduling migration cron started for v2c");
}
exports.getScheduledJobDetailsV2C = getScheduledJobDetailsV2C;
function migrationJobV2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback) {
    request(options, function (error, response, body) {
        token = body.token;
        if (token != undefined) {
            //jobidgeneration();
            console.log("Token==" + token);
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
        }
        else {
            console.log("token is not defined");
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
        }
    });
}
async function jobIdCreation_V2C(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null;
    var url = null;

    if (source_details.vmType == 'XenServer') {
        await console.log('XenServer');
        source_details = {
            "uuid": source_details.uuid,
            "host": source_details.host,
            "username": source_details.username,
            "password": source_details.password,
            "os_name": source_details.os_name,
            "userGroup": source_details.userGroup,
        }
        if (dest_details.cloud_name == 'OTC') {
            v2c_action = 'xenserver-to-otc/'
        }
        else if (dest_details.cloud_name == 'Alibaba') {
            // v2c_action = 'xenserver/vm-migrate';
            v2c_action = 'xenserver-to-apsara-stack/';
        }
        url = migration_ip_linux + 'v2c-migration/' + v2c_action;
    }
    else if (source_details.vmType == 'KVM') {
        await console.log('KVM');
        source_details = {
            "uuid": source_details.uuid,
            "host": source_details.host,
            "username": source_details.username,
            "password": source_details.password,
            "os_name": source_details.os_name,
            "userGroup": source_details.userGroup,
        }
        if (dest_details.cloud_name == 'OTC') {
            v2c_action = 'kvm-to-otc/'
        }
        else if (dest_details.cloud_name == 'Alibaba') {
            v2c_action = 'kvm-to-apsara-stack/';
            // v2c_action = 'kvm/vm-migrate';
        }
        url = migration_ip_linux + 'v2c-migration/' + v2c_action;
    }
    else if (source_details.vmType == 'VMWare') {
        await console.log("In VMWare");
        if (dest_details.cloud_name == 'OTC') {
            source_details = {
                "username": source_details.src_vmware_username,
                "vm_name": source_details.src_vm_name,
                "password": source_details.src_vmware_password,
                "host": source_details.src_vmware_ip_address,
                "os_name": source_details.os_name,
                "userGroup": source_details.userGroup,
            };
            v2c_action = 'vmware-to-otc/';
        }
        else if (dest_details.cloud_name == 'Alibaba') {
            v2c_action = 'vmware-to-apsara-stack/';
            source_details = {
                "src_vmware_username": source_details.src_vmware_username,
                "src_vm_name": source_details.src_vm_name,
                "src_vmware_password": source_details.src_vmware_password,
                "src_vmware_ip_address": source_details.src_vmware_ip_address,
                "os_name": source_details.os_name,
                "userGroup": source_details.userGroup,
            };
        }
        url = migration_ip_linux + 'v2c-migration/' + v2c_action;
    }
    else if (source_details.vmType == 'Hyper-V') {
        await console.log("In HyperV");
        v2c_action = 'hyperv-to-apsara-stack/';
        source_details = {
            "vm_name": source_details.vm_name,
            "src_host": source_details.src_host,
            "src_username": source_details.src_username,
            "src_password": source_details.src_password,
            "domain": source_details.domain,
            "os_name": source_details.os_name,
            "userGroup": source_details.userGroup,
        };
        url = migration_ip_windows + 'v2c-migration/' + v2c_action;
    }

    var data = {
        "source": source_details,
        "destination": dest_details,
        "token": token
    }

    var options = {
        method: 'POST',
        url: url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        if (body != undefined) {
            if (body.job_id != undefined) {
                var job_id = body.job_id;
                if (job_id != undefined) {
                    console.log(body);
                    callback(body, false)
                }
            }
            else {
                var error = body.error;
                console.log(body)
                if (error != undefined) {
                    if (error.error_msg != undefined) {
                        error = error.error_msg
                    }
                    else if (error.error_message != undefined) {
                        error = error.error_message
                    }
                    else if (error.message != undefined) {
                        error = error.message
                    }
                    else if (Array.isArray(error)) {
                        error = error[0].error.keys + " " + error[0].error.message;
                    }
                    console.log("job_id is not defined");
                    error = error.replace("'", "")
                    callback(error, true)
                }
                else if (error == undefined && typeof (body) == "string") {
                    callback(body, true)
                }
                else {
                    callback("Error in scheduling migration", true)
                }
            }
        }
        else {
            callback(error, true);
        }
    });
}
exports.jobIdCreation_V2C = jobIdCreation_V2C;

function migrationAllDnDJobDetails_V2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_host = "";
    var destination_cloud = dest_details["cloud_name"];
    var object_name = source_details['src_vm_name'];
    var migration_type = 'V2C';
    var error_message = "";
    var created_date = schedule_date;
    var topology_name = "";

    if (source_details.vmType == 'XenServer' || source_details.vmType == 'KVM') {
        source_host = source_details["host"]
    }
    else {
        source_host = source_details["src_vmware_ip_address"];
    }

    config.query("select * from cb_mig_sp_post_dnd_complete_migration_job_details('" + job_id + "','" + job_status + "'," + user_id + ",'" + source_host + "','" + destination_cloud + "','" + object_name + "','" + migration_type + "','" + error_message + "','" + created_date + "','" + topology_name + "', 'insert', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false);
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true);
        }
    });
}
exports.migrationAllDnDJobDetails_V2C = migrationAllDnDJobDetails_V2C;

function updateCompleteSuccessStatusV2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
            console.log("updation fails")
        }
    });
}
exports.updateCompleteSuccessStatusV2C = updateCompleteSuccessStatusV2C;

async function getScheduledJobDetailsC2C(req, res, next, callback) {
    //var source_details = null;
    //var dest_details = null;
    var schedule_date = null;
    var user_id = null;
    //await res.header("access-control-allow-origin", "*");
    cron.schedule('00 0-23 * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_c2c('select');", async function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details_c2c != null) {
                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_c2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduling migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details_c2c) {
                    console.log("id==" + item.id);
                    console.log("time===" + item.datetime);
                    //Converting the string  to date 
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");
                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);
                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    //console.log(typeof sched_date_time)

                    current_date = new Date()
                    console.log("Current date " + current_date)
                    //console.log(typeof current_date)


                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;

                        if (item.migration_type == 'C2C' && item.is_success == null) {
                            console.log("Initiating the process of migration for the C2C");
                            source_details = item.source_details;
                            dest_details = item.dest_details;
                            topology_name = item.zone;
                            is_rsync = item.is_rsync;
                            schedule_date = item.datetime;
                            create_instance = item.dest_details.create_instance;

                            console.log(typeof (is_rsync));
                            console.log(is_rsync);


                            migrationJobC2c(is_rsync, schedule_id, source_details, dest_details, schedule_date, user_id, topology_name, create_instance, callback);
                        }
                        else {
                            console.log("migration type or is_success data is wrong.");
                        }
                    }
                    else {
                        console.log("date are different");
                    }
                }

            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    //res.send("Scheduling migration cron started for c2c");
}
exports.getScheduledJobDetailsC2C = getScheduledJobDetailsC2C;

async function migrationJobC2c(is_rsync, schedule_id, source_details, dest_details, schedule_date, user_id, topology_name, create_instance, callback) {

    var token = null;
    var user_id = user_id;
    var data = "product_id=" + user_id;
    var options = {
        method: 'POST',
        url: node_url + 'get_token',
        headers:
            { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data,
        json: true
    };

    await request(options, async function (error, response, body) {
        var vswitch_id = null;
        var security_group = null;

        token = body.token;
        if (token != undefined) {
            console.log("Token==" + token);
            await callback(is_rsync, schedule_id, token, source_details, dest_details, schedule_date, user_id, security_group, vswitch_id, topology_name, false);
        }
        else {
            console.log("token is not defined");
            await callback(is_rsync, schedule_id, token, source_details, dest_details, schedule_date, user_id, security_group, vswitch_id, topology_name, true);
        }
    });
}

function get_vm_power_state(req, res, next, is_rsync, source_details, callback) {
    var p_mode = 'get_vm_details'
    var tenant_id = source_details.tenant_id;
    var source_cloud = source_details.sourcecloud;
    var power_state_on = false;
    var userGroup = source_details.userGroup
    var body = "";
    config.query("select * from cb_mig_sp_get_credentials_and_vm_details2('" + tenant_id + "','" + p_mode + "','" + source_cloud + "','" + userGroup + "','info');fetch all in \"info\";", function (err, result) {
        if (!err) {
            console.log(result);

            if (is_rsync) {
                for (var v = 0; v < result[1].rows.length; v++) {
                    if (result[1].rows[v].vm_name == source_details.vm_name) {
                        power_state_on = true
                        source_details.vm_host_ip = result[1].rows[v].ip
                        break
                    }
                }
            }
            else {
                power_state_on = true
            }
            console.log("power_state_on in callback", power_state_on)
            if (power_state_on != true) {
                body = 'Migration not started because ' + source_details.vm_name + ' VM is in stopped state'
            }
            callback(power_state_on, body, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, result, true)
            console.log("updation fails")
        }
    });
}
exports.get_vm_power_state = get_vm_power_state;

async function jobIdCreation_C2C(req, res, next, is_rsync, schedule_id, token, source_details, dest_details, security_group, vswitch_id, user_id, callback) {
    var job_id = null;
    var c2c_action = null;
    var url = null;
    var source_details_to_check_vm_state = source_details
    if (!is_rsync) {
        console.log("is rsync is false");
        console.log("In Openstack");
        if (source_details.sourcecloud == 'Azure' && source_details.destinationcloud == "Alibaba") {
            await console.log('In azure');
            c2c_action = 'azure-to-alibaba-migration-new';
        }
        else if (source_details.sourcecloud == 'Openstack' && source_details.destinationcloud == "Alibaba") {
            await console.log("In Openstack");
            c2c_action = 'openstack-to-alibaba-migration';
            source_details = {
                "instance_id": source_details.instance_id,
                "auth_url": source_details.auth_url,
                "destinationcloud": source_details.destinationcloud,
                "domain_id": source_details.domain_id,
                "password": source_details.password,
                "sourcecloud": source_details.sourcecloud,
                "username": source_details.username,
                "instance_name": source_details.vm_name,
                "zone_id": source_details.zone_id,
                "os_name": source_details.os_name,
                "userGroup": source_details.userGroup
            };
        }
        else if (source_details.sourcecloud == 'Google' && source_details.destinationcloud == "Alibaba") {
            await console.log("In Google");
            c2c_action = 'google-to-alibaba-migration';
            source_details = {
                "instance_id": source_details.instance_id,
                "sourcecloud": source_details.sourcecloud,
                "instance_name": source_details.vm_name,
                "destinationcloud": source_details.destinationcloud,
                "zone": source_details.zone,
                "credentials": source_details.credentials,
                "zone_id": source_details.zone_id,
                "os_name": source_details.os_name,
                "userGroup": source_details.userGroup
            };
        }
        else if (source_details.sourcecloud == 'Azure' && source_details.destinationcloud == "OTC") {
            await console.log('In azure');
            c2c_action = 'azure-to-otc-migration-new';
        }
        else if (source_details.sourcecloud == 'AWS' && source_details.destinationcloud == "OTC") {
            await console.log("In AWS");
            c2c_action = 'aws-to-opentelekom-migration';
            source_details = {
                "instance_id": source_details.instance_id,
                "sourcecloud": source_details.sourcecloud,
                "instance": source_details.instance,
                "destinationcloud": source_details.destinationcloud,
                "region_id": source_details.region_id,
                "access_key": source_details.access_key,
                "secret_key": source_details.secret_key,
                "instance_id": source_details.instance_id,
                "os_name": source_details.os_name,
                "userGroup": source_details.userGroup
            };
        }
        url = migration_ip_linux + 'c2c-migration/' + c2c_action + '/';
    }
    else {
        console.log("is_rsync is true")
        if (source_details.sourcecloud == 'Azure' && source_details.destinationcloud == "Alibaba") {
            await console.log("In Azure");
            source_details = {
                "instance_id": source_details.instance_id,
                "sourcecloud": source_details.sourcecloud,
                "destinationcloud": source_details.destinationcloud,
                "vm_username": source_details.vm_username,
                "vm_host_ip": source_details.vm_host_ip,
                "vm_os_type": source_details.vm_os_type,
                "ssh_key": source_details.ssh_key,
                "instance": source_details.vm_name,
                "zone_id": source_details.zone_id,
                "cloud": source_details.cloud,
                "os_name": source_details.os_name,
                "data_disk": source_details.data_disk,
                "user_id": user_id,
                "key_pair_name": source_details.key_pair_name,
                "userGroup": source_details.userGroup,
                "account_name": source_details.account_name
            };
        }
        else if (source_details.sourcecloud == 'Google' && source_details.destinationcloud == "Alibaba") {
            await console.log("In Google");
            source_details = {
                "instance_id": source_details.instance_id,
                "sourcecloud": source_details.sourcecloud,
                "destinationcloud": source_details.destinationcloud,
                "vm_username": source_details.vm_username,
                "vm_host_ip": source_details.vm_host_ip,
                "vm_os_type": source_details.vm_os_type,
                "ssh_key": source_details.ssh_key,
                "instance": source_details.vm_name,
                "cloud": source_details.cloud,
                "zone_id": source_details.zone_id,
                "os_name": source_details.os_name,
                "data_disk": source_details.data_disk,
                "user_id": user_id,
                "key_pair_name": source_details.key_pair_name,
                "userGroup": source_details.userGroup,
                "account_name": source_details.account_name
            };
        }
        else if (source_details.sourcecloud == 'AWS' && source_details.destinationcloud == "Alibaba") {
            await console.log("AWS");
            source_details = {
                "instance_id": source_details.instance_id,
                "sourcecloud": source_details.sourcecloud,
                "destinationcloud": source_details.destinationcloud,
                "vm_username": source_details.vm_username,
                "vm_host_ip": source_details.vm_host_ip,
                "vm_os_type": source_details.vm_os_type,
                "ssh_key": source_details.ssh_key,
                "instance": source_details.vm_name,
                "zone_id": source_details.zone_id,
                "cloud": source_details.cloud,
                "os_name": source_details.os_name,
                "data_disk": source_details.data_disk,
                "user_id": user_id,
                "key_pair_name": source_details.key_pair_name,
                "userGroup": source_details.userGroup,
                "account_name": source_details.account_name
            };
        }
        url = migration_ip_linux + 'p2c-migration/physical-to-alibaba-new/';
    }

    if (source_details.sourcecloud == 'AWS' && source_details.destinationcloud == "OTC") {
        var data = {
            "source": source_details,
            "destination": dest_details,
            "token": token
        }
    }
    else {
        var data = {
            "source_cloud": source_details,
            "destination_cloud": dest_details,
            "token": token
        }
    }


    var options = {
        method: 'POST',
        url: url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };


    await request(options, async function (error, response, body) {
        console.log(body)
        console.log(error)
        console.log(body.error)
        if (body != undefined) {
            if (body.job_id != undefined) {
                job_id = body.job_id;
                if (job_id != undefined) {

                    console.log(body);
                    await callback(body, false)
                }
            }
            else {
                var error = body.error;
                if (error != undefined) {
                    if (error.error_msg != undefined) {
                        error = error.error_msg
                    }
                    else if (error.error_message != undefined) {
                        error = error.error_message
                    }
                    else if (error.message != undefined) {
                        error = error.message
                    }
                    else if (Array.isArray(error)) {
                        error = error[0].error.keys + " " + error[0].error.message;
                    }
                    console.log(error)
                    console.log("job_id is not defined");
                    error = error.replace("'", "")
                    await callback(error, true)
                }
                else if (error == undefined && typeof (body) == "string") {
                    await callback(body, true)
                }
                else {
                    await callback("Error in scheduling migration", true)
                }
            }
        }
        else {
            await callback(error, true);
        }
    });

}
exports.jobIdCreation_C2C = jobIdCreation_C2C;

function updateCompleteSuccessStatusC2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
            console.log("updation fails")
        }
    });
}
exports.updateCompleteSuccessStatusC2C = updateCompleteSuccessStatusC2C;

function migrationAllDnDJobDetails_C2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, topology_name, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_host = source_details["sourcecloud"];
    var destination_cloud = source_details["destinationcloud"];
    var object_name = source_details['vm_name'];
    var migration_type = 'C2C';
    var error_message = "";
    var created_date = schedule_date;


    config.query("select * from cb_mig_sp_post_dnd_complete_migration_job_details('" + job_id + "','" + job_status + "'," + user_id + ",'" + source_host + "','" + destination_cloud + "','" + object_name + "','" + migration_type + "','" + error_message + "','" + created_date + "','" + topology_name + "', 'insert', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false);
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true);
        }
    });
}
exports.migrationAllDnDJobDetails_C2C = migrationAllDnDJobDetails_C2C;

function getScheduledJobDetailsV2V(req, res, next, callback) {
    //res.header("access-control-allow-origin", "*");
    cron.schedule('00 0-23 * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_V2V('select');", function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details_v2v != null) {

                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_v2v.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details_v2v) {
                    console.log("id==" + item.id);
                    console.log("time===" + item.datetime);
                    console.log("temp");
                    //Converting the string  to date 
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");

                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);

                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    console.log(typeof sched_date_time)

                    current_date = new Date()
                    console.log("Current date " + current_date)
                    console.log(typeof current_date)
                    //var source_details = null;
                    //var dest_details = null;
                    var schedule_date = null;
                    schedule_date = dt_tm;
                    var user_id = null;

                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;
                        if (item.migration_type == 'V2V' && item.is_success == null) {
                            console.log("Initiating the process of migration for the V2V")
                            //start migration for the d2c
                            var source_details = item.source_details;
                            var dest_details = item.dest_details;

                            var token = null;

                            var data = "product_id=" + user_id;
                            var options = {
                                method: 'POST',
                                url: node_url + 'get_token',
                                headers:
                                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: data,
                                json: true
                            };
                            migrationJobV2V(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback);
                        }
                        else {
                            console.log("migration type or is_success data is wrong.")
                        }
                    }
                    else {
                        console.log("date are different");
                    }
                }
            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    //res.send("Scheduling migration cron started for v2c");
}
exports.getScheduledJobDetailsV2V = getScheduledJobDetailsV2V;

function migrationJobV2V(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback) {
    request(options, function (error, response, body) {
        token = body.token;
        if (token != undefined) {
            //jobidgeneration();
            console.log("Token==" + token);
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
        }
        else {
            console.log("token is not defined");
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
        }
    });
}
async function jobIdCreation_V2V(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null;
    var url = null;
    var action = null;

    if (source_details.vmType.toLowerCase() == 'vmware' && dest_details.vmType.toLowerCase() == 'hyper-v') {
        await console.log('VMware to Hyper-V');
        url = migration_ip_windows + "v2v-migration/vmware-to-hyperv"
        action = "vmware-to-hyperv"
    }
    else if (source_details.vmType.toLowerCase() == 'hyper-v' && dest_details.vmType.toLowerCase() == 'vmware') {
        await console.log('Hyper-V to VMware');
        url = migration_ip_windows + "v2v-migration/hyperv-to-vmware"
        action = "hyperv-to-vmware"
    }

    // url = migration_ip_linux + 'v2v-migration/' + v2c_action;
    var data = {
        "action": action,
        "source": source_details,
        "destination": dest_details,
        "token": token
    }

    var options = {
        method: 'POST',
        url: url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        var job_id = body.job_id;
        if (job_id != undefined) {
            console.log(body);
            callback(body, false)
        }
        else {
            var error = body.error;
            if (error != undefined) {
                if (error.error_msg != undefined) {
                    error = error.error_msg
                }
                else if (error.error_message != undefined) {
                    error = error.error_message
                }
                else if (error.message != undefined) {
                    error = error.message
                }
                else if (Array.isArray(error)) {
                    error = error[0].error.keys + " " + error[0].error.message;
                }
                console.log("job_id is not defined");
                callback(error, true)
            }
            else if (error == undefined && typeof (body) == "string") {
                callback(body, true)
            }
            else {
                callback("Error in scheduling migration", true)
            }
        }
    });
}
exports.jobIdCreation_V2V = jobIdCreation_V2V;

function updateCompleteSuccessStatusV2V(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
            console.log("updation fails")
        }
    });
}
exports.updateCompleteSuccessStatusV2V = updateCompleteSuccessStatusV2V;


// scheduling code for s2c 
function getScheduledJobDetailsS2C(req, res, next, callback) {
    //res.header("access-control-allow-origin", "*");
    cron.schedule('00 0-23 * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_s2c('select');", function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details_s2c != null) {

                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_s2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details_s2c) {
                    console.log("id==" + item.id);
                    console.log("time===" + item.datetime);
                    console.log("temp");
                    //Converting the string  to date 
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");

                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);

                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    console.log(typeof sched_date_time)

                    current_date = new Date()
                    console.log("Current date " + current_date)
                    console.log(typeof current_date)
                    //var source_details = null;
                    //var dest_details = null;
                    var schedule_date = null;
                    schedule_date = dt_tm;
                    var user_id = null;

                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;
                        if (item.migration_type == 'S2C' && item.is_success == null) {
                            console.log("Initiating the process of migration for the S2C")
                            //start migration for the d2c
                            var source_details = item.source_details;
                            var dest_details = item.dest_details;

                            var token = null;

                            var data = "product_id=" + user_id;
                            var options = {
                                method: 'POST',
                                url: node_url + 'get_token',
                                headers:
                                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: data,
                                json: true
                            };
                            migrationJobS2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback);
                        }
                        else {
                            console.log("migration type or is_success data is wrong.")
                        }
                    }
                    else {
                        console.log("date are different");
                    }
                }
            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    //res.send("Scheduling migration cron started for v2c");
}
exports.getScheduledJobDetailsS2C = getScheduledJobDetailsS2C;

function migrationJobS2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback) {
    request(options, function (error, response, body) {
        token = body.token;
        if (token != undefined) {
            //jobidgeneration();
            console.log("Token==" + token);
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
        }
        else {
            console.log("token is not defined");
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
        }
    });
}
async function jobIdCreation_S2C(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null;
    var url = null;

    // decipher_cred = null
    // dec_cred = null
    // decipher_cred = crypto.createDecipher(algorithm, password)
    // dec_cred = decipher_cred.update(source_details.secret_key, 'hex', 'utf8')
    // dec_cred += decipher_cred.final('utf8');
    // source_details.secret_key = dec_cred

    // decipher_cred = null
    // dec_cred = null
    // decipher_cred = crypto.createDecipher(algorithm, password)
    // dec_cred = decipher_cred.update(dest_details.secret_key, 'hex', 'utf8')
    // dec_cred += decipher_cred.final('utf8');
    // dest_details.secret_key = dec_cred

    url = migration_ip_linux + 's2c-migration/opensds-object-migration'
    var data = {
        "source_cloud": source_details,
        "destination_cloud": dest_details,
        "migration_type": "S2C",
        "token": token
    }
    var options = {
        method: 'POST',
        url: url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        var job_id = body.job_id;
        if (job_id != undefined) {
            console.log(body);
            callback(body, false)
        }
        else {
            var error = body.error;
            if (error != undefined) {
                if (error.error_msg != undefined) {
                    error = error.error_msg
                }
                else if (error.error_message != undefined) {
                    error = error.error_message
                }
                else if (error.message != undefined) {
                    error = error.message
                }
                else if (Array.isArray(error)) {
                    error = error[0].error.keys + " " + error[0].error.message;
                }
                console.log("job_id is not defined");
                callback(error, true)
            }
            else if (error == undefined && typeof (body) == "string") {
                callback(body, true)
            }
            else {
                callback("Error in scheduling migration", true)
            }
        }
    });
}
exports.jobIdCreation_S2C = jobIdCreation_S2C;

function updateCompleteSuccessStatusS2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
            console.log("updation fails")
        }
    });
}
exports.updateCompleteSuccessStatusS2C = updateCompleteSuccessStatusS2C;

function getScheduledJobDetailsP2C(req, res, next, callback) {
    //res.header("access-control-allow-origin", "*");
    cron.schedule('00 0-23 * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_P2C('select');", function (err, result) {
            if (!err && result.rows[0].cb_mig_sp_get_schedule_details_p2c != null) {

                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_p2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (item of result.rows[0].cb_mig_sp_get_schedule_details_p2c) {
                    console.log("id==" + item.id);
                    console.log("time===" + item.datetime);
                    console.log("temp");
                    //Converting the string  to date 
                    dt_tm = item.datetime;
                    res = dt_tm.split(" ");

                    dt = res[0];
                    dt_temp = dt.split('-');
                    day = parseInt(dt_temp[2]);
                    month = parseInt(dt_temp[1]);
                    year = parseInt(dt_temp[0]);

                    tm = res[1];
                    tm_temp = tm.split(':');
                    hrs = parseInt(tm_temp[0]);
                    min = parseInt(tm_temp[1]);
                    sec_tz = tm_temp[2];
                    sec_temp = sec_tz.split('+');
                    sec = parseInt(sec_temp[0]);
                    ms = parseInt(0);

                    sched_date_time = new Date(year, month - 1, day, hrs, min, sec, ms)
                    console.log("date from db--" + sched_date_time)
                    console.log(typeof sched_date_time)

                    current_date = new Date()
                    console.log("Current date " + current_date)
                    console.log(typeof current_date)
                    var schedule_date = null;
                    schedule_date = dt_tm;
                    var user_id = null;

                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours()) && item.is_deleted == false) {
                        console.log("date are same")
                        var schedule_id = item.id;
                        user_id = item.user_id;
                        if (item.migration_type == 'P2C' && item.is_success == null) {
                            console.log("Initiating the process of migration for the P2C")
                            //start migration for the p2c
                            var source_details = item.source_details;
                            var dest_details = item.dest_details;

                            var token = null;

                            var data = "product_id=" + user_id;
                            var options = {
                                method: 'POST',
                                url: node_url + 'get_token',
                                headers:
                                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: data,
                                json: true
                            };
                            migrationJobP2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback);
                        }
                        else {
                            console.log("migration type or is_success data is wrong.")
                        }
                    }
                    else {
                        console.log("date are different");
                    }
                }
            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
}
exports.getScheduledJobDetailsP2C = getScheduledJobDetailsP2C;

function migrationJobP2C(options, schedule_id, source_details, dest_details, schedule_date, user_id, callback) {
    request(options, function (error, response, body) {
        token = body.token;
        if (token != undefined) {
            //jobidgeneration();
            console.log("Token==" + token);
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
        }
        else {
            console.log("token is not defined");
            callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
        }
    });
}

async function jobIdCreation_P2C(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null
    var url = null

    if ((source_details.platform.toLowerCase() == 'baremetal' || source_details.platform.toLowerCase() == 'packet') && dest_details.cloud_name.toLowerCase() == "alibaba") {
        source_details = {
            "instance_name": source_details.instance_name,
            "vm_username": source_details.vm_username,
            "vm_host_ip": source_details.vm_host_ip,
            "vm_os_type": source_details.vm_os_type,
            "os_name": source_details.os_name,
            "platform": source_details.platform,
            "password": source_details.password,
            "ssh_key": source_details.ssh_key,
            "key_pair_name": source_details.key_pair_name,
            "userGroup": source_details.userGroup,
            "user_id": source_details.user_id

        }

        if (source_details.platform.toLowerCase() == 'baremetal') {
            if (source_details.key_pair_name == "unknown") {
                decipher = null
                dec = null
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.password, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.password = dec
            }
            else {
                decipher = null
                dec = null
                decipher = crypto.createDecipher(algorithm, password)
                dec = decipher.update(source_details.ssh_key, 'hex', 'utf8')
                dec += decipher.final('utf8');
                source_details.ssh_key = dec
            }
        }

        url = migration_ip_linux + "p2c-migration/baremetal-to-alibaba/"
    }

    console.log("data", data)

    var data = {
        "source": source_details,
        "destination": dest_details,
        "token": token
    }

    var options = {
        method: 'POST',
        url: url,
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        if (body != undefined) {
            console.log("body", body)
            if (body.job_id != undefined) {
                var job_id = body.job_id;
                if (job_id != undefined) {
                    console.log(body);
                    callback(body, false)
                }
            }
            else {
                var error = body.error;
                if (error != undefined) {
                    if (error.error_msg != undefined) {
                        error = error.error_msg
                    }
                    else if (error.error_message != undefined) {
                        error = error.error_message
                    }
                    else if (error.message != undefined) {
                        error = error.message
                        if (error.authentication != undefined) {
                            error = error.authentication
                        }
                    }
                    else if (Array.isArray(error)) {
                        error = error[0].error.keys + " " + error[0].error.message;
                    }
                    console.log("job_id is not defined");
                    error = error.toString().replace("'", "")
                    callback(error, true)
                }
                else if (error == undefined && typeof (body) == "string") {
                    callback(body, true)
                }
                else {
                    callback("Error in scheduling migration", true)
                }
            }
        }
        else {
            callback(error, true);
        }
    });
}
exports.jobIdCreation_P2C = jobIdCreation_P2C;

function updateCompleteSuccessStatusP2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
        if (!err) {
            console.log(result);
            callback(result, false)
            console.log("updated details for migrations")
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
            console.log("updation fails")
        }
    });
}
exports.updateCompleteSuccessStatusP2C = updateCompleteSuccessStatusP2C;