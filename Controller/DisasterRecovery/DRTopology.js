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

function vpcList(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    Accesskey = req.body.access_key;
    Secretkey = req.body.secret_key;
    Regionid = req.body.region_id;
    TokenID = req.body.token;
    //res.end(values_get);
    res.header("access-control-allow-origin", "*");
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://192.168.1.159:8000/api/dr/topology/vpc_list",
        "body": JSON.stringify({
            "access_key": Accesskey,
            "secret_key": Secretkey,
            "region_id": Regionid,
            "token": TokenID
        })
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
        res.send(response.body)
    });
}
exports.vpcList = vpcList;

function vpcDetails(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    Accesskey = req.body.access_key;
    Secretkey = req.body.secret_key;
    Regionid = req.body.region_id;
    VpcID = req.body.vpc_id;
    TokenID = req.body.token;
    //res.end(values_get);
    res.header("access-control-allow-origin", "*");
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://192.168.1.159:8000/api/dr/topology/vpc_details",
        "body": JSON.stringify({
            "access_key": Accesskey,
            "secret_key": Secretkey,
            "region_id": Regionid,
            "vpc_id": VpcID,
            "token": TokenID
        })
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
        res.send(response.body)
    });
}
exports.vpcDetails = vpcDetails;


function replication(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    Accesskey = req.body.access_key;
    Secretkey = req.body.secret_key;
    SourceRegion = req.body.source_region;
    DestinationRegion = req.body.destination_region;
    Destination_zone = req.body.destination_zone;
    EIP = req.body.eip;
    Details = JSON.parse(req.body.vpc_details);
    TokenID = req.body.token;
    //res.end(values_get);
    res.header("access-control-allow-origin", "*");

    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://192.168.1.159:8000/api/dr/topology/replicate",
        "body": JSON.stringify({
            "access_key": Accesskey,
            "secret_key": Secretkey,
            "source_region": SourceRegion,
            "destination_region": DestinationRegion,
            "destination_zone": Destination_zone,
            "eip": EIP,
            "token": TokenID,
            "vpc_details": Details

        })
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        //console.dir(JSON.parse(body));
        res.send(response.body)
    });
}
exports.replication = replication;


function notification_process_using_sp(req, res, next) {
    res.setHeader("access-control-allow-origin", "*");
    p_dr_type = req.body.dr_type;
    p_job_id = req.body.job_id;
    p_inputs_details = req.body.inputs_details;
    p_user_id = req.body.user_id;
    p_dumy1 = req.body.dumy1;
    p_dumy2 = req.body.dumy2;
    p_mode = req.body.mode;
    p_group=req.body.p_group;
    res.header("access-control-allow-origin", "*");


    config.query("select * from _cb_dr_sp_notification('" + p_dr_type + "','" + p_job_id + "','" + p_inputs_details + "','" + p_user_id + "','" + p_dumy1 + "','" + p_dumy2 + "','" + p_mode + "','" + p_group + "', 'info');", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result)

        } else {
            console.log('error while performing query.', err);
        }
    });
}
exports.notification_process_using_sp = notification_process_using_sp;

//===========================================================================

function putTopologyAccount(req, res, next) {

    var p_account_name = '';
    var p_cloud = '';
    var p_access_key = '';
    var p_secret_key = '';
    var p_user_id = '';
    var p_account_type = '';
    var p_mode = '';
    var p_group = '';


    if (req.query.account_name) {
        p_account_name = req.query.account_name;
    }
    if (req.query.p_cloud) {
        p_cloud = req.query.p_cloud;
    }
    if (req.query.p_access_key) {
        p_access_key = req.query.p_access_key;
    }
    if (req.query.p_secret_key) {
        p_secret_key = req.query.p_secret_key;
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
    config.query("select * from _cb_dr_sp_topology_account_details('" + p_account_name + "','" + p_cloud + "','" + p_access_key + "','" + p_secret_key + "','" + p_user_id + "','" + p_mode + "','" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.putTopologyAccount = putTopologyAccount;

function getTopologyAccount(req, res, next) {

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

    config.query("select * from _cb_dr_sp_topology_account_details('" + p_account_name + "',null,null,null,'" + p_user_id + "', '" + p_mode + "','" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.getTopologyAccount = getTopologyAccount;

function delete_topology_Account(req, res, next) {

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

    config.query("select * from  _cb_dr_sp_topology_account_details('" + p_account_name + "',null,null,null,'" + p_user_id + "', '" + p_mode + "','" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        } else {
            console.log('error while performing query.', err);
        }
    });

}

exports.delete_topology_Account = delete_topology_Account;

function get_initial_Account(req, res, next) {


    var p_user_id = '';
    var p_mode = '';
    var p_group = '';
    if (req.query.user_id) {
        p_user_id = req.query.user_id;
    }
    if (req.query.mode) {
        p_mode = req.query.mode;
    }
    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    config.query("select * from  _cb_dr_sp_topology_account_details(null,null,null,null,'" + p_user_id + "', '" + p_mode + "','" + p_group + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
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



