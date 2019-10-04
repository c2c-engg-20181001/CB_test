var config = require('../../config');


//to get region data
function get_cost_analysis_portability(req, res, next) {
	//var results = [];
	var from_instance_type = null;
	var from_region = null;
	var platform = null;
	var from_cloud = null;
	var to_cloud = null;
	var mode = null;

	if (req.query.from_instance_type) {
		from_instance_type = req.query.from_instance_type;
	}
	if (req.query.from_region) {
		from_region = req.query.from_region;
	}
	if (req.query.from_cloud) {
		from_cloud = req.query.from_cloud;
	}
	if (req.query.to_cloud) {
		to_cloud = req.query.to_cloud;
	}
	if (req.query.platform) {
		platform = req.query.platform;
	}
	if (req.query.mode) {
		mode = req.query.mode;
	}
	//set @start=0; CALL sp_get_cost_analysis_portability('" + from_instance_type + "', '" + from_region + "', '" + platform + "', '" + from_cloud + "_to_" + to_cloud + "', '" + mode + "', @start)
	
    config.query("select * from cb_mon_sp_portability_cost_analysis('" + from_instance_type + "','" + from_region + "','" + platform + "', '" + from_cloud + "_to_" + to_cloud + "', '" + mode + "', 'info');fetch all in \"info\";", function (err, result, fields) {
		if (!err) {
			//console.log(result);
			res.header("access-control-allow-origin", "*");
			res.send(result);
		}
		else {
			console.log('Error while performing Query.', err);
		}
	});
}
exports.get_cost_analysis_portability = get_cost_analysis_portability;

function getCloudProviders(req, res, next) {
	var results = [];
	var entity_id = null;

	if (req.query.entity_id) {
		entity_id = parseInt(req.query.entity_id);
	}

	config.query("set @start=1;CALL sp_get_cloud_providers();select @start;", function (err, result, fields) {
		if (!err) {
			//console.log(result);
			res.header("access-control-allow-origin", "*");
			res.send(result);
		}
		else {
			console.log('Error while performing Query.', err);
		}
	});
}
exports.getCloudProviders = getCloudProviders;
