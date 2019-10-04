//var orconfig = require('../../alibaba_orch_config');
//var router = express.Router();

var config = require('../../config');
var Request = require("request");
const NodeTemp = "http://192.168.1.159:8054/api/cro/";

function orch_ali(req, res, next){

    config.query("select _cb_orchestration_sp_alibaba_acct('"+req.body.usergroup+"')", function (err, result, fields) {
        if (!err) {
            // console.log(result);
            // var out = result
            var out = result.rows[0]._cb_orchestration_sp_alibaba_acct
            console.log(out);
            aliacct = []
            for(i =0;i<out.length;i++){
                data1 = {
                    credential_id : out[i].credential_id,
                    name : out[i].name,
                    region : out[i].region
                }
                aliacct.push(data1)
            }
            
            console.log(aliacct)
            res.header("access-control-allow-origin", "*");
            // res.setheader("access-control-allow-origin", "*");

            res.send(aliacct);
        }
        else {
            res.header("access-control-allow-origin", "*");
            console.log('error while performing query.', err);
            res.send(err);
        }
    });
}
exports.orch_ali = orch_ali;

function orch_details(req, res, next){
        // res.setHeader("access-control-allow-origin", "*");
        config.query("select _cb_orchestration_sp_status('"+req.body.mode+"','"+req.body.usergroup+"','"+req.body.acct+"','"+req.body.json+"','"+req.body.region+"','"+req.body.status+"','"+req.body.tempname+"','"+req.body.job_id+"','"+req.body.comment+"')", function (err, result, fields) {
            if (!err) {
                
                //var out = result
                res.header("access-control-allow-origin", "*");
                res.setHeader("access-control-allow-origin", "*");
                res.send(result);
            }
            else {
                console.log('error while performing query.', err);
                res.send(err);
            }
        });
}
exports.orch_details = orch_details;


