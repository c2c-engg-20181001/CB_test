var config = require('../../config');

var acccess_key;
var secret_key;
var tenant_id;
var subscription;
var jack = [];

async function getAzureedata() {
    var Key_Result = [];

    await config.query("select * from cb_mon_azuree_scheduler_get_data('get_values',null,null,null,'info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            console.log("form Key_Result" + Key_Result)
            call_setdata(Key_Result);
        } else {
            console.log(err);
        }
    });
}
exports.getAzureedata = getAzureedata;


async function call_setdata(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].bucket_name != '') {

            acccess_key = data[i].client_id;
            secret_key = data[i].client_secret;
            tenant_id = data[i].tenant_id;
            subscription = data[i].subscription_id;

            await call_setdata111(acccess_key, secret_key, tenant_id, subscription);
            // console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
        }
    }
}
exports.call_setdata = call_setdata;




var las = 4;

async function call_setdata111(acccess_key, secret_key, tenant_id, subscription) {

    for (let j = 210; j > 6; j -= las) {

        var d = new Date();
        d.setDate(d.getDate() - j);
        var blablabla = d;
        var str2 = 'T00:00:00Z';
        var currentdate = new Date().toISOString();
        var currentdate1 = currentdate.slice(0, 10);
        var currentdate2 = currentdate1.concat(str2);
        var previousdate = d.toISOString();
        var previousdate1 = previousdate.slice(0, 10);
        var previousdate2 = previousdate1.concat(str2);
        await get_performance1(currentdate2, previousdate2, acccess_key, secret_key, tenant_id, subscription);
        // console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
    }


}
exports.call_setdata111 = call_setdata111;



