var config = require('../../config');

/*-------- Network ----------*/
function getDestNetworkData(req, res, next) {  
    var destCloudName = null;
    var spName = null;
    var mode = null;
    var regionId = null;
    var srcCloudName = null;
    var regionNames = null;
    if (req.body.destCloudName) {
        destCloudName = req.body.destCloudName;
    } 
    if (req.body.srcCloudName) {
        srcCloudName = req.body.srcCloudName;
    }
    if (req.body.regionName) {
        regionNames = req.body.regionName;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    if (req.body.region) {
        regionId = req.body.region;
    }
    if (req.body.source) {
        source = req.body.source;
        if (source == 'getDestNetworkPriceData') {
            spName = '_cb_comp_sp_get_azure_gcp_network_cost_list';           
        }
    }
    config.query("select * from " + spName + "('" + destCloudName + "','" + srcCloudName + "'," + regionId + ",'" + regionNames + "','" + mode + "');",
        function (err, result, fields) {
        if (!err) {
            console.log(result);
            var out = result.rows
            res.header("access-control-allow-origin", "*");
            res.send(out);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.getDestNetworkData = getDestNetworkData;