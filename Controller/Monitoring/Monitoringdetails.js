var config = require('../../config');
var Request = require("request");

function generatetoken(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    p_usergroup = req.body.usergroup;
    p_mode = '';

    config.query("select * from cb_dr_get_user_details('" + p_usergroup + "','" + p_mode + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");

            user_name = result[1].rows[0].username;
            passwd = result[1].rows[0].password_digest;

            res.setHeader("access-control-allow-origin", "*");

            Request.post({
                "headers": { "content-type": "application/json" },
                "url": "http://192.168.0.69:8899/api/monitoring/user/login",
                "body": JSON.stringify({
                    "username": user_name,
                    "password": passwd

                })
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                 console.dir(JSON.parse(body));

                res.send(JSON.parse(response.body))
            });


        } else {
            console.log('error while performing query.', err);
        }
    });
}
exports.generatetoken = generatetoken;

function providerlistformonitoring(req, res, next) {

     res.setHeader("access-control-allow-origin", "*");

     if (req.body.usergroup) {
        user_group = req.body.usergroup;
    } 
    
    var provider_type="alibaba";

    config.query('select name from _cb_credentials where name IN (select name from ext_management_systems where tenant_id =( select tenant_id from miq_groups where description = $1)) and ems_type= $2',[user_group,provider_type], function (err, result) {

        if (!err) {
            console.log(result);
            var p_name = []
            for (i=0;i<result.rows.length;i++){
                p_name.push(result.rows[i].name);
            }
            res.setHeader("Content-type", "application/json")
            res.send(p_name);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });

}

exports.providerlistformonitoring = providerlistformonitoring;

function providermonitoringlist(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");
    
     var user_group=req.body.usergroup;
    //user_group = req.body.usergroup;

    config.query('select name from ext_management_systems where id IN (select provider_id from _cb_monitoring_stack_details where group_id IN (select id from miq_groups where description = $1))',[user_group], function (err, result) {

        if (!err) {
            console.log(result);
            var m_name = []
            for (i=0;i<result.rows.length;i++){
                m_name.push(result.rows[i].name)
            }
            res.setHeader("Content-type", "application/json")
            res.send(m_name);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });

}
exports.providermonitoringlist = providermonitoringlist;

function addProvider(req, res, next) {

    var provider_details = [];
    var group_id = "";
    var tenant_id = "";
    var pro_tenant_id
    res.setHeader("access-control-allow-origin", "*");

    p_usergroup = req.body.usergroup;
    // p_usergroup = req.body.usergroup;
    // p_namelist = JSON.parse("[" + req.body.providerlist + "]");
    p_namelist = req.body.providerlist.split(",");
    console.log(p_namelist)
    // p_namelist = req.body.providerlist;
    TokenID = req.body.token;

    config.query('select id,tenant_id from miq_groups where description = $1',[p_usergroup], function (err, result) {

        if (!err) {
            console.log(result);
            group_id = result.rows[0].id;
            tenant_id = result.rows[0].tenant_id;
            pro_tenant_id = parseInt(result.rows[0].tenant_id);

            config.query("SELECT ext_management_systems.id, _cb_credentials.client_id, _cb_credentials.client_secret, _cb_credentials.name,_cb_credentials.ems_type,_cb_credentials.region FROM ext_management_systems INNER JOIN _cb_credentials ON ext_management_systems.name = _cb_credentials.name Where ext_management_systems.tenant_id= $1;",[pro_tenant_id], function (err, result) {

                if (!err) {
                    console.log(result);
                    for (p=0; p< p_namelist.length; p++){ 
                        for (i = 0; i < result.rows.length; i++) {             
                                if(p_namelist[p]==result.rows[i].name){
                                    provider_details.push({ "provider_name": result.rows[i].name, 
                                    "provider_type": result.rows[i].ems_type,
                                    "access_key": result.rows[i].client_id,
                                    "secret_key": result.rows[i].client_secret,
                                    "region": result.rows[i].region,
                                    "Provider_id": result.rows[i].id},);
                                }
                            }
                    }
                    console.log(provider_details);
                    Request.post({
                        "headers": { "content-type": "application/json" },
                        "url": "http://192.168.0.69:8899/api/monitoring/add/provider",
                        "body": JSON.stringify({
                            "group_id": group_id,
                            "tenant_id": tenant_id,
                            "provider_details": provider_details,
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
                else {
                    console.log('Error while performing Query.', err);
                }
            });
        }
        else {
            console.log('Error while performing Query.', err);
        }
    })
    
    

}
exports.addProvider = addProvider;

function removeProvider(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");

    p_usergroup = req.body.usergroup;
    p_namelist = req.body.providerlist.split(",");
    console.log(p_namelist)
    TokenID = req.body.token;

    var provider_id = []
    config.query('select id from ext_management_systems where name = ANY($1::VARCHAR[]) and tenant_id = (select tenant_id from miq_groups where description = $2)',[p_namelist,user_group], function (err, result) {
        if (!err) {
        console.log(err, result); 
        for (i = 0; i < result.rows.length; i++) {                 
            provider_id.push(parseInt(result.rows[i].id)); 
            }             
        console.log(provider_id);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });

    config.query('select stack_name from _cb_monitoring_stack_details where provider_id = ANY($1::bigint[])',[provider_id], function (err, result) {
        if (!err) {
        console.log(err, result)
        stackname = result.rows[0].stack_name

        Request.delete({
            "headers": { "content-type": "application/json" },
            "url": "http://192.168.0.69:8899/api/monitoring/remove/provider",
            "body": JSON.stringify({
                "stack_name": stackname,
                "provider_ids": provider_id,
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
        else {
            console.log('Error while performing Query.', err);
        }
    });

}
exports.removeProvider = removeProvider;


function removeStack(req, res, next) {

    res.setHeader("access-control-allow-origin", "*");

    //p_usergroup = "MonitoringGroup"
    user_group = req.body.usergroup;
    TokenID = req.body.token;

    config.query('select stack_name from _cb_monitoring_stack_details where group_id = (select id from miq_groups where description = $1)',[user_group], function (err, result) {
        if (!err) {
            console.log(err, result);
            stackname = result.rows[0].stack_name;

            Request.delete({
                "headers": { "content-type": "application/json" },
                "url": "http://192.168.0.69:8899/api/monitoring/remove/stack",
                "body": JSON.stringify({
                    "stack_name": stackname,
                    "token": TokenID
                })
            },(error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                console.dir(JSON.parse(body));
                res.send(response.body);
            });
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.removeStack = removeStack;