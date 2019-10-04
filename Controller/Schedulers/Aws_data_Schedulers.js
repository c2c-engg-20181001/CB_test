var config = require('../../config');


//var config = require('./config_165');
let date = require('date-and-time');
let now = new Date();  //Current Date
var AWS = require('aws-sdk');
var extract = require('extract-zip');
var s3 = require('s3');
var async = require("async");
var schedule = require('node-schedule');
//var AWS_update = require('./Aws_data_updated_Scheduler');
var con;
var aws_account_display_id = [];
var access_key = [];
var secret_key = [];
var bucket_name = [];
var no_of_account = 0;
var old_counter = 0;
var new_counter = 0;
var account_status = [];
var new_account = [];
var old_account = [];
var dateMonth;
var totalLength = 0;
var dateobj = new Date();
var month = dateobj.getMonth() + 1;
var day = dateobj.getDate();
var year = dateobj.getFullYear();
var newOrOldUser = 'new';
var fileNames = [];
var gFileNameIndex = 0;

//updateAwsDatabase();

 

// to updarte DB
function updateAwsDatabase() {
    var DBResult = [];
    var i;
    console.log('AWS Database Updated!');
    if (month < 10) {
        month = "0" + month;
    }
    dateMonth = year + "-" + month;
    //console.log("datemonth : " + dateMonth);

    config.query("select * from cb_mon_sp_aws_scheduler(null,null,null,null,'get_info','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            DBResult = result;
            caller(0)
        } else {
            throw err;
        }
    })

    function caller(i) {

        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<_______________________>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  [ " + i + " ]");
        console.log("From Call : Method");
        console.log(" account_display_id:" + DBResult[1].rows[i]["subscription_id"]);
        console.log(" Acc:" + DBResult[1].rows[i]["client_id"]);
        console.log(" Sec :" + DBResult[1].rows[i]["client_secret"]);
        console.log(" Bucket :" + DBResult[1].rows[i]["bucket_name"]);

        aws_account_display_id[i] = DBResult[1].rows[i]["subscription_id"];
        access_key[i] = DBResult[1].rows[i]["client_id"];
        secret_key[i] = DBResult[1].rows[i]["client_secret"];
        bucket_name[i] = DBResult[1].rows[i]["bucket_name"];




        Vitalfunction(aws_account_display_id[i], access_key[i], secret_key[i], bucket_name[i], function (finalstatus, err) {
            if (!err) {
                if (finalstatus == true) {
                    console.log("Data inserted sucessfully");
                    i++;
                    if (i < DBResult[1].rows.length) {
                     newOrOldUser = 'new';
                            fileNames = [];
                            gFileNameIndex = 0;
                        caller(i)
                    } if (i == DBResult[1].rows.length) {
                        updateAccountId();
                    }
                }
            } else {
                i++;
                if (i < DBResult[1].rows.length) {
                    caller(i)
                }
                if (i == DBResult[1].rows.length) {
                    updateAccountId();
                }
            }
        })

    }

}
exports.updateAwsDatabase = updateAwsDatabase;

// vital function to perform all the operation
function Vitalfunction(aws_account_display_id, access_key, secret_key, bucket_name, callback) {
    var finalstatus;
    checkUser(aws_account_display_id, function (status, err) {
        if (!err) {
            if (status == "newuser" || status == "olduser") {
                console.log(" New user :" + aws_account_display_id);
                downloadData(aws_account_display_id, access_key, secret_key, bucket_name, function (downloadstatus, err) {
                    if (!err) {
                        if (downloadstatus == true) {
                            console.log("All data downloaded ");
                            unzipfileAll(aws_account_display_id, function (unzipAllstatus, err) {
                                if (!err) {
                                    if (unzipAllstatus == true) {
                                       // console.log("unzip files stored in folder");
                                        putAlldata(aws_account_display_id, function (insertAllstatus, err) {
                                            if (!err) {
                                                finalstatus = true;
                                                //console.log("Data inserted successfully");
                                                callback(finalstatus, false);
                                            } else {
                                                console.log("Data not  inserted");
                                                callback(finalstatus, true)
                                            }
                                        })
                                    } else {
                                        console.log("unzip Status false");
                                        callback(finalstatus, true)
                                    }
                                } else {
                                    console.log("Error in unzip");
                                    callback(finalstatus, true)
                                }// end  of unzipall
                            })
                        }
                        else {
                            console.log("downloading false");
                            callback(finalstatus, true);
                        }
                    } else {
                        console.log("Error in downloading");
                        callback(finalstatus, true);
                    }  // end of downloadData
                })
            }  // end of Newuser

          
        }  // end of true from checkuser
    })  // end of checkuser
}
exports.Vitalfunction = Vitalfunction;

