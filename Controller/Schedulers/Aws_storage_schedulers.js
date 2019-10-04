var request = require('request');
var config = require('../../config');
var migration_ip = "192.168.1.229";
var account_id = '';
var async = require("async");
var token='';
var object_count = '';
//var access_key = 'AKIAI3YHOKCSB5AN5AGQ';
//var secret_key = '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';
var access_key = [];
var secret_key = [];
var account_id = [];
var dateobj = new Date();
var month = dateobj.getMonth() + 1;
var day = dateobj.getDate();
var year = dateobj.getFullYear();  

if (day < 10) {
    day = "0" + day;
}
if (month < 10) {
    month = "0" + month;
}
var today = year + "-" + month + "-" + day;


 

function caller() {

    var data = {        
    "username": "Developer",
    "password": "$2a$12$7lLnm29hnfmt6YU1osiyh.0.VZ801T3oBoS09xE0Grb4ooIUqOX.6"
    }

    var options = {
        method: 'POST',
        url: 'http://' + migration_ip + '/migration-studio/create-token/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, async function (error, response, body) {
         token = body.token;
        if (token != undefined) {

            console.log(" Token : " + token);
            Account_Detail();
        }
        else {

            console.log("Token generation failed")
        }

    });
}
 exports.caller = caller;

async function Account_Detail() {

  await  config.query("select * from cb_bil_sp_insert_aws_vm_details(null,null,null,null,null,null,null,null,null,'get_values','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            DBResult = result;
            result_length = DBResult[1].rows.length;
            console.log("DBResult length : " + DBResult[1].rows.length)
            for (let i = 0; i < DBResult[1].rows.length; i++) {

                access_key[i] = DBResult[1].rows[i]["client_id"];
                secret_key[i] = DBResult[1].rows[i]["client_secret"];
                account_id[i] = DBResult[1].rows[i]["subscription_id"];
            }
            call_looping();
        } else {
            throw err;
        }
    });

}
exports.Account_Detail = Account_Detail;

async function call_looping() {
    for (let m = 0; m < result_length; m++) {        
    await calldata(access_key[m], secret_key[m], account_id[m]);
	console.log(access_key + "  " + secret_key[m] + " " + account_id[m])
    }
           
}
exports.call_looping = call_looping;

async function calldata(access_key,secret_key,account_id) {

    var data =
    {
        "source_cloud": {
            "aws_access_key": access_key,
            "aws_secret_access_key": secret_key
        },
        "token": token
    }

    var options1 = {
        method: 'POST',
        url: 'http://192.168.1.229/migration-studio/s2c-migration/aws-list-bucket-details',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
   
   
   //account_id='477463085755';
   
  

  await  request(options1, async function (error, response, body) {
       var arrayObjKeys = Object.keys(body.list);
        var arrayRegion = [];
        var insidedata = [];
        var region_name = '';
        var final_data = '';
        for (let i = 0; i < arrayObjKeys.length; i++) {
            arrayRegion.push(body.list[arrayObjKeys[i]]);
            region_name = arrayObjKeys[i];
            if (region_name == "None") {
                region_name = "N/A";
            }
            for (let j = 0; j < Object.keys(body.list[arrayObjKeys[i]]).length; j++) {
                insidedata = Object.keys(body.list[arrayObjKeys[i]]);
                var bucketdata = body.list[arrayObjKeys[i]][insidedata[j]];
                object_count = bucketdata.length;

                bucketdata = JSON.stringify(bucketdata);
                config.query("select * from cb_bil_sp_insert_aws_storage_details(null,null,'" + region_name + "','" + account_id + "','" + insidedata[j] + "','" + bucketdata + "','" + today + "','" + object_count + "','insert','info');  FETCH ALL IN \"info\"; ", function (err, result, fields) {
                    if (!err) {
                        console.log(result);
                        console.log("insert successfully");
                    }
                    else {
                        console.log('Error while performing Query.', err);

                    }

                });
            }
        }
    });
}
exports.calldata = calldata;