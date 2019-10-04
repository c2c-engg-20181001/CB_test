var config = require('../../config');




// function CostAnalysisReportController(req, res, next) {

//     var p_date_range = 0;
//     var p_account_display_id = "";
//     var mode = "";
//     // we temp not used provider id but we pass
//     if (req.query.p_date_range) {
//         p_date_range = req.query.p_date_range;
//     }
//     if (req.query.p_account_display_id) {
//         p_account_display_id = req.query.p_account_display_id;
//     }
//     if (req.query.mode) {
//         mode = req.query.mode;
//     }
//     //select * from cb_mon_sp_cost_analysis_report('Last_2_Months', '477463085755', 'select', 'ref')
//     config.query("select * from cb_mon_sp_cost_analysis_report('" + p_date_range + "','" + p_account_display_id + "','" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {

//         if (!err) {
//             console.log(result);
//             res.header("access-control-allow-origin", "*");
//             res.send(result);
//         }
//         else {
//             console.log('Error while performing Query.', err);
//         }
//     });
// }
// exports.CostAnalysisReportController = CostAnalysisReportController;



function CostAnalysisReportController(req, res, next) {


    var p_date_range = 0;
    var p_account_display_id = "";
    var mode = "";
    // we temp not used provider id but we pass
    if (req.query.p_date_range) {
        p_date_range = req.query.p_date_range;
    }
    if (req.query.p_account_display_id) {
        p_account_display_id = req.query.p_account_display_id;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    //select * from cb_mon_sp_cost_analysis_report('Last_2_Months', '477463085755', 'select', 'ref')
  //  config.query("select * from cb_mon_sp_cost_analysis_report('" + p_date_range + "','" + p_account_display_id + "','" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
    config.query("select * from cb_mon_sp_cost_analysis_report_1('" + p_date_range + "','" + p_account_display_id + "','" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {


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
exports.CostAnalysisReportController = CostAnalysisReportController;