//  to check whether user is new or old
function checkUser(aws_account_display_id, callback) {
    var account_id = aws_account_display_id;
    var status;

    //.query("select * from aws_account_data_scheduler where account_id ='" + account_id + "' limit 5  ", function (err, results, fields) {
    config.query("select * from cb_mon_sp_aws_scheduler('" + account_id + "',null,null,null,'check','info');FETCH ALL IN \"info\";", function (err, results, fields) {
        if (!err) {
            if (results[1].rows.length > 0) {
                status = "olduser";
              //  console.log("Old user");
                newOrOldUser = 'old';
                callback(status, false)
            } else {
                status = "newuser";
             //   console.log("New user");
                newOrOldUser = 'new';
                callback(status, false)
            }
        }
        else {
            throw err;
        }
    })
}
exports.checkUser = checkUser;

// to download data object
function downloadData(aws_account_display_id, access_key, secret_key, bucket_name, callback) {
    var finaldownloadstatus;
    var downloadstatus;
    var downloadingstatus;
    var account_id = aws_account_display_id;
    var bucketName = bucket_name;
    var Prefix = aws_account_display_id + "-aws-billing-detailed-line-items-with-resources-and-tags-";
    var accessKeyId = access_key;
    var secretAccessKey = secret_key;
    var j = 0;
    var i = 0;
    totalLength;
  //  var localFile = "/tmp/zip_aws_file/";
    var localFile = "/tmp/zip_aws_file/";
    var s3client = new AWS.S3({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    });
    var client = s3.createClient({
        maxAsyncS3: 20,     // this is the default 
        s3RetryCount: 3,    // this is the default 
        s3RetryDelay: 1000, // this is the default 
        multipartUploadThreshold: 20971520, // this is the default (20 MB) 
        multipartUploadSize: 15728640, // this is the default (15 MB) 
        s3Options: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });
    var params = {
        Bucket: bucketName,
        Prefix: Prefix
    };
    // Get List of bucket objects    
    s3client.listObjects(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            downloadstatus = "fail";
            callback(downloadstatus, true)
        }
        else {
            console.log("Length of bucket object is " + data["Contents"].length);                // no. of  file available in bucket

            totalLength = data["Contents"].length;
            
                        
            if (totalLength > 0)
            
            {
                var flag = false;
            
                 while (i < totalLength) {
                    if (newOrOldUser == 'new')
                        flag = true;
                    var n = data["Contents"][i]["Key"];
                    if (n.indexOf("-" + year + "-" + month) != -1 || flag)
                    {
                        fileNames.push(n);
                        var param =
                        {
                            localFile: localFile + data["Contents"][i]["Key"],
                            s3Params:
                            {
                                Bucket: bucketName,
                                Key: data["Contents"][i]["Key"],
                            },
                        };
                        DownloadBucketObject(param, function (statusfile, err) {
                            if (!err) {
                                if (statusfile == true) {
                                    j++;
                                    console.log("Csv file Successfully Downloaded" + j);
                                    if (j == totalLength || newOrOldUser == 'old') {
                                        downloadstatus = true;
                                        callback(downloadstatus, false)
                                    }
                                }
                            }
                        })
                    }
                    i++;
                } // end of loop
            }
            else
            {
                console.log("length : 0")
            }
        }
    });
    // Download the bucket objects
    function DownloadBucketObject(param, callback) {
        var statusfile;
        var downloader = client.downloadFile(param);
        downloader.on('error', function (err) {
            console.error("unable to download:", err.stack);
        });
        downloader.on('end', function (err) {
            if (!err) {
                statusfile = true;
                callback(statusfile, false)
            }
        });
    }
}
exports.downloadData = downloadData;
 
