var schedule = require('node-schedule');
var config = require('../../config');
var AWS = require("aws-sdk");

var params = '';
var acccess_key = [];
var secret_key = [];

  

async function getAwsdata() {
    var Key_Result = [];

    await config.query("select * from cb_mon_aws_scheduler_get_data('get_values',null,null,null,'info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            console.log("form Key_Result" + Key_Result)
            call_setdata(Key_Result);
        } else {
            throw err;
        }
    });
}

exports.getAwsdata = getAwsdata;

async function call_setdata(data) {
    for (let i = 0; i < data.length; i++) {
        acccess_key[i] = data[i].client_id;
        secret_key[i] = data[i].client_secret;
        console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
    }
    await calling_Object(acccess_key, secret_key);

}
exports.call_setdata = call_setdata;


async function calling_Object(access_key, secret_key) {
    var account_id = '';

    for (let i = 0; i < access_key.length; i++) {
        await getAwsObject(access_key[i], secret_key[i], async function (firstresult, err) {
            if (!err) {
                console.log("after getAwsObject executed : " + i)
                await validateKeys(firstresult, async function (secondresult, err) {
                    if (!err) {
                        console.log("after validateKeys executed : " + i)
                        account_id = secondresult.Account;
                        await insert_into_DB(access_key[i], secret_key[i], account_id, async function (status, err) {
                            if (!err) {
                                await console.log("account id inserted : " + i);
                            } else {
                                await console.log("account id not inserted");
                            }
                        });

                    }
                    else {
                        console.log("Account not found");
                    }
                });
            } else {
                console.log("error in loading data");
            }
        });

    }


}
exports.calling_Object = calling_Object;

async function getAwsObject(access_key, secret_key, callback) {

    var sts = await new AWS.STS({
        apiVersion: '2011-06-15',
        accessKeyId: access_key,
        secretAccessKey: secret_key
    });

    await callback(sts, false);
}
exports.getAwsObject = getAwsObject;

async function validateKeys(firstresult, callback) {
    await firstresult.getCallerIdentity(params, async function (err, data) {
        if (err) {
            console.log(err, err.stack);
            await callback(err, true);
        }
        else {
          
            await callback(data, false);
        }
    });

}
exports.validateKeys = validateKeys;

async function insert_into_DB(access_key, secret_key, account_id, callback) {

    await config.query("select * from cb_mon_aws_scheduler_get_data('put_values','" + access_key + "','" + secret_key + "','" + account_id + "','info');", async function (err, result) {
        if (!err) {

            await callback(result, false);
        } else {

            await callback(result, true);
        }
    });


}

exports.insert_into_DB = insert_into_DB;



function updata_data() {

    config.query("select * from cb_mon_aws_scheduler_get_data('update_values','null','null','null','info');", function (err, result) {
        if (!err) {
            console.log("data updated")
        } else {
            console.log("data not updated")

        }
    });

}

exports.updata_data = updata_data;
