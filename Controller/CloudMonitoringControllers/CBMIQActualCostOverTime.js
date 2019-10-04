var config = require('../../config');

function ActualCostOverTimeReportController(req, res, next) {

    var p_account_display_id = "";
    var p_date_range = "";
    var p_show_by = "";
    var p_mode = "";
    // we temp not used provider id but we pass
    if (req.query.p_date_range) {
        p_date_range = req.query.p_date_range;
    }
    if (req.query.p_account_display_id) {
        p_account_display_id = req.query.p_account_display_id;
    }
    if (req.query.p_show_by) {
        p_show_by = req.query.p_show_by;
    }
    if (req.query.p_mode) {
        p_mode = req.query.p_mode;
    }
    //SELECT * FROM cb_mon_sp_actual_cost_over_time('get_cloud_account_data',  'Last_6_Months', 'Daily', '477463085755,efbaf842-f428-4020-8718-9e3a642fa2c6', 'info');
    config.query("select * from cb_mon_sp_actual_cost_over_time('" + p_mode + "','" + p_date_range + "','" + p_show_by + "','" + p_account_display_id + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

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
exports.ActualCostOverTimeReportController = ActualCostOverTimeReportController;



