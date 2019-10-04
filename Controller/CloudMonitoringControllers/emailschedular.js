var config = require('../../config');
var nodeoutlook = require('nodejs-nodemailer-outlook')
var Request = require("request");
var http = require('http');
var dateobj = new Date();
var month = dateobj.getMonth() + 1;
var day = dateobj.getDate();
var year = dateobj.getFullYear();
var number = 1;
var out_id = 'bhagyashri.budhe@click2cloud.net';

function globalEmailFunction() {
    var month_name;
    var sum;
    var eq_budget;
    var s_email;
    var p_user = [];
    var p_budget_amount;
    var entity_id = '';
    var p_mon = ''
    var p_entity = [];
    var p_budget = [];
    var email_recp;
    var email_recp1 = [];
    var value;
    var user_mode = 'get_data_monthly';
    var get_data_mode = 'get_data';
    var p_year = 'Monthly';
    var p_month = 'From_The_Begining_of_Year';
    var DBResult2 = [];
    var DBResult3 = [];
    var DBResult4 = [];
  
  if (month == '1') {
        month_name = 'January';
    }
    else if (month == '2') {
        month_name = 'February';
    }
    else if (month == '3') {
        month_name = 'March';
    }
    else if (month == '4') {
        month_name = 'April';
    }
    else if (month == '5') {
        month_name = 'May';
    }
    else if (month == '6') {
        month_name = 'June';
    }
    else if (month == '7') {
        month_name = 'July';
    }
    else if (month == '8') {
        month_name = 'August';
    }
    else if (month == '9') {
        month_name = 'September';
    }
    else if (month == '10') {
        month_name = 'October';
    }
    else if (month == '11') {
        month_name = 'November';
    }
    else if (month == '12') {
        month_name = 'December';
    }
  
    config.query("select * from _cb_mon_get_monthly_budget('" + month + "','" + year + "','" + user_mode + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            DBResult1 = result;

            for (var i = 0; i < DBResult1[1].rows.length; i++) {

                DBResult2.push(DBResult1[1].rows[i]);

            }

            caller();

        } else {
            console.log('error while performing query.', err);
        }
    });

    async function caller() {
       
        for (var k = 0; k < DBResult2.length; k++) {

            value = DBResult2[k].entity_id;
            p_user = DBResult2[k].user_name;
            await caller1();
            console.log('test');

        }

    }

    async function caller1() {

        await config.query("select * from test_cost_vs_budget_alert_notification('" + p_user + "','" + value + "','" + p_month + "','" + p_year + "', 'info'); FETCH ALL IN \"info\";", function (err, result, fields) {
            if (!err) {

                console.log(result);
                DBResult3 = result;
                DBResult4 = [];
                for (var i = 0; i < DBResult3[1].rows.length; i++) {
                    DBResult4.push(DBResult3[1].rows[i]);

                }
                for (var i = 0; i < DBResult2.length; i++) {
                    for (var j = 0; j < DBResult4.length; j++) {
                        while (DBResult4[j].m.charAt(0) === '0') {
                            DBResult4[j].m = DBResult4[j].m.substr(1);
                        }

                        if (DBResult4[j].p_userid == DBResult2[i].user_name && DBResult4[j].entity_id == DBResult2[i].entity_id && DBResult4[j].m == DBResult2[i].budgetmonth) {
                            if (Math.round((DBResult4[j].sum) * 100)/ 100 > DBResult2[i].equivalent_budget) {
                                sum = Math.round((DBResult4[j].sum) * 100)/ 100;
                                eq_budget = DBResult2[i].equivalent_budget;
                                p_budget_amount = DBResult2[i].budget_amount;
                                email_recp = DBResult2[i].email_recipient.trim();
                                console.log('send email')
                               

                                email_recp1 = email_recp;

                                //var out_id = 'bhagyashri.budhe@click2cloud.net'
                                if (email_recp1 != null) {
                                    nodeoutlook.sendEmail({
                                        auth: {
                                            user: out_id,
                                            pass: "Yashodhan@16"
                                        }, from: out_id,
                                        to: email_recp1,
                                        subject: 'Budget has exceeded your alert threshold',
                                        html: 'Dear Customer,<p>You requested that we alert you when the cost associated with your budget <b>exceeds $' + eq_budget + '</b> for the current month <b>' + month_name +'</b>. The cost associated with this budget is <b>$' + sum + '</b>.</p><b><p>Alert Threshold: >$' + eq_budget + ' </p><p>Actual Amount: $' + sum + ' </p><p>Budgeted Amount : $' + p_budget_amount +' </p></b><br><p>Thank You,</p>Click2Cloud Support',
                                    
                                        onError: (e) => console.log(e),
                                        onSuccess: (l) => console.log(l)
                                    }
                                    );
                                }
                            }
                        }
                    }
                }
            } else {
                console.log('error while performing query.', err);
            }
        });
    }  
}
exports.globalEmailFunction = globalEmailFunction;



