var config = require('../../config');
var Request = require("request");
var http = require('http');
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

function notification_page_updates(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    p_dumy1 = req.body.dumy1;
    p_dumy2 = req.body.dumy2;
    p_user_id = req.body.user_id;
    p_mode = req.body.mode;
    TokenID = req.body.token;
    p_group = req.body.p_group;
    //var p_mode_1 = "get_all_notification_status"
    res.header("access-control-allow-origin", "*");
    config.query("select * from _cb_dr_sp_get_notification('" + p_dumy1 + "','" + p_dumy2 + "','" + p_user_id + "','" + p_mode + "','" + p_group +"', 'info'); FETCH ALL IN \"info\";", 
    function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.setHeader("access-control-allow-origin", "*");
            var complete = [];
            var progress = [];
            var update = []
            var fail = [];
            var store_api = []
            j = -1;
            s = -1
            //result[1].rows[i].start_date
            //fail[i].start_date
            var filteredObj = result[1].rows.find(function (item, i) {
                if (parseInt(item.progress) == 100 && (item.error == "" || item.error == null)) {
                    date = new Date(item.start_date);
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
                    item_value = { "dr_type": item.dr_type, "error": item.error, "id": item.id, "inputs_details": item.inputs_details, "job_id": item.job_id, 
                    "progress": item.progress, "progress_status": item.progress_status, "start_date": only_date }
                    complete.push(item_value);
                }
                else if (parseInt(item.progress) < 100 && parseInt(item.progress) >= 0 && (item.error == "" || item.error == null)) {
                    date = new Date(item.start_date);
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
                    item_value = { "dr_type": item.dr_type, "error": item.error, "id": item.id, "inputs_details": item.inputs_details, "job_id": item.job_id, 
                    "progress": item.progress, "progress_status": item.progress_status, "start_date": only_date }
                    progress.push(item_value);
                }
                else if (parseInt(item.progress) < 100 && parseInt(item.progress) >= 0 && (item.error != "" || item.error != null)) {
                    date = new Date(item.start_date);
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
                    item_value = { "dr_type": item.dr_type, "error": item.error, "id": item.id, "inputs_details": item.inputs_details, "job_id": item.job_id, 
                    "progress": item.progress, "progress_status": item.progress_status, "start_date": only_date }
                    fail.push(item_value);
                }
            });
            //
            for (var i = 0; i < progress.length; i++) {
                console.log(progress[i])
                //console.log(progress[i].dr_type)
                //console.log(progress[i].job_id)
                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "http://192.168.1.159:8000/api/dr/job-status/",
                    "body": JSON.stringify({
                        "job_id": progress[i].job_id,
                        "token": TokenID
                    })
                },
                    (error, response, body) => {
                        if (error) {
                            return console.dir(error);
                        }
                        console.dir(JSON.parse(body));
                        var store_res = JSON.parse(response.body)
                        //value_data = { "details": store_res, "input details": progress[i].inputs_details,"date": progress[i].start_date }
                        store_api.push(store_res)
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
                             value = { "dr_type": store_api[j].status.dr_type, "error": store_api[j].error, "id": t_user_id, "inputs_details": input_progress_details, 
                             "job_id": store_api[j].status.job_id, "progress": store_api[j].progress, "progress_status": store_api[j].status.current_status, "start_date": only_date }
                            console.log(value)
                            update.push(value)
                            config.query("select * from _cb_dr_sp_notification('" + t_dr_type + "','" + t_job_id + "','" + t_inputs_details + "','" + 
                            t_user_id + "','" + t_progress_status + "','" + t_error + "','" + t_mode + "','" + p_group +"', 'info');", function (err, result, fields) {
                                if (!err) {
                                    console.log(store_api);

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
                            value = { "dr_type": store_api[j].status.dr_type, "error": store_api[j].error, "id": t_user_id, "inputs_details": input_progress_details, 
                            "job_id": store_api[j].status.job_id, "progress": store_api[j].progress, "progress_status": store_api[j].status.current_status, "start_date": only_date }
                            console.log(value)
                            fail.push(value)
                            config.query("select * from _cb_dr_sp_notification('" + t_dr_type + "','" + t_job_id + "','" + t_inputs_details + "','" + t_user_id + "','" + 
                            t_progress_status + "','" + t_error + "','" + t_mode + "','" + p_group +"', 'info');", function (err, result, fields) {
                                if (!err) {
                                    console.log(store_api);

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
            //
            setTimeout(function () {
                datas = { "complete": complete, "progress": update, "fail": fail }
                res.send(datas)
            }, 6000);
        }
        else {
            console.log('error while performing query.', err);
        }

    });
}
exports.notification_page_updates = notification_page_updates;