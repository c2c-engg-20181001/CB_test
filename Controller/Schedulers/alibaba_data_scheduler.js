 const filepath = '/tmp/getsdatasa.csv';
// const filepath = 'C:/Users/nilesh.zoad/Desktop/cmaasimportfinal/nilesh/804/cloud-brain-service-layer/cloud-brain-service-layer/Controller/CMAAS/getsdatasa.csv';
let OSS = require('ali-oss');
const Core = require('@alicloud/pop-core');

const createCSVFile = require('csv-file-creator');
var config = require('../../config');
const fs = require('fs');
const csv = require('csv-parser');
var acccess_key;
var secret_key;
var bucket_name;
var jack = [];
var region;
var { Pool } = require('pg');





async function getAlibabadata() {
    var Key_Result = [];

    await config.query("select * from cb_mon_alibaba_scheduler_get_data('get_values',null,null,null,'info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            console.log("form Key_Result" + Key_Result)
            call_setdata(Key_Result);
        } else {
            // ow err;
        }
    });
}
exports.getAlibabadata = getAlibabadata;


async function call_setdata(data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].bucket_name != '') {

            acccess_key = data[i].client_id;
            secret_key = data[i].client_secret;
            bucket_name = data[i].bucket_name;
            region = 'oss-' + data[i].region;

            await calling_Object(acccess_key, secret_key, bucket_name, region);
            // console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
        }
    }
}
exports.call_setdata = call_setdata;




async function calling_Object(access_key, secret_key, bucket_name, region) {

    let client = new OSS({
        region: region,
        accessKeyId: access_key,
        accessKeySecret: secret_key,
        bucket: bucket_name
    });


    client.useBucket(bucket_name);
    async function list() {
        try {
            let result = await client.list({
                'max-keys': 50
            })
            //console.log(result);
            data = result.objects;
            jack = [];
            for (i = 0; i < data.length; i++) {
                str = data[i].name
                if (str.includes("BillingItemDetail")) {
                    if (result.objects[i].size != 0) {
                        if (result.objects[i].name.length == 41) {
                            jack.push(result.objects[i]);
                        }    
                        
                    }
                }

            }
            await inserting_Object(jack);
        } catch (err) {
            console.log(err)
        }
    }
    list();
}
exports.calling_Object = calling_Object;



async function inserting_Object(jack) {
    //var objectname = jack;

    await config.query("select * from cb_mon_alibaba_scheduler_get_data('get_client_id',null,null,'" + jack[0].owner.id + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            for (var i = 0; i < Key_Result.length; i++) {
                acccess_key = Key_Result[i].client_id;
                secret_key = Key_Result[i].client_secret;
                bucket_name = Key_Result[i].bucket_name;
                region = 'oss-' + Key_Result[i].region;
                if (bucket_name != '') {
                    inserting_Object_csv(acccess_key, secret_key, bucket_name, region, jack);
                }
                
            }
        } else {
            console.log(err);
        }
    });


    //let client = new OSS({
    //    region: region,
    //    accessKeyId: access_key,
    //    accessKeySecret: secret_key,
    //    bucket: bucket_name
    //});
    //async function get() {
    //    try {
    //        //let result = await client.get('5864924564707484_BillingItemDetail_201907', filepath);
    //        let result = await client.get('5864924564707484_BillingItemDetail_201907', filepath);
    //        console.log(result);
    //    } catch (e) {
    //        console.log(e);
    //    }
    //}
    //get();
}
exports.inserting_Object = inserting_Object;


async function inserting_Object_csv(acccess_key, secret_key, bucket_name, region, jack) {

    let client = new OSS({
        region: region,
        accessKeyId: acccess_key,
        accessKeySecret: secret_key,
        bucket: bucket_name
    });
    for (var j = 0; j < jack.length; j++) {


//        try {
//            if (fs.existsSync(filepath)) {
                //file exists
//            }
//            else {
//                createCSVFile(filepath);
//            }
//        } catch (err) {
//            console.error(err)
//       }  

        //async function getobjdataa() {
        //    try {
        //        let result = await client.get('5864924564707484_BillingItemDetail_201908', 'C:/Users/nilesh.zoad/Desktop/cmaasimportfinal/nilesh/804/cloud-brain-service-layer/cloud-brain-service-layer/Controller/CMAAS/5864924564707484_BillingItemDetail_201908.csv');
        //        console.log(result);
        //    } catch (e) {
        //        console.log(e);
        //    }
        //}
        //getobjdataa();

        async function getobjdataa() {

            try {
                //let result = await client.get('5864924564707484_BillingItemDetail_201907', filepath);
                let result = await client.get(jack[j].name, filepath);
                console.log(result);
                    await inserting_Object_csv1(result);
                 
            } catch (e) {
                console.log(e);
            }
        }
        getobjdataa();
    }
}
exports.inserting_Object_csv = inserting_Object_csv;

var kcounting = 0;


