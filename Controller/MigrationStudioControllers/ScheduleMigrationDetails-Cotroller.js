var crypto = require('crypto');
var config = require('../../config');
var cron = require('node-cron');
var request = require('request');

var migration_ip = "https://migration.thecloudsbrain.com" 

var source_details = null;                    
var dest_details = null;
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
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.userMigrationallJobDetails = userMigrationallJobDetails;

function getScheduledJobDetailsD2C(req, res, next, callback) {
    res.header("access-control-allow-origin", "*");
    cron.schedule('0 * * * *', () => {
        config.query("select * from cb_mig_sp_get_schedule_details('select');", function (err, result) {
            if (!err) {
                rowcount = result.rows[0].cb_mig_sp_get_schedule_details.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (index = 0; index < rowcount; index++) {
                    //Converting the string  to date 
                    dt_tm = result.rows[0].cb_mig_sp_get_schedule_details[index].datetime;
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
                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours())) {
                        console.log("date are same")
                        var schedule_id = result.rows[0].cb_mig_sp_get_schedule_details[index].id;
                        user_id = result.rows[0].cb_mig_sp_get_schedule_details[index].user_id;
                        if (result.rows[0].cb_mig_sp_get_schedule_details[index].migration_type == 'D2C' && result.rows[0].cb_mig_sp_get_schedule_details[index].is_success == null) {
                            console.log("Initiating the process of migration for the D2C")
                            //start migration for the d2c
                             source_details = result.rows[0].cb_mig_sp_get_schedule_details[index].source_details;
                             dest_details = result.rows[0].cb_mig_sp_get_schedule_details[index].dest_details;
                             token = null;
                            var data = {
                                "username": "tushar.dhote@click2cloud.net",
                                "password": "ROOT#123"
                            }

                            var options = {
                                method: 'POST',
                                url: migration_ip + '/migration-studio/create-token/',
                                headers:
                                {
                                    'Content-Type': 'application/json'
                                },
                                body: data,
                                json: true
                            };

                            request(options, function (error, response, body) {
                                token = body.token;
                                if (token != undefined) {
                                    console.log(token);
                                        callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, false)
                                }
                                else {
                                    console.log("token is not defined");
                                    callback(schedule_id, token, source_details, dest_details, schedule_date, user_id, true)
                                }
                            });
                        }
                    }
                    else {
                        console.log("date are different")
                    }
                }
            }
            else {
                console.log('Error while performing Query.', err);
            }
        });
    });
    res.send("done");
}
exports.getScheduledJobDetailsD2C = getScheduledJobDetailsD2C;

function updateErrorMessage(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
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

function updateErrorMessageJobDetails(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_schedular_error(" + schedule_id + ", 'Job_Id Generation Failed', 'error_message', 'info');", function (err, result) {
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
    var data = {
        "source": source_details,
        "destination": dest_details,
        "token": token
    }
    var options = {
        method: 'POST',
        url: migration_ip + '/migration-studio/d2c-migration/mysql/migration',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        job_id = body.job_id;
        if (job_id != undefined) {
            console.log(body);
            callback(body, false);
        }
        else {
            console.log("job_id is not defined");
            callback(body, true);
        }
    });
}
exports.jobIdCreationD2C = jobIdCreationD2C;