// unzip all file fro new user
function unzipfileAll(aws_account_display_id, callback) {
    var unzipAllstatus; 
    var newlocation = "/tmp/unzip_aws_file/";

    for (var i = 0; i < fileNames.length; i++) {
        extract("/tmp/zip_aws_file/" + fileNames[i], { dir: newlocation }, function (err) {
            if (err == undefined) {
                unzipAllstatus = true;
                callback(unzipAllstatus, false);
            }
            else {
                unzipAllstatus = false;
                callback(unzipAllstatus, true);
            }
        });
    }  
}
exports.unzipfileAll = unzipfileAll;
 
// put all data of new user to DB
function putAlldata(account_display_id, callback) {
    var account_id = account_display_id;
    var insertAllstatus;
    var fName;

    if (newOrOldUser == 'old') {
        deleteData(account_display_id, function (deletestatus, err) {
            if (!err) {
                if (deletestatus == true) {
                    console.log("successfully deleted data");
                    fName = fileNames[0].replace('.zip', '');
                    config.query("COPY _cb_mon_aws_account_data(invoice_id,payer_account_id,linked_account_id,record_type,record_id,product_name,rate_id,subscription_id,pricing_plan_id,usage_type,operation,availability_zone,reserved_instance,item_description,usage_start_date,usage_end_date,usage_quantity,rate,cost,resource_id)from '/tmp/unzip_aws_file/" + fName + "' DELIMITER ',' CSV HEADER;", function (err, result) {

                        if (!err) {
                            console.log(result);
                            insertstatus = true;
                            callback(insertstatus, false)
                        }
                        else {
                            callback(insertstatus, true)
                            
                            throw err;
                        }
                    });
                }
                else {
                    console.log("data not deleted");
                }
            }
            else {
                console.log("error in deleting data");
            }
        });
    } // new user
    else {
          function putAllDB() {
              
              if(fileNames[gFileNameIndex].indexOf('.zip') != -1 )
                fName = fileNames[gFileNameIndex].replace('.zip', '');
              else
                fName = fileNames[gFileNameIndex];
              console.log("from putallDB called: "+ fName );
              gFileNameIndex++;
              config.query("COPY _cb_mon_aws_account_data(invoice_id,payer_account_id,linked_account_id,record_type,record_id,product_name,rate_id,subscription_id,pricing_plan_id,usage_type,operation,availability_zone,reserved_instance,item_description,usage_start_date,usage_end_date,usage_quantity,rate,cost,resource_id)from '/tmp/unzip_aws_file/" + fName + "' DELIMITER ',' CSV HEADER;", function (err, result) {
                  
                    if (!err) {
                        console.log("Data inserted successfully : " + gFileNameIndex);    
                    }
                    else {
                    console.log("i am from Error method while inserting file")
                    var timing = day + '-' + month+'-'+ year + '  ' + dateobj.getHours() + ":" + dateobj.getMinutes() + ":" + dateobj.getSeconds();
                    console.log("timing : " + timing);
config.query("select * from cb_mon_aws_scheduler_error('" + fName + "','" + timing +"','put_error','info');FETCH ALL IN \"info\";",function (err,results, fields) {
                              if (!err) {
                              console.log("error  log inserted ");
                              }else{
                              console.log("error log not inserted ");
                              }
                              });
                        console.log(err);
                    }
              });
              if (gFileNameIndex == totalLength) {
                  insertAllstatus = true;
                  callback(insertAllstatus, false);
                  console.log("Data inserted successfully : " + gFileNameIndex);
              }
        }
        putAllDB();
    }
}
exports.putAlldata = putAlldata;

// delete previous data of same month 
function deleteData(account_id1, callback) {
    var account_id = account_id1;
    var deletestatus;

    config.query("select * from cb_mon_sp_aws_scheduler('" + account_id + "',null,null,null,'delete','info');", function (err, result, fields) {
        if (!err) {
          //  console.log("success");
            deletestatus = true;
            callback(deletestatus, false)
        }
        else {
            console.log("fail");
            deletestatus = false;
            callback(deletestatus, true)
        }
    });
}
exports.deleteData = deleteData;

// it will update account_id field
function updateAccountId() {

    config.query("select * from cb_mon_sp_aws_scheduler(null,null,null,null,'deleteblankupdate','info');", function (err, result, fields) {
        if (!err) {
            console.log("Account id update Successfully");
        } else {
            console.log("Error in updating Account ID");
            throw err;
        }
    })
}
exports.updateAccountId = updateAccountId;





