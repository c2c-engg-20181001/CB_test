var config = require('../../config');




function billingFillterForReport(req, res, next) {


    var list_id = "";
    var selectMode = "";
    var user_group="";
    // we temp not used provider id but we pass
    if (req.query.list_id) {
        list_id = req.query.list_id;
    }
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    if (req.query.user_group) {
        user_group = req.query.user_group;
    }

    config.query("select * from cb_bil_sp_select_filter_list('" + list_id + "','"+user_group+"','" + selectMode + "');", function (err, result) {
    //config.query("select * from cb_bil_sp_select_filter_list_1('" + list_id + "','"+user_group+"','" + selectMode + "');", function (err, result) {

        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.billingFillterForReport = billingFillterForReport;


    
function billingFillterForReport_new(req, res, next) {



    var list_id = "";
    var selectMode = "";
    var user_group = "";
    // we temp not used provider id but we pass
    if (req.query.list_id) {
        list_id = req.query.list_id;
    }
    if (req.query.selectMode) {
        selectMode = req.query.selectMode;
    }
    if (req.query.user_group) {
        user_group = req.query.user_group;
    }


  //  config.query("select * from cb_bil_sp_select_filter_list('" + list_id + "','" + user_group + "','" + selectMode + "');", function (err, result) {
    config.query("select * from cb_bil_sp_select_filter_list_1('" + list_id + "','" + user_group + "','" + selectMode + "');", function (err, result) {


        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.billingFillterForReport_new = billingFillterForReport_new;