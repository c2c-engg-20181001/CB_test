var config = require('../../config');

function GetCloudAccontDataReport(req, res, next) {

    var dateFilter = null;
    var account_display_id = null;
    var service_id = null;

    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }

    if (req.query.dateFilter) {
        dateFilter = req.query.dateFilter;
    }

    if (req.query.service_id) {
        service_id = parseInt(req.query.service_id);
    }
                                
    config.query("select * from cb_mon_sp_resource_usage_by_cloud_provider('" + account_display_id + "','" + dateFilter + "','" + service_id + "','get_cloud_account_data','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('error while performing query.', err);
        }
    });
}
exports.GetCloudAccontDataReport = GetCloudAccontDataReport;
