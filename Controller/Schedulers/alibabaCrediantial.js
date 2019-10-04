const Core = require('@alicloud/pop-core');
var config = require('../../config');
var acccess_key;
var secret_key;
var account_id;

async function getAlibabadata1() {
    var Key_Result = [];

    await config.query("select * from cb_mon_alibaba_scheduler_get_data('get_values',null,null,null,'info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            console.log("form Key_Result" + Key_Result);
            call_setdata(Key_Result);
        } else {
            throw err;
        }
    });
}
exports.getAlibabadata1 = getAlibabadata1;


async function call_setdata(data) {
    for (let i = 0; i < data.length; i++) {
        acccess_key = data[i].client_id;
        secret_key = data[i].client_secret;
        await calling_Object(acccess_key, secret_key);
        // console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
    }


}
exports.call_setdata = call_setdata;

async function calling_Object(access_key, secret_key) {

    var client = new Core({
        accessKeyId: access_key,
        accessKeySecret: secret_key,
        endpoint: 'https://business.ap-southeast-1.aliyuncs.com',
        apiVersion: '2017-12-14'
    });

    var params = {
        "RegionId": "ap-south-1",
        "BillingCycle": "2019-07"
    };

    var requestOption = {
        method: 'POST'
    };
    await client.request('QueryBillOverview', params, requestOption).then((result) => {

        console.log(JSON.stringify(result));
        account_id = result.Data.AccountID;
        update_account(acccess_key, secret_key, account_id);
    }, (ex) => {
        console.log(ex);
    });

}
exports.calling_Object = calling_Object;


 async function update_account(access_key, secret_key, account_id) {

     await config.query("select * from cb_mon_alibaba_scheduler_get_data('put_values','" + access_key + "','" + secret_key + "','" + account_id + "','info');", async function (err, result, fields) {
        if (!err) {
            updata_data();
        } else {
            throw err;
        }
     });
   
}
exports.update_account = update_account;

 function updata_data() {

  config.query("select * from cb_mon_aws_scheduler_get_data('update_values','null','null','null','info');", function (err, result) {
        if (!err) {
            console.log("data updated");
        } else {
            console.log("data not updated");

        }
    });

}

exports.updata_data = updata_data;