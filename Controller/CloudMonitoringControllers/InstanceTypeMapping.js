var config = require('../../config');


//to get instance type mapping
function getInstanceTypeMapping(req, res, next) {
    var results = [];
    if (req.query.filter_by_vcpu) {
        filter_by_vcpu = req.query.filter_by_vcpu;
    }
    if (req.query.from_cloud) {
        from_cloud = req.query.from_cloud;
    }
    if (req.query.to_cloud) {
        to_cloud = req.query.to_cloud;
    }
    if (req.query.to_region) {
        to_region = req.query.to_region;
    }
 
        config.query("select * from cb_mon_sp_get_instance_type_mapping('" + filter_by_vcpu + "','" + to_region + "','" + from_cloud + "_to_" + to_cloud + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getInstanceTypeMapping = getInstanceTypeMapping;