//async function inserting_Object_csv1(result) {
//    sleep(3000);
//    console.log(result);
//    fs.createReadStream(filepath)
//        .pipe(csv({ skipHeader: true }))
//        .on('data', (row) => {
//            try {

                
//                config.query("select * from cb_mon_alibaba_scheduler_get_billingdata('" + row["Billing Cycle"] + "','" + row["Cost Center"] + "','" + row["Account ID"] + "','" + row["Account Name"] + "','" + row["Owner Account ID"] + "','" + row["Owner Account Name"] + "','" + row["Product Code"] + "','" + row["Product Name"] + "','" + row["Product Type"] + "','" + row["Product Detail"] + "','" + row["Subscription Type"] + "','" + row["Payment Time"] + "','" + row["Usage Start Time"] + "','" + row["Usage End Time"] + "','" + row["Service Duration"] + "','" + row["Order No./Bill No."] + "','" + row["Item"] + "','" + row["Billing Type"] + "','" + row["Instance ID"] + "','" + row["Instance Name"] + "','" + row["Resource Group"] + "','" + row["Instance Tag"] + "','" + row["Instance Config"] + "','" + row["Instance Spec"] + "','" + row["Internet IP"] + "','" + row["Intranet IP"] + "','" + row["Region"] + "','" + row["Zone"] + "','" + row["Billing Item"] + "','" + row["List Price"] + "','" + row["List Price Unit"] + "','" + row["Usage"] + "','" + row["Usage Unit"] + "','" + row["Deducted By Resource Package"] + "','" + row["Pretax Gross Amount"] + "','" + row["Invoice Discount"] + "','" + row["Deducted By Coupons"] + "','" + row["Currency"] + "','insert','info');", function (err, result, fields) {
//                        if (!err) {
//                            config.query("select * from cb_mon_alibaba_scheduler_get_billingdata(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,'insert1','info');", function (err, result, fields) {
//                                if (!err) {
//                                    console.log(result);
//                                } else {
//                                    console.log(err);
//                                }

//                            });
//                        } else {
//                            console.log(err);
//                        }

//                    });
                

//            } catch (err) {
//                console.log(err);
//            }

//        })
//        .on('end', () => {
//            console.log('CSV file successfully processed');
//        });

//}
//exports.inserting_Object_csv1 = inserting_Object_csv1;
var stat_currency;



async function inserting_Object_csv1(result) {


    kcounting++;
   console.log('inserting_Object_csv1'+kcounting); 

    var limit = 0;
    limit++;
    fs.createReadStream(filepath)
        .pipe(csv({ skipHeader: true }))
        .on('data', (row) => {
            try {
                if (limit == 1) {
                    if (!("Currency" in row)) {
                        // console.log('absent');
                       //await ifabsent(result);
                        stat_currency = 'fal';
                    }
                    else {
                        // console.log('present');
                       //await ifpresent(result);
                        stat_currency = 'tru';
                    }
                }

             } catch (err) {
                console.log(err);
            }

        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            if (stat_currency == 'tru') {
               // console.log('true', result);
               
                config.query("COPY _cb_mon_alibaba_usage_data_test(billing_cycle,cost_center,account_id,account_name,owneraccount_id,owner_account_name,product_code,product_name,product_type,product_detail,subscription_type,payment_time,usage_start_time,usage_end_time,service_duration,bill_no,item,billing_type,instance_id,instance_name,resource_group,instance_tag,instance_config,instance_spec,internet_ip,intranet_ip,region,zone,billing_item,list_price,list_price_unit,usage,usage_unit,deducted_by_resource_package,pretax_gross_amount,invoice_discount,deducted_by_coupons,currency)from '" + filepath + "' DELIMITER ',' CSV HEADER;", function (err, result) {

                    if (!err) {
                        //   console.log(result);
                        config.query("select * from cb_mon_alibaba_scheduler_get_billingdata_tables('insert','ref')", function (err, result, fields) {
                            if (!err) {
                                console.log('completed with currency');
                            } else {
                                console.log(err);
                            }
                        });
                        
                   }
                    else {

                        console.log(err);



                    }
                });
            }
            else if (stat_currency == 'fal') {
               // console.log('false',result);

                config.query("COPY _cb_mon_alibaba_usage_data_test(billing_cycle,cost_center,account_id,account_name,owneraccount_id,owner_account_name,product_code,product_name,product_type,product_detail,subscription_type,payment_time,usage_start_time,usage_end_time,service_duration,bill_no,item,billing_type,instance_id,instance_name,resource_group,instance_tag,instance_config,instance_spec,internet_ip,intranet_ip,region,zone,billing_item,list_price,list_price_unit,usage,usage_unit,deducted_by_resource_package,pretax_gross_amount,invoice_discount,deducted_by_coupons)from '" + filepath + "' DELIMITER ',' CSV HEADER;", function (err, result) {

                    if (!err) {
                //        //   console.log(result);
                        config.query("select * from cb_mon_alibaba_scheduler_get_billingdata_tables('insert','ref')", function (err, result, fields) {
                            if (!err) {
                                console.log('completed without currency');
                            } else {
                                console.log(err);
                            }
                        });


                    }
                    else {

                        console.log(err);
                    }
                });

            }

        });



    //config.query("COPY _cb_mon_alibaba_usage_data_test(billing_cycle,cost_center,account_id,account_name,owneraccount_id,owner_account_name,product_code,product_name,product_type,product_detail,subscription_type,payment_time,usage_start_time,usage_end_time,service_duration,bill_no,item,billing_type,instance_id,instance_name,resource_group,instance_tag,instance_config,instance_spec,internet_ip,intranet_ip,region,zone,billing_item,list_price,list_price_unit,usage,usage_unit,deducted_by_resource_package,pretax_gross_amount,invoice_discount,deducted_by_coupons)from '" + filepath + "' DELIMITER ',' CSV HEADER;", function (err, result) {

    //    if (!err) {
    //        //   console.log(result);
    //        config.query("select * from cb_mon_alibaba_scheduler_get_billingdata_tables('insert','ref')", function (err, result, fields) {
    //            if (!err) {
    //                console.log(result);
    //            } else {
    //                console.log(err);
    //            }
    //        });


    //    }
    //    else {

    //        console.log(err);
    //    }
    //});

}
exports.inserting_Object_csv1 = inserting_Object_csv1;




