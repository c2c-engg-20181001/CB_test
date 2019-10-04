var config = require('../../config');
var dateobj = new Date();
var month = dateobj.getMonth() + 1;
var day = dateobj.getDate();
var year = dateobj.getFullYear();
var AWS = require("aws-sdk");
 
var instance_id = '';
var instance_type = '';
var instance_state = '';
var availability_zone = '';
var private_ip = '';
var public_ip = '1';
var vm_name = '';
var access_key = [];
var secret_key = [];
var account_id = [];
var result_length = 0;

var DBResult = '';

if (day < 10) {
    day = "0" + day;
}
if (month < 10) {
    month = "0" + month;
}
var today = year + "-" + month + "-" + day;

var region_name = ['us-east-2', 'us-east-1', 'us-west-1', 'us-west-2', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1',
    'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'cn-north-1', 'cn-northwest-1', 'eu-central-1', 'eu-west-1', 'eu-west-2',
    'eu-west-3', 'eu-north-1', 'sa-east-1'];

var params = {
    Filters: [
        {
            Name: 'instance-state-name',
            Values: ['stopped']
        }
    ],

};

var params1 = {
    Filters: [
        {
            Name: 'instance-state-name',
            Values: ['running']
        }
    ],

};




function Account_Detail() {

    config.query("select * from cb_bil_sp_insert_aws_vm_details(null,null,null,null,null,null,null,null,null,'get_values','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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

function call_looping() {
    for (let m = 0; m < result_length; m++) {        
    insert_aws_vm_details(access_key[m], secret_key[m], account_id[m]);
    }
           
}
exports.call_looping = call_looping;

function insert_aws_vm_details(access_key, secret_key, account_id) {

    for (let k = 0; k < 2; k++) {

        for (let i = 0; i < region_name.length; i++) {
            AWS.config.update({ region: region_name[i] });



            var ec2 = new AWS.EC2({
                apiVersion: '2016-11-15',
                accessKeyId: access_key,
                secretAccessKey: secret_key
            });

            var temp;

            if (k == 0) {
                temp = params;
            }
            else {
                temp = params1;
            }

            ec2.describeInstances(temp,function (err, data) {
                if (err) {
                    console.log(`describeInstances error: ${err}`)
                } else {

                    for (let j = 0; j < data.Reservations.length; j++) {

                        instance_id = data.Reservations[j].Instances[0].InstanceId;
                        instance_type = data.Reservations[j].Instances[0].InstanceType;
                        instance_state = data.Reservations[j].Instances[0].State.Name;
                        account_id = data.Reservations[j].OwnerId;
                        availability_zone = data.Reservations[j].Instances[0].Placement.AvailabilityZone;
                        private_ip = data.Reservations[j].Instances[0].PrivateIpAddress;
                        public_ip = data.Reservations[j].Instances[0].PublicIpAddress;
                        if (data.Reservations[j].Instances[0].Tags.length > 0) {
                            if (data.Reservations[j].Instances[0].Tags[0].Key == "Name") {
                                vm_name = data.Reservations[j].Instances[0].Tags[0].Value
                            }
                            else {
                                vm_name = "N/A";
                            }
                        } else {
                            vm_name = "N/A";
                        }
                        console.log("Instance id : " + instance_id);
                        console.log("InstanceType :  " + instance_type);
                        console.log("State : " + instance_state);
                        console.log("Account_id : " + account_id);
                        console.log("AvailabilityZone :" + availability_zone);
                        console.log("IP address : " + private_ip);
                        console.log("Name : " + vm_name);
                        if (vm_name == '') {
                            console.log("I am undefined")
                        }
                        if (k == 1) {
                            console.log("Public IP: " + public_ip);
                        }
                        console.log("<---------------------------->")
                        config.query("select * from cb_bil_sp_insert_aws_vm_details('" + instance_id + "','" + instance_type + "','" + availability_zone + "','" + private_ip + "','" + public_ip + "','" + instance_state + "','" + account_id + "','" + today + "','" + vm_name + "','insert','info');  FETCH ALL IN \"info\"; ", function (err, result, fields) {
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
    }

}
exports.insert_aws_vm_details = insert_aws_vm_details;