function orch_validate(req, res, next){
    config.query("select _cb_orchestration_sp_alibaba_acct('"+req.body.usergroup+"')", function (err, result, fields) {
        if (!err) {
            var out = result.rows[0]._cb_orchestration_sp_alibaba_acct
            aliacct = out
 
            console.log(aliacct)
            temp_data = {
                Provider: {
                    Name: "Alibaba",
                    Credentials: { Access_key: null, Secret_key: null, Region: null }
                },
                Resources: null
            }
            for (i = 0; i < aliacct.length; i++) {
                if (req.body.temp_acct == aliacct[i].credential_id) {
                    temp_data.Provider.Credentials.Access_key = aliacct[i].client_id;
                    temp_data.Provider.Credentials.Secret_key = aliacct[i].client_secret;
                    temp_data.Provider.Credentials.Region = aliacct[i].region;
                    account_name = aliacct[i].name;
                    temp_data.Resources = JSON.parse(req.body.textjson);
                }
            }

            Request.post({
                "headers": { "content-type": "application/json" },
                "url": NodeTemp + "validate_template",
                "body": JSON.stringify(temp_data)
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                console.dir(JSON.parse(body));
                res.header("access-control-allow-origin", "*");
                res.send(response.body)
            });
        }
        else {
            console.log('error while performing query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.orch_validate = orch_validate;

function orch_submit(req, res, next){
    config.query("select _cb_orchestration_sp_alibaba_acct('"+req.body.usergroup+"')", function (err, result, fields) {
        if (!err) {
            var out = result.rows[0]._cb_orchestration_sp_alibaba_acct
            // console.log(out);
            aliacct = out;
            // console.log(aliacct)
            // res.header("access-control-allow-origin", "*");
            // res.setheader("access-control-allow-origin", "*");
            temp_data = {
                Provider: {
                    Name: "Alibaba",
                    Credentials: { Access_key: null, Secret_key: null, Region: null }
                },
                Resources: null
            }
            for (i = 0; i < aliacct.length; i++) {
                if (req.body.temp_acct == aliacct[i].credential_id) {
                    temp_data.Provider.Credentials.Access_key = aliacct[i].client_id;
                    temp_data.Provider.Credentials.Secret_key = aliacct[i].client_secret;
                    temp_data.Provider.Credentials.Region = aliacct[i].region;
                    account_name = aliacct[i].name;
                    temp_data.Resources = JSON.parse(req.body.textjson);
                    temp_data.TenantId = req.body.TenantId;
                }
            }
            // console.log(temp_data);
            Request.post({
                "headers": { "content-type": "application/json" },
                "url": NodeTemp + "run_template",
                "body": JSON.stringify(temp_data)
            }, (error, response1, body) => {
                if (error) {
                    return console.dir(error);
                }
                data2 = JSON.parse(response1.body)
                // console.dir(JSON.parse(body));
                console.log(response1);

                if(data2.status == true){
                    Request.get(NodeTemp + "get_status/"+data2.Job_id, (error, response, body) => {
                        if (error) {
                            // return console.dir(error);
                            res.header("access-control-allow-origin", "*");
                            res.send(null);
                        }
                        // console.dir(JSON.parse(body));
                        console.log("job....."+response.body)
                        data3 = JSON.parse(response.body)
                        data3.Job_id = data2.Job_id;
                        console.log("job....."+data3)
                        res.header("access-control-allow-origin", "*");
                        res.send(data3)
                    });
                    // console.log("true status")
                }
                
            });

        }
        else {
            console.log('error while performing query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.orch_submit = orch_submit;




function orch_update(req, res, next){
    config.query("select _cb_orchestration_sp_alibaba_acct('"+req.body.usergroup+"')", function (err, result, fields) {
        if (!err) {

            var out = result.rows[0]._cb_orchestration_sp_alibaba_acct
            console.log(out);
            aliacct = out;
            temp_data = {
                Provider: {
                    Name: "Alibaba",
                    Credentials: { Access_key: null, Secret_key: null, Region: null }
                },
                Resources: null
            }
            for (i = 0; i < aliacct.length; i++) {
                if (req.body.temp_acct == aliacct[i].credential_id) {
                    temp_data.Provider.Credentials.Access_key = aliacct[i].client_id;
                    temp_data.Provider.Credentials.Secret_key = aliacct[i].client_secret;
                    temp_data.Provider.Credentials.Region = aliacct[i].region;
                    account_name = aliacct[i].name;
                    temp_data.Resources = JSON.parse(req.body.textjson);
                    temp_data.TenantId = req.body.TenantId;
                }
            }
            Request.put({
                "headers": { "content-type": "application/json" },
                "url": NodeTemp + "update_template/"+req.body.job_id,
                "body": JSON.stringify(temp_data)
            }, (error, response, body) => {
                if (error) {
                    return console.dir(error);
                }
                data2 = JSON.parse(response.body)
                console.dir( JSON.parse(body));
                if(data2.status == true){
                    Request.get(NodeTemp + "get_status/"+req.body.job_id, (error, response, body) => {
                        if (error) {
                            // return console.dir(error);
                            res.send(null);
                        }
                        // console.dir(JSON.parse(body));
                        // console.log("job123....."+response.body)
                        data3 = JSON.parse(response.body)
                        data3.Job_id = req.body.job_id;
                        console.log("job....."+data3)
                        if(data3.status){
                            res.header("access-control-allow-origin", "*");
                            res.send(data3)
                        }else{
                            res.header("access-control-allow-origin", "*");
                            res.send(null);
                        }
                    });
                }

            });
            
      
        }
        else {
            console.log('error while performing query.', err);
            res.send(err);
        }
    });
}
exports.orch_update = orch_update;




function orch_interval(req, res, next){
    Request.get(NodeTemp + "get_status/"+req.body.Job_id, (error, response, body) => {
        if (error) {
            res.header("access-control-allow-origin", "*");
            res.send(null);
        }
        
        console.log("job....."+response.body)
        data3 = JSON.parse(response.body)
        // data3.Job_id = data2.Job_id;
        console.log("job....."+data3)
        res.header("access-control-allow-origin", "*");
        res.send(data3)
    });
}
exports.orch_interval = orch_interval;





function orch_delete(req, res, next){
    Request.delete(NodeTemp + "delete_template/" + req.body.job_id, (error, response, body) => {
        if (error) {
            res.header("access-control-allow-origin", "*");
            res.send(null);
        }
        console.log("job....."+response.body)
        data3 = JSON.parse(response.body);
        if(data3 != null){
            // console.log("job....."+data3);
            Request.get(NodeTemp + "get_status/"+req.body.job_id, (error, response1, body) => {
                if (error) {
                    res.header("access-control-allow-origin", "*");
                    res.send(null);
                }
                
                console.log("job....."+response1.body)
                data4 = JSON.parse(response1.body)
                // data3.Job_id = data2.Job_id;
                res.header("access-control-allow-origin", "*");
                console.log(data4)
                res.send(data4)
            });
            
            // res.send(data3);
        }
        
    });
}
exports.orch_delete = orch_delete;
