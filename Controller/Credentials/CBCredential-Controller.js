var config = require('../../config');


function InsertCredentials(req, res, next) {

	var name = null;
	var client_id = null;
	var client_secret = null;
	var tenant_id = null;
	var subscription_id = null;
	var cloud_type = null;
	var project_id = null;
	var service_account_json = null;
	var hostname = null;
	var api_port = null;
	var v3_domain_id = null;
	var api_version = null;
	var region = null;
    var security_protocol = null;
    var bucket_name = null;
    var sshkey=null;
    var mode=null;


	if (req.query.name)
		name = req.query.name;

	if (req.query.client_id)
		client_id = req.query.client_id;

	if (req.query.client_secret)
		client_secret = req.query.client_secret;

	if (req.query.tenant_id)
		tenant_id = req.query.tenant_id;

	if (req.query.subscription_id)
		subscription_id = req.query.subscription_id;

	if (req.query.cloud_type)
		cloud_type = req.query.cloud_type;

	if (req.query.project_id)
		project_id = req.query.project_id;

	if (req.query.service_account_json)
		service_account_json = req.query.service_account_json;

	if (req.query.hostname)
		hostname = req.query.hostname;

	if (req.query.api_port)
		api_port = req.query.api_port;

	if (req.query.v3_domain_id)
		v3_domain_id = req.query.v3_domain_id;

	if (req.query.api_version)
		api_version = req.query.api_version;

	if (req.query.region)
		region = req.query.region;

	if (req.query.security_protocol)
        security_protocol = req.query.security_protocol;

    if (req.query.bucket_name)
        bucket_name = req.query.bucket_name;
        
      if (req.query.sshkey)
        sshkey = req.query.sshkey; 
     if (req.query.mode)
     mode = req.query.mode;   
	
    config.query("select * from cb_credentials_sp2(" + name + ", " + client_id + ", " + client_secret + ", " + tenant_id + "," + mode +","+subscription_id + "," + cloud_type + ", " + project_id + ", " + service_account_json + ", " + hostname + ", " + api_port + ", " + v3_domain_id + ", " + api_version + ", " + region + ", " + security_protocol + ", " + bucket_name+","+sshkey+", 'info'); ", function (err, result, fields) {
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
exports.InsertCredentials = InsertCredentials;

function UpdateCredentials(req, res, next) {

    var name = null;
    var client_id = null;
    var client_secret = null;
    var tenant_id = null;
    var subscription_id = null;
    var cloud_type = null;
    var project_id = null;
    var service_account_json = null;
    var hostname = null;
    var api_port = null;
    var v3_domain_id = null;
    var api_version = null;
    var region = null;
    var security_protocol = null;
    var previous_name = null;
    var bucket_name = null;


    if (req.query.name)
        name = req.query.name;

    if (req.query.client_id)
        client_id = req.query.client_id;

    if (req.query.client_secret)
        client_secret = req.query.client_secret;

    if (client_secret == "'????????'") {
        console.log("Catched it");
    }
    else {
        console.log("Missed");
    }

    if (req.query.tenant_id)
        tenant_id = req.query.tenant_id;

    if (req.query.subscription_id)
        subscription_id = req.query.subscription_id;

    if (req.query.cloud_type)
        cloud_type = req.query.cloud_type;

    if (req.query.project_id)
        project_id = req.query.project_id;

    if (req.query.service_account_json)
        service_account_json = req.query.service_account_json;

    if (req.query.hostname)
        hostname = req.query.hostname;

    if (req.query.api_port)
        api_port = req.query.api_port;

    if (req.query.v3_domain_id)
        v3_domain_id = req.query.v3_domain_id;

    if (req.query.api_version)
        api_version = req.query.api_version;

    if (req.query.region)
        region = req.query.region;

    if (req.query.security_protocol)
        security_protocol = req.query.security_protocol;

    if (req.query.previous_name)
        previous_name = req.query.previous_name;

    config.query("select * from cb_update_credentials_sp(" + name + ", " + client_id + ", " + client_secret + ", " + tenant_id + ", 'update', " + subscription_id + "," + cloud_type + ", " + project_id + ", " + service_account_json + ", " + hostname + ", " + api_port + ", " + v3_domain_id + ", " + api_version + ", " + region + ", " + security_protocol + "," + bucket_name + "," + previous_name + ", 'info'); ", function (err, result, fields) {
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
exports.UpdateCredentials = UpdateCredentials;


function GetTenantName(req, res, next) {

	var group_name = null;

	if (req.query.group_name)
		group_name = req.query.group_name;


	config.query("select * from sp_get_cloud_tenant(" + group_name + ", 'info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.GetTenantName = GetTenantName;



