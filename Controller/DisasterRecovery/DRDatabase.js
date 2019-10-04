var config = require('../../config');
var Request = require("request");
var http = require('http');

function putAccount(req, res, next) {

    var p_account_name = '';
    var p_db_type = '';
    var p_hostname = '';
    var p_db_port = '';
    var p_vm_user = '';
    var p_vm_password = '';
    var p_db_name = '';
    var p_db_username = '';
    var p_db_password = '';
    var p_user_id = '';
    var p_mode = '';
    var p_db_keypassword = '';
    var p_ssh_portno = '';
    var p_group = '';
    if (req.query.account_name) {
        p_account_name = req.query.account_name;
    }
    if (req.query.dbType) {
        p_db_type = req.query.dbType;
    }
    if (req.query.hostname) {
        p_hostname = req.query.hostname;
    }
    if (req.query.db_port) {
        p_db_port = req.query.db_port;
    }
    if (req.query.vm_user) {
        p_vm_user = req.query.vm_user;
    }
    if (req.query.vm_password) {
        p_vm_password = req.query.vm_password;
    }
    if (req.query.db_name) {
        p_db_name = req.query.db_name;
    }
    if (req.query.db_username) {
        p_db_username = req.query.db_username;
    }
    if (req.query.db_password) {
        p_db_password = req.query.db_password;
    }
    if (req.query.user_id) {
        p_user_id = req.query.user_id;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.vm_keypassword) {
        p_db_keypassword = req.query.vm_keypassword;
    }
    if (req.query.ssh_portno) {
        p_ssh_portno = req.query.ssh_portno;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }
    config.query("select * from _cb_dr_sp_data_operation('" + p_account_name + "','" + p_db_type + "','" + p_hostname + "','" + p_db_port + "','" + p_vm_user + "','" + p_vm_password + "','" + p_db_name + "', '" + p_db_username + "','" + p_db_password + "','" + p_user_id + "', '" + p_mode + "','" + p_db_keypassword + "','" + p_ssh_portno + "','" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.putAccount = putAccount;


function getAccount(req, res, next) {

    var p_account_name = '';
    var p_user_id = '';
    var p_mode = '';
    var p_group = '';

    if (req.query.account_name) {
        p_account_name = req.query.account_name;
    }
    if (req.query.user_id) {
        p_user_id = req.query.user_id;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    config.query("select * from _cb_dr_sp_data_operation('" + p_account_name + "',null,null,null,null,null,null,null,null,'" + p_user_id + "', '" + p_mode + "',null,0,'" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.getAccount = getAccount;

function delete_Account(req, res, next) {

    var p_account_name = '';
    var p_user_id = '';
    var p_mode = '';
    var p_group = '';

    if (req.query.account_name) {
        p_account_name = req.query.account_name;
    }
    if (req.query.user_id) {
        p_user_id = req.query.user_id;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    config.query("select * from _cb_dr_sp_data_operation('" + p_account_name + "',null,null,null,null,null,null,null,null,'" + p_user_id + "', '" + p_mode + "',null,0,'" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.delete_Account = delete_Account;

function get_initial_Account(req, res, next) {

    var p_db_type = '';
    var p_user_id = '';
    var p_mode = '';
    var p_group = '';

    if (req.query.db_type) {
        p_db_type = req.query.db_type;
    }
    if (req.query.user_id) {
        p_user_id = req.query.user_id;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    config.query("select * from _cb_dr_sp_data_operation(null,'" + p_db_type + "',null,null,null,null,null,null,null,'" + p_user_id + "', '" + p_mode + "',null,0,'" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.get_initial_Account = get_initial_Account;

function replicate_details(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    s_host_name = req.body.hostname;
    s_host_username = req.body.vm_user;
    s_host_password = req.body.vm_password;
    s_ssh_port_no = req.body.ssh_portno;
    s_password_key_pair = req.body.vm_keypassword;
    s_database_password = req.body.db_password;
    s_database_name = req.body.db_name;
    s_port = req.body.db_port;
    d_host_name = req.body.hostname1;
    d_host_username = req.body.vm_user1;
    d_ssh_port_no = req.body.ssh_portno1;
    d_host_password = req.body.vm_password1;
    d_password_key_pair = req.body.vm_keypassword1;
    d_database_password = req.body.db_password1;
    d_database_name = req.body.db_name;
    d_port = req.body.db_port;
    Token = req.body.token;
    //Token = "YWRtaW4tJDJhJDEwJGJ4RWhDaXg5Z3F5d24zSm0xVUw4SC5qMC5jVm8wa0IwTFAwRmlXZEVWdWdYeWVZ5dnduUS9LLTIwMTktMDUtMDIgMTc6NTU6NDce";
    res.header("access-control-allow-origin", "*");
    Request.get({
        "headers": { "content-type": "application/json" },
        "url": "http://192.168.1.159:8000/api/dr/database/replication",
        "body": JSON.stringify({
            "source_database": {

                "host_name": s_host_name,
                "host_username": s_host_username,
                "ssh_port": s_ssh_port_no,
                "host_password": s_host_password,
                "password_key_pair": s_password_key_pair,
                "database_password": s_database_password,
                "database_name": s_database_name,
                "port": s_port
            },
            "destination_database": {
                "host_name": d_host_name,
                "host_username": d_host_username,
                "ssh_port": d_ssh_port_no,
                "host_password": d_host_password,
                "password_key_pair": d_password_key_pair,
                "database_password": d_database_password,
                "database_name": d_database_name,
                "port": d_port
            },
            "token": Token

        })
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
        res.send(response.body)
    });
}

exports.replicate_details = replicate_details;

function token_generate_using_sp(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    p_usergroup = req.body.usergroup;
    p_mode = req.body.mode;

    config.query("select * from cb_dr_get_user_details('" + p_usergroup + "','" + p_mode + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");

            user_name = result[1].rows[0].username;
            passwd = result[1].rows[0].password_digest;

            res.setHeader("access-control-allow-origin", "*");


            Request.post({
                "headers": { "content-type": "application/json" },
                "url": "http://192.168.1.159:8000/api/dr/create_token",
                "body": JSON.stringify({
                    "username": user_name,
                    "password": passwd

                })
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                console.dir(JSON.parse(body));

                res.send(response.body)
            });


        } else {
            console.log('error while performing query.', err);
        }
    });

}
exports.token_generate_using_sp = token_generate_using_sp;

function get_notification(req, res, next) {

    var p_dr_type = '';
    var p_job_id = '';
    var p_inputs_details = '';
    var p_user_id = '';
    var p_mode = '';
    var p_group = '';

    if (req.query.dr_type) {
        p_dr_type = req.query.dr_type;
    }
    if (req.query.jobid) {
        p_job_id = req.query.jobid;
    }
    if (req.query.inputdetails) {
        p_inputs_details = req.query.inputdetails;
    }
    if (req.query.userid) {
        p_user_id = req.query.userid;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    config.query("select * from _cb_dr_sp_notification('" + p_dr_type + "','" + p_job_id + "','" + p_inputs_details + "','" + p_user_id + "',null,null,'" + p_mode + "','" + p_group + "', 'info'); ", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.get_notification = get_notification;


//================================================================================database================================================================================================


function database_validation(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    p_dumy1 = req.body.dumy1;
    p_dumy2 = req.body.dumy2;
    p_user_id = req.body.user_id;
    p_mode = req.body.mode;
    TokenID = req.body.token;
    p_group = req.body.p_group;
    //var p_mode_1 = "get_all_notification_status"
    res.header("access-control-allow-origin", "*");
    var complete = []
    var progress = []
    var fail = []
    var store_api = []
    var update = []
    j = -1;
    s = -1

    k = -1

    config.query("select * from _cb_dr_sp_get_notification('" + p_dumy1 + "','" + p_dumy2 + "','" + p_user_id + "','" + p_mode + "','" + p_group +"', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {

        if (!err) {
            console.log(result);
            for (i = 0; i < result[1].rows.length; i++) {
                //console.log(result[1].rows[i].dr_type)
                if (result[1].rows[i].dr_type == "Database") {
                    console.log(result[1].rows[i].dr_type)
                    if (parseInt(result[1].rows[i].progress) < 100 && parseInt(result[1].rows[i].progress) >= 0 && (result[1].rows[i].error == "" || result[1].rows[i].error == null)) {
                        progress.push(result[1].rows[i]);
                        s = s + 1
                        Request.post({
                            "headers": { "content-type": "application/json" },
                            "url": "http://192.168.1.159:8000/api/dr/job-status/",
                            "body": JSON.stringify({
                                "job_id": progress[s].job_id,
                                "token": TokenID
                            })
                        },
                            (error, response, body) => {
                                if (error) {
                                    return console.dir(error);
                                }
                                console.dir(JSON.parse(body));
                                var store_res = JSON.parse(response.body)
                                store_api.push(store_res)
                                k = k + 1
                                j = j + 1
                                s = s + 1

                                //

                                if (store_api[j].error == "" || store_api[j].error == null) {
                                    t_dr_type = store_api[j].status.dr_type;
                                    t_job_id = store_api[j].progress;
                                    t_inputs_details = "{}";
                                    //t_user_id = progress[j].id;
                                    t = 0;
                                    for (v = 0; v < progress.length; v++) {

                                        if (store_api[j].status.job_id == progress[t].job_id) {
                                            t_user_id = progress[t].id;
                                            input_progress_details = progress[t].inputs_details
                                            break;
                                        }
                                        else {
                                            console.log("not got");
                                            t = t + 1
                                        }

                                    }

                                    t_progress_status = store_api[j].status.current_status;
                                    t_error = store_api[j].error;
                                    t_mode = "update_job_id";
                                    //console.log(progress[j].start_date.toISOString())
                                    date_iso = progress[j].start_date

                                    date = new Date(date_iso);
                                    year = date.getFullYear();
                                    month = date.getMonth() + 1;
                                    dt = date.getDate();
                                    //
                                    if (dt < 10) {
                                        dt = '0' + dt;
                                    }
                                    if (month < 10) {
                                        month = '0' + month;
                                    }

                                    console.log(year + '-' + month + '-' + dt);
                                    only_date = year + '-' + month + '-' + dt

                                    value = { "dr_type": store_api[j].status.dr_type, "error": store_api[j].error, "id": progress[j].id, "inputs_details": input_progress_details, "job_id": store_api[j].status.job_id, "progress": store_api[j].progress, "progress_status": store_api[j].status.current_status, "start_date": only_date }
                                    console.log(value)
                                    if (parseInt(store_api[j].progress) < 100 && parseInt(store_api[j].progress) >= 0 && (store_api[j].error != "" || store_api[j].error != null)) {
                                        update.push(value)
                                    }
                                    else {
                                        console.log("Data complete")
                                    }
                                    //update.push(value)


                                    config.query("select * from _cb_dr_sp_notification('" + t_dr_type + "','" + t_job_id + "','" + t_inputs_details + "','" + t_user_id + "','"
                                        + t_progress_status + "','" + t_error + "','" + t_mode + "','" + p_group +"', 'info');", function (err, result, fields) {
                                            if (!err) {

                                                console.log(store_api);

                                                //res.send(data1)

                                            } else {
                                                console.log('error while performing query.', err);
                                            }
                                        });

                                }
                                else if (store_api[j].error != "" || store_api[j].error != null) {
                                    t_dr_type = store_api[j].status.dr_type;
                                    t_job_id = store_api[j].progress;
                                    t_inputs_details = "{}";
                                    //t_user_id = progress[j].id;
                                    t = 0;
                                    for (v = 0; v < progress.length; v++) {

                                        if (store_api[j].status.job_id == progress[t].job_id) {
                                            t_user_id = progress[t].id;
                                            input_progress_details = progress[t].inputs_details
                                            break;
                                        }
                                        else {
                                            console.log("not got");
                                            t = t + 1
                                        }

                                    }

                                    t_progress_status = store_api[j].status.current_status;
                                    t_error = store_api[j].error;
                                    t_mode = "update_job_id";
                                    //console.log(progress[j].start_date.toISOString())
                                    date_iso = progress[j].start_date

                                    date = new Date(date_iso);
                                    year = date.getFullYear();
                                    month = date.getMonth() + 1;
                                    dt = date.getDate();

                                    if (dt < 10) {
                                        dt = '0' + dt;
                                    }
                                    if (month < 10) {
                                        month = '0' + month;
                                    }

                                    console.log(year + '-' + month + '-' + dt);
                                    only_date = year + '-' + month + '-' + dt


                                    value = {
                                        "dr_type": store_api[j].status.dr_type, "error": store_api[j].error, "id": t_user_id, "inputs_details": input_progress_details,
                                        "job_id": store_api[j].status.job_id, "progress": store_api[j].progress, "progress_status": store_api[j].status.current_status, "start_date": only_date
                                    }
                                    console.log(value)
                                    fail.push(value)


                                    config.query("select * from _cb_dr_sp_notification('" + t_dr_type + "','" + t_job_id + "','" + t_inputs_details + "','" + t_user_id + "','"
                                        + t_progress_status + "','" + t_error + "','" + t_mode + "','" + p_group +"', 'info');", function (err, result, fields) {
                                            if (!err) {

                                                console.log(store_api);

                                                //res.send(data1)

                                            } else {
                                                console.log('error while performing query.', err);
                                            }

                                        });
                                }
                                else {
                                    console.log("Error Invalid data")
                                }
                            });
                    }
                    else if (parseInt(result[1].rows[i].progress) < 100 && parseInt(result[1].rows[i].progress) >= 0 && (result[1].rows[i].error != "" || result[1].rows[i].error != null)) {
                        fail.push(result[1].rows[i])
                    }
                    else {
                        complete.push(result[1].rows[i])
                    }
                }
            }
            setTimeout(function () {
                console.log(update)
                res.send(update)
            }, 5000);
        }
        else {
            console.log('error while performing query.', err);
        }

    });

}
exports.database_validation = database_validation;