async function get_performance1(currentdate2, previousdate2, acccess_key, secret_key, tenant_id, subscription) {

    var Tenant_id = tenant_id;
    var p_client_id = acccess_key;
    var p_client_secret = secret_key;
    var p_grant_type = 'client_credentials';
    var p_resource = 'https://management.azure.com/';
    var request = require("request");
   // var vmname;
    var b = [];
   // var resource_group;
   // var Performance_data = [];
    var q = 0;

    //var d = new Date();
    //d.setDate(d.getDate() - 46);
    //var blablabla = d;
    //var str2 = 'T00:00:00Z';
    //var currentdate = new Date().toISOString();
    //var currentdate1 = currentdate.slice(0, 10);
    //var currentdate2 = currentdate1.concat(str2);
    //var previousdate = d.toISOString();
    //var previousdate1 = previousdate.slice(0, 10);
    //var previousdate2 = previousdate1.concat(str2);

    var options = {
        method: 'POST',
        url: 'https://login.microsoftonline.com/' + Tenant_id + '/oauth2/token',
        headers:
        {
            'Postman-Token': '162cff28-089a-4d30-bdc1-30b3e6c1e8f1',
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form:
        {
            client_id: p_client_id,
            client_secret: p_client_secret,
            grant_type: p_grant_type,
            resource: p_resource,
            undefined: undefined
        }
    };
    request(options, function (error, response, body) {
        // if (error) throw new Error(error);
        // console.log(body);
        var object1 = JSON.parse(body);
        var token = object1.access_token;
        var bearerToken = 'Bearer ' + token;
         
                     var options = {
                method: 'GET',
                //url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/' + resource_group + '/providers/Microsoft.Compute/virtualMachines/' + vmname + '/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU&timespan=2019-05-15T05:47:00Z/2019-05-15T05:55:00Z&aggregation=Average,minimum,maximum,total',
                         //url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview&reportedStartTime=2019-04-15T00:00:00Z&reportedEndTime=2019-05-15T00:00:00Z&showDetails=true',
                         url: 'https://management.azure.com/subscriptions/' + subscription + '/providers/Microsoft.Commerce/UsageAggregates?api-version=2015-06-01-preview&reportedStartTime=' + previousdate2 + '&reportedEndTime=' + currentdate2 + '&showDetails=true',

                //url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/' + resource_group + '/providers/Microsoft.Compute/virtualMachines/' + vmname + '/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU,Network%20OUT,Network%20IN,Disk%20Write%20Bytes,Disk%20Read%20Bytes&timespan=' + previousdate +'/' + currentdate +'&aggregation=Average,minimum,maximum,total',
                headers:
                {
                    'Authorization': bearerToken
                },
            };
            request(options, function (error, response, body) {
                if (error) console.log(error);
                var i; 
                // console.log(body);
                b = JSON.parse(body);
                // console.log(b);
                //for (i = 0; i < b.value.length; i++) {

                //    config.query("select * from cb_mon_azure_scheduler_get_billingdata(" + b.value[i].id + "','" + b.value[i].name + "','" + b.value[i].type + "','" + b.value[i].properties.subscriptionId + "','" + b.value[i].properties.usageStartTime + "','" + b.value[i].properties.usageEndTime + "','" + b.value[i].properties.meterName + "','" + b.value[i].properties.meterRegion + "','" + b.value[i].properties.meterCategory + "','" + b.value[i].properties.meterSubCategory + "','" + b.value[i].properties.unit + "','" + b.value[i].properties.meterId + "',null,'" + b.value[i].properties.quantity + "','','insert','info');", function (err, result, fields) {
                //        if (!err) {
                //            console.log(result);
                //        } else {
                //            console.log(err);
                //        }
                //    });
                //}


                //const text = 'INSERT INTO _cb_mon_azureapiusage1(usageid integer ,id ,name ,type ,subscriptionid ,usagestarttime ,usageendtime ,metername ,meterregion ,metercategory ,metersubcategory ,unit ,meterid ,infofieldproject ,quantity, instancedata ,price) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *'
                //var values = [null,'" + b.value[i].id + "','" + b.value[i].name + "','" + b.value[i].type + "','" + b.value[i].properties.subscriptionId + "','" + b.value[i].properties.usageStartTime + "','" + b.value[i].properties.usageEndTime + "','" + b.value[i].properties.meterName + "','" + b.value[i].properties.meterRegion + "','" + b.value[i].properties.meterCategory + "','" + b.value[i].properties.meterSubCategory + "','" + b.value[i].properties.unit + "','" + b.value[i].properties.meterId + "',null,'" + b.value[i].properties.quantity + "',null]
                //// callback
                //client.query(text, values, (err, res) => {
                //    if (err) {
                //        console.log(err.stack)
                //    } else {
                //        console.log(res.rows[0])
                //        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
                //    }
                //})
                //b.value[i].properties.quantity

                var countt='0';
                for (i = 0; i < b.value.length; i++) {

                    const text = 'INSERT INTO _cb_mon_azureapiusage(id ,name ,type ,subscriptionid ,usagestarttime ,usageendtime ,metername ,meterregion ,metercategory ,metersubcategory ,unit ,meterid ,infofieldproject ,quantity, instancedata) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 ) RETURNING *'
                    var values = [b.value[i].id, b.value[i].name, b.value[i].type, b.value[i].properties.subscriptionId, b.value[i].properties.usageStartTime, b.value[i].properties.usageEndTime, b.value[i].properties.meterName, b.value[i].properties.meterRegion, b.value[i].properties.meterCategory, b.value[i].properties.meterSubCategory, b.value[i].properties.unit, b.value[i].properties.meterId, null, b.value[i].properties.quantity, b.value[i].properties.instanceData]
                    // callback
                    config.query(text, values, (err, res) => {
                        if (err) {
                            console.log(err)
                        } else {
                           

                            countt++;
                            if (countt == 1) {
                                config.query("select * from cb_mon_sp_azure_api_data2('Calculate_price', null, null,'info');", function (err, rows, fields) {
                                    if (!err) {
                                         console.log("Calculated Price");

                                        config.query("select * from cb_mon_azurenew_scheduler_get_billingdata_tables('insert','ref')", function (err, result, fields) {
                                            if (!err) {
                                                console.log("Completed!!!");
                                            } else {
                                                console.log(err);
                                            }
                                        });


                                    }
                                    else {
                                        console.log(err);
                                    }
                                });

                            /*

                            console.log(res.rows[0])
                            config.query("select * from cb_mon_azurenew_scheduler_get_billingdata_tables('insert','ref')", function (err, result, fields) {
                                if (!err) {
                                    console.log(result);
                                } else {
                                    console.log(err);
                                }
                            });
                         */

                        }
                        }
                    })
                }
            });
                
    });


}
exports.get_performance1 = get_performance1;