function migrationAllDnDJobDetailsD2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_cloud = source_details["host"];
    var destination_cloud = dest_details["host"];
    var object_name = 'MySQL';
    var migration_type = 'D2C'; //d2c
    var error_message = '';
    var created_date = schedule_date; //now
    var topology_name = '';
    config.query("select * from cb_mig_sp_post_dnd_complete_migration_job_details('" + job_id + "','" + job_status + "'," + user_id + ",'" + source_cloud + "','" + destination_cloud + "','" + object_name + "','" + migration_type + "','" + error_message + "','" + created_date + "','" + topology_name + "', 'insert', 'info');", function (err, result) {
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
exports.migrationAllDnDJobDetailsD2C = migrationAllDnDJobDetailsD2C;

function updateCompleteSuccessStatusD2C(req, res, next, schedule_id, callback) {
    var schedule_id = schedule_id;
    config.query("select * from cb_mig_sp_update_scheduler_success_status(" + schedule_id + ", 'success_message', 'info');", function (err, result) {
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
exports.updateCompleteSuccessStatusD2C = updateCompleteSuccessStatusD2C;

function getScheduledJobDetailsV2C(req, res, next, callback) {
    res.header("access-control-allow-origin", "*");
    cron.schedule('0 * * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_V2C('select');", function (err, result) {
            if (!err) {
                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_v2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduled migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (index = 0; index < rowcount; index++) {
                    console.log("id==" + result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].id);
                    console.log("time===" + result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].datetime);
                    console.log("temp");
                    //Converting the string  to date 
                    dt_tm = result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].datetime;
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

                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours())) {
                        console.log("date are same")
                        var schedule_id = result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].id;
                      var  user_id = result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].user_id;
                        if (result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].migration_type == 'V2C' && result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].is_success == null) {
                            console.log("Initiating the process of migration for the V2C")
                            //start migration for the d2c
                          var  source_details = result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].source_details;
                          var  dest_details = result.rows[0].cb_mig_sp_get_schedule_details_v2c[index].dest_details;

                            var token = null;
                            var data = {
                                "username": "tushar.dhote@click2cloud.net",
                                "password": "ROOT#123"
                            }
                            var options = {
                                method: 'POST',
                                url: migration_ip + '/migration-studio/create-token/',
                                headers:
                                {
                                    'Content-Type': 'application/json'
                                },
                                body: data,
                                json: true
                            };

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
    res.send("Done");
}
exports.getScheduledJobDetailsV2C = getScheduledJobDetailsV2C;

function jobIdCreation_V2C(req, res, next, schedule_id, token, source_details, dest_details, callback) {
    var job_id = null;

    var data = {
        "source": source_details,
        "destination": dest_details,
        "token": token
    }

    var options = {
        method: 'POST',
        url: migration_ip + '/migration-studio/v2c-migration/vmware-to-apsara-stack/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
      var  job_id = body.job_id;
        if (job_id != undefined) {
            console.log(body);
            callback(body, false)
        }
        else {
            console.log("job_id is not defined");
            callback(body, true)
        }
    });
}
exports.jobIdCreation_V2C = jobIdCreation_V2C;

function migrationAllDnDJobDetails_V2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_host = source_details["src_vmware_ip_address"];
    var destination_cloud = dest_details["cloud_name"];
    var object_name = source_details['src_vm_name'];
    var migration_type = 'V2C';
    var error_message = "";
    var created_date = schedule_date;
    var topology_name = "";

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

