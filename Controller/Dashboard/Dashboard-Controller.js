var config = require('../../config');

function GetDashboardCount(req, res, next) {

    var group_name = '';
    
    	if (req.query.group_name)
		group_name = req.query.group_name;
    
    var p_mode = 'selectCount';
    config.query("select * from cb_cloud_provider_count2('" + group_name + "','" + p_mode + "');", function (err, result, fields) {
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
exports.GetDashboardCount = GetDashboardCount;