var config = require('../../config');



//get account name
function getAccountName(req, res, next) {
    var result = [];
    var user_id = null;
    var cloud_id = null;
    var user_group="";
    
    if (req.query.user_group) {
        user_group = req.query.user_group;
    }
    if (req.query.cloud_id) {
        cloud_id = parseInt(req.query.cloud_id);
    }
    config.query("select * from cb_mon_sp_get_predictive_analysis_report(" + cloud_id + ",null,null,null,null,null,'"+user_group+"','getAccount','info'); FETCH ALL IN \"info\"; ", function (err, result, fields) {
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
exports.getAccountName = getAccountName;

// get instance detail
function getInstance_detail(req, res, next) {
    var result = [];
    var account_display_id = null;
    var cloud_id = null;
      var user_group="";
    
    if (req.query.user_group) {
        user_group = req.query.user_group;
        }
    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }
    if (req.query.cloud_id) {
        cloud_id = parseInt(req.query.cloud_id);
    }
    config.query("select * from cb_mon_sp_get_predictive_analysis_report(" + cloud_id + ",'" + account_display_id + "',null,null,null,null,'"+user_group+"','getInstance','info'); FETCH ALL IN \"info\"; ", function (err, result, fields) {
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
exports.getInstance_detail = getInstance_detail;

// for  getting region
function get_instance_region(req, res, next) {
    var result = [];
    var account_display_id = null;
    var instance_type_filter = null;
    var user_group="";
    
    if (req.query.user_group) {
        user_group = req.query.user_group;
        }
        
    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }
    if (req.query.instance_type_filter) {
        instance_type_filter = req.query.instance_type_filter;
    }
    config.query("select * from cb_mon_sp_get_predictive_analysis_report(null,'" + account_display_id + "','" + instance_type_filter + "',null,null,null,'"+user_group+"','getRegion','info'); FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.get_instance_region = get_instance_region;


// get usage cost
function get_cost_previousUsage(req, res, next) {
    var result = [];
    var account_display_id = null;
    var cloud_id = null;
    var instance_type_filter = null;
    var instance_region = null;
    var previous_date = null;
    var next_date = null;
    var user_group="";
    
    if (req.query.user_group) {
        user_group = req.query.user_group;
        
        }
    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
    }
    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }
    if (req.query.instance_type_filter) {
        instance_type_filter = req.query.instance_type_filter;
    }
    if (req.query.instance_region) {
        instance_region = req.query.instance_region;
    }
    if (req.query.previous_date) {
        previous_date = req.query.previous_date;
    }
    if (req.query.next_date) {
        next_date = req.query.next_date;
    }
    config.query("select * from cb_mon_sp_get_predictive_analysis_report('" + cloud_id + "','" + account_display_id + "','" + instance_type_filter + "','" + instance_region + "','" + previous_date + "','" + next_date + "','"+user_group+"','getCostPreviousUsage','info'); FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.get_cost_previousUsage = get_cost_previousUsage;