function getScheduledJobDetailsC2C(req, res, next, callback) {
    //var source_details = null;
    //var dest_details = null;
    var schedule_date = null;
    res.header("access-control-allow-origin", "*");
    cron.schedule('0 * * * *', () => {
        console.log("cron started");
        var dt_tm = null;
        config.query("select * from cb_mig_sp_get_schedule_details_c2c('select');", function (err, result) {
            if (!err) {
                rowcount = result.rows[0].cb_mig_sp_get_schedule_details_c2c.length;
                if (rowcount < 1) {
                    console.log("No adequate data found for schduling migration");
                }
                console.log("rowcount=" + rowcount);
                var index = null;
                for (index = 0; index < rowcount; index++) {
                    console.log("id==" + result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].id);
                    console.log("time===" + result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].datetime);
                    //Converting the string  to date 
                    dt_tm = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].datetime;
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

                    schedule_date = dt_tm;
                    var user_id = null;
                    if ((sched_date_time.getFullYear() == current_date.getFullYear() && sched_date_time.getMonth() == current_date.getMonth() && sched_date_time.getDate() == current_date.getDate()) && (sched_date_time.getHours() == current_date.getHours())) {
                        console.log("date are same")
                        var schedule_id = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].id;
                        user_id = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].user_id;

                        if (result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].migration_type == 'C2C' && result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].is_success == null) {
                            console.log("Initiating the process of migration for the C2C");
                            source_details = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].source_details;
                            dest_details = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].dest_details;

                            is_rsync = result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].is_rsync;
                            console.log(typeof (is_rsync));
                            console.log(is_rsync);

                            var data = {
                                "dest_access_key": result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].dest_details.dest_access_key,
                                "dest_secret_key": result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].dest_details.dest_secret_key,
                                "dest_region": result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].dest_details.dest_region,
                                "zone_id": result.rows[0].cb_mig_sp_get_schedule_details_c2c[index].dest_details.zone_id
                            }
                           
                            var options = {
                                method: 'POST',
                                url: migration_ip + '/migration-studio/c2c-migration/alibaba/alibaba-create-network-new/ ',
                                headers:
                                {
                                    'Content-Type': 'application/json'
                                },
                                body: data,
                                json: true
                            };
                            request(options, function (error, response, body) {

                                security_group = body.security_group_id;
                                vswitch_id = body.vswitch_id;                               
                                if (security_group != undefined && vswitch_id != undefined) {
                                    console.log("security group=" + security_group + " and switch id " + vswitch_id);
                                    var token = null;
                                    var data = {
                                        "username": "tushar.dhote@click2cloud.net",
                                        "password": "ROOT#123"
                                    }

                                    var options = {
                                        method: 'POST',
                                        url: migration_ip + '/migration-studio/create-token/',
                                        headers:
                                        {
                                            'Content-Type': 'application/json'
                                        },
                                        body: data,
                                        json: true
                                    };

                                    request(options, function (error, response, body) {
                                        token = body.token;
                                        if (token != undefined) {
                                            console.log("Token==" + token);
                                            callback(is_rsync, schedule_id, token, source_details, dest_details, schedule_date, user_id, security_group, vswitch_id, false);
                                        }
                                        else {
                                            console.log("token is not defined");
                                            callback(is_rsync, schedule_id, token, source_details, dest_details, schedule_date, user_id, security_group, vswitch_id, true);
                                        }
                                    });
                                }
                                else {
                                    console.log("unable to create the vswitch id and security group");
                                }
                            });
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
    res.send("done");
}
exports.getScheduledJobDetailsC2C = getScheduledJobDetailsC2C;

function jobIdCreation_C2C(req, res, next, is_rsync, schedule_id, token, source_details, dest_details, security_group, vswitch_id, callback) {
    var job_id = null;
    var c2c_action = ''
    var url = ''
    if (!is_rsync) {
        console.log("is rsync is false");
        console.log("In Openstack");
        if (source_details.sourcecloud == 'Azure') {
            console.log('In azure');
            c2c_action = 'azure-to-alibaba-migration-new';
        }
        if (source_details.sourcecloud == 'Openstack') {
            console.log("In Openstack");
            c2c_action = 'openstack-to-alibaba-migration';
        }
        url = migration_ip + '/migration-studio/c2c-migration/' + c2c_action + '/';
    }
    else {
        console.log("is rsync is true")
        url = migration_ip + '/migration-studio/p2c-migration/physical-to-alibaba/';
    }
    dest_details.security_group = security_group;
    dest_details.vswitch_id = vswitch_id;
    var data = {
        "source_cloud": source_details,
        "destination_cloud": dest_details,
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
        job_id = body.job_id;
        if (job_id != undefined) {

            console.log(body);
            callback(body, false)
        }
        else {
            console.log("job_id is not defined");
            callback(body, true)
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

function migrationAllDnDJobDetails_C2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, job_id, callback) {
    var user_id = user_id;
    var job_id = job_id;
    var job_status = 'Running';
    var source_host = source_details["cloud_name"];
    var destination_cloud = dest_details["cloud_name"];
    var object_name = source_details['vm_name'];
    var migration_type = 'C2C';
    var error_message = "";
    var created_date = schedule_date;
    var topology_name = "";

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