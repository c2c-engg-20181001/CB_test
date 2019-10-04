var config = require('../../config');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';
var request = require('request');
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url
var migrationStudioControllerFile = require('./migration-studio-controller')

// var migration_ip_linux = "http://192.168.1.229/migration-studio/"

function GetCredentialsAndVMDetails(req, res, next) {

	var tenantid = null;
	var p_mode = null;
    var p_cloud=null;
    var cipher = null;
    var crypted = null;

	if (req.query.tenantid)
		tenantid = req.query.tenantid;

	if (req.query.p_mode)
		p_mode = req.query.p_mode;
   
   	if (req.query.p_cloud)
		p_cloud = req.query.p_cloud;
   
   	if (req.query.p_group)
		p_group = req.query.p_group;



	config.query("select * from cb_mig_sp_get_credentials_and_vms4('" + tenantid+"','"+p_mode+"','"+p_cloud+"','"+p_group+"','info');fetch all in \"info\";", function (err, result, fields) {
		if (!err) {
			console.log(result);
            res.header("access-control-allow-origin", "*");
            if(p_mode === 'get_credentials') {
                if(p_cloud === 'Azure' || p_cloud === 'Openstack' || p_cloud === 'AWS') {                    
                    for(var i=0; i<result[1].rows.length; i++) {
                        // crypted = cipher.update(result[1].rows[i].client_secret, 'utf8', 'hex')
                        // crypted += cipher.final('hex');
                        // result[1].rows[i].client_secret = crypted
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(JSON.stringify(result[1].rows[i]), 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[i] = crypted
                    }                    
                }     
                else if(p_cloud === 'Google') {                    
                    for(var v=0; v<result[1].rows.length; v++) {
                        // crypted = cipher.update(result[1].rows[v].service_account_json, 'utf8', 'hex')
                        // crypted += cipher.final('hex');
                        // result[1].rows[v].service_account_json = crypted
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(JSON.stringify(result[1].rows[v]), 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[v] = crypted
                    // result[1].rows[0].service_account_json = JSON.parse(crypted)
                    }
                } 
            }
			res.send(result);
		}
		else {
			console.log('error while performing query.', err);
		}
	});
}
exports.GetCredentialsAndVMDetails = GetCredentialsAndVMDetails;

/*function GetCredentialsAndVMDetailsNew(req, res, next) {

    var tenantid = null;
    var p_mode = null;
    var p_cloud = null;

    if (req.query.tenantid)
        tenantid = req.query.tenantid;

    if (req.query.p_mode)
        p_mode = req.query.p_mode;

    if (req.query.p_cloud)
        p_cloud = req.query.p_cloud;



    config.query("select * from cb_mig_sp_get_credentials_and_vm_details2('" + tenantid + "','" + p_mode + "','" + p_cloud + "','info');fetch all in \"info\";", function (err, result, fields) {
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
exports.GetCredentialsAndVMDetailsNew = GetCredentialsAndVMDetailsNew;*/

function GetCredentialsAndVMDetailsApplnDisc(req, res, next) {
	
	var tenantid = null;
	var p_mode = null;
    var p_cloud=null;

	if (req.query.tenantid)
		tenantid = req.query.tenantid;

	if (req.query.p_mode)
		p_mode = req.query.p_mode;
   
   	if (req.query.p_cloud)
		p_cloud = req.query.p_cloud;
   
   	if (req.query.p_group)
		p_group = req.query.p_group;



	config.query("select * from cb_mig_sp_get_credentials_and_vms4('" + tenantid+"','"+p_mode+"','"+p_cloud+"','"+p_group+"','info');fetch all in \"info\";", function (err, result, fields) {
		if (!err) {
			console.log(result);
            res.header("access-control-allow-origin", "*");
            if (p_mode == 'get_credentials') { 
                if (p_cloud == 'Azure') {                   
                    for (var v = 0; v < result[1].rows.length; v++) {
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(result[1].rows[v].client_secret, 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[v].client_secret = crypted

                        if (result[1].rows[v].ssh_key != '') {
                            cipher = crypto.createCipher(algorithm, password)
                            crypted = cipher.update(result[1].rows[v].ssh_key, 'utf8', 'hex')
                            crypted += cipher.final('hex');
                            result[1].rows[v].ssh_key = crypted
                        }
                    }                    
                }
                if (p_cloud == 'Google') {
                    for (var v = 0; v < result[1].rows.length; v++) {
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(result[1].rows[v].service_account_json, 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[v].service_account_json = crypted

                        if (result[1].rows[v].ssh_key != '') {
                            cipher = crypto.createCipher(algorithm, password)
                            crypted = cipher.update(result[1].rows[v].ssh_key, 'utf8', 'hex')
                            crypted += cipher.final('hex');
                            result[1].rows[v].ssh_key = crypted
                        }
                    }

                }
            }            
            res.send(result);
			
		}
		else {
			console.log('error while performing query.', err);
		}
	});
}
exports.GetCredentialsAndVMDetailsApplnDisc = GetCredentialsAndVMDetailsApplnDisc;

function GetAppDetailsforApplnDisc(req, res, next) {
    migrationStudioControllerFile.getSSHKey(req, res, next, function (ssh_key, err) {
        if (!err) {
            console.log(ssh_key)
            var appln_disc_key = ssh_key[0].private_key.trim()
            // if(ssh_key.length > 0 && ssh_key!= "Please map ssh key to this vm") {
            //     var key = ssh_key[0].private_key.trim()
            // }
            // else {
            //     var key = null
            // }
            ApplicationDiscoveryAPICall(req, res, next, appln_disc_key, function (job_response, err) {
                if (!err) {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)                    
                }
                else {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)   
                }
            })
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(ssh_key)
        }
    })
}
exports.GetAppDetailsforApplnDisc = GetAppDetailsforApplnDisc;

function ApplicationDiscoveryAPICall(req, res, next, appln_disc_key, callback) {
    var p_username = null;
    var p_public_IP = null;
    var p_os_type = null;
    // var p_ssh_key = null;
    var p_ssh_key_list = [];
    // var p_ssh_key_temp = [];

    if (req.body.username)
        p_username = req.body.username;

    if (req.body.public_ip)
        p_public_IP = req.body.public_ip;

    // if (req.body.ssh_key)
    //     p_ssh_key = req.body.ssh_key;

    if (req.body.os_type)
        p_os_type = req.body.os_type;

    // if (p_ssh_key.includes(",")) {
    //     p_ssh_key_temp = p_ssh_key.split(",");
    // }
    // else {
    //     p_ssh_key_temp.push(p_ssh_key);
    // }
   

    // if (p_ssh_key_temp != []) {
    //     for (var j = 0; j < p_ssh_key_temp.length; j++) {
    //         decipher = crypto.createDecipher(algorithm, password)
    //         dec = decipher.update(p_ssh_key_temp[j], 'hex', 'utf8')
    //         dec += decipher.final('utf8');
    //         p_ssh_key_list.push(dec)
    //     }           
        
    // }

    p_ssh_key_list.push(appln_disc_key)

    var dis_data = {
        "username": p_username,
        "public_ip": p_public_IP,
        "os_type": p_os_type,
        "ssh_key": p_ssh_key_list,
    }
    var options = {
        method: 'POST',
        url: migration_ip_linux + 'application_discovery/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: dis_data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                // res.header("access-control-allow-origin", "*");
                // res.send(body)
                callback(body, false)
            }
            else {
                // res.header("access-control-allow-origin", "*");
                // res.send(body.error)
                callback(body.error, true)
            }
        }
        else {
            callback(error, true)
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
        }
        
    });
}
exports.ApplicationDiscoveryAPICall = ApplicationDiscoveryAPICall;

function Check_azure_reso_grp_permission(req, res, next) {
    var p_resource_group = null;
    var p_client_id = null;
    var p_secret_key = null;
    var p_tenant_id = null;
    var p_subscription_id = null;

    if (req.body.resource_group)
        p_resource_group = req.body.resource_group;

    if (req.body.client_id)
        p_client_id = req.body.client_id;

    if (req.body.tenant_id)
        p_tenant_id = req.body.tenant_id;

    if (req.body.subscription_id)
        p_subscription_id = req.body.subscription_id;

    if (req.body.secret_key)
        p_secret_key = req.body.secret_key;

    if (p_secret_key != '' ){       
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(p_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        p_secret_key = dec       

    }
    var data = {
        "resource_group": p_resource_group,
        "client_id": p_client_id,
        "secret_key": p_secret_key,
        "tenant_id": p_tenant_id,
        "subscription_id": p_subscription_id
    }
   
    var options = {
        method: 'POST',
        url: migration_ip_linux + 'c2c-migration/check-azure-resource-group-permissions/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }

            //callback(body, false)
        }
        else {
            //callback(body, true)
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }

    });
}
exports.Check_azure_reso_grp_permission = Check_azure_reso_grp_permission;

function get_azure_username(req, res, next) {
    migrationStudioControllerFile.getSSHKey(req, res, next, function (ssh_key, err) {
        if (!err) {
            console.log(ssh_key)
            var key = ssh_key[0].private_key.trim()
            // if(ssh_key.length > 0 && ssh_key!= "Please map ssh key to this vm") {
            //     var key = ssh_key[0].private_key.trim()
            // }
            // else {
            //     var key = null
            // }
            AzureInstanceInfoAPICall(req, res, next, key, function (job_response, err) {
                if (!err) {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)                    
                }
                else {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)   
                }
            })
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(ssh_key)
        }
    })
}
exports.get_azure_username = get_azure_username;

function AzureInstanceInfoAPICall(req, res, next, key, callback) {
    var p_resource_group = null;
    var p_client_id = null;
    var p_secret_key = null;
    var p_tenant_id = null;
    var p_subscription_id = null;
    var p_vm_name = null;
    var ssh_key = []

    if (req.body.resource_group)
        p_resource_group = req.body.resource_group;

    if (req.body.client_id)
        p_client_id = req.body.client_id;

    if (req.body.tenant_id)
        p_tenant_id = req.body.tenant_id;

    if (req.body.subscription_id)
        p_subscription_id = req.body.subscription_id;

    if (req.body.secret_key)
        p_secret_key = req.body.secret_key;

    if (req.body.vm_name)
        p_vm_name = req.body.vm_name;

    if (p_secret_key != '') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(p_secret_key, 'hex', 'utf8')
        dec += decipher.final('utf8');
        p_secret_key = dec
    }
    if (req.body.public_ip) {
        public_ip = req.body.public_ip;
    }

    ssh_key.push(key)

    var get_user = {
        "resource_group": p_resource_group,
        "client_id": p_client_id,
        "secret_key": p_secret_key,
        "tenant_id": p_tenant_id,
        "subscription_id": p_subscription_id,
        "vm_name": p_vm_name,
        "ssh_key": ssh_key,
        "public_ip": public_ip
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'c2c-migration/azure-get-vm-username/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: get_user,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                // res.header("access-control-allow-origin", "*");
                // res.send(body)
                callback(body, false)
            }
            else {
                // res.header("access-control-allow-origin", "*");
                // res.send(body.error)
                callback(body.error, true)
            }
        }
        else {
            callback(error, true)
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
        }

    });
}
exports.AzureInstanceInfoAPICall = AzureInstanceInfoAPICall;

function get_google_instance_info(req, res, next) {
    migrationStudioControllerFile.getSSHKey(req, res, next, function (ssh_key, err) {
        if (!err) {
            console.log(ssh_key)
            var key = ssh_key[0].private_key.trim()
            // if(ssh_key.length > 0 && ssh_key!= "Please map ssh key to this vm") {
            //     var key = ssh_key[0].private_key.trim()
            // }
            // else {
            //     var key = null
            // }
            GCPInstanceInfoAPICall(req, res, next, key, function (job_response, err) {
                if (!err) {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)                    
                }
                else {
                    console.log(job_response)
                    res.header("access-control-allow-origin", "*");
                    res.send(job_response)   
                }
            })
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(ssh_key)
        }
    })
}
exports.get_google_instance_info = get_google_instance_info;

function GCPInstanceInfoAPICall(req, res, next, key, callback) {
    var p_instance_name = null;
    var p_zone = null;
    var p_token = null;
    var p_credentials = null;
    var ssh_key = [];

    if (req.body.instance_name)
        p_instance_name = req.body.instance_name;

    if (req.body.zone)
        p_zone = req.body.zone;

    if (req.body.token)
        p_token = req.body.token;

    if (req.body.credentials)
        p_credentials = req.body.credentials;
   
    if (p_credentials != '') {
        decipher = crypto.createDecipher(algorithm, password)
        dec = decipher.update(p_credentials, 'hex', 'utf8')
        dec += decipher.final('utf8');
        p_credentials = dec

    }

    ssh_key.push(key)

    var get_gcp_user = {
        "instance_name": p_instance_name,
        "zone": p_zone,
        "token": p_token,
        "credentials": JSON.parse(p_credentials),
        "ssh_key": ssh_key
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'c2c-migration/gcp-instance-info/',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: get_gcp_user,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {

        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                // res.header("access-control-allow-origin", "*");
                // res.send(body)
                callback(body, false)
            }
            else {
                // res.header("access-control-allow-origin", "*");
                // res.send(body.error)
                callback(body.error, true)
            }
        }
        else {
            callback(error, true)
            // res.header("access-control-allow-origin", "*");
            // res.send(error)
        }

    });
}
exports.GCPInstanceInfoAPICall = GCPInstanceInfoAPICall;

function GetCredentialsAndVMDetailsNew(req, res, next) {

	var accountid = null;
	var p_mode = null;
    var p_cloud=null;
    var cipher = null;
    var crypted = null;

	if (req.query.accountid)
        accountid = parseInt(req.query.accountid);

	if (req.query.p_mode)
		p_mode = req.query.p_mode;
   
   	if (req.query.p_cloud)
		p_cloud = req.query.p_cloud;
   
   	if (req.query.p_group)
		p_group = parseInt(req.query.p_group);



	config.query("select * from cb_migration_get_credentials_and_vms(" + accountid + ",'" + p_mode + "','" + p_cloud + "'," + p_group + ",'info');fetch all in \"info\";", function (err, result, fields) {
		if (!err) {
			console.log(result);
            res.header("access-control-allow-origin", "*");
            if(p_mode === 'get_credentials') {
                if(p_cloud === 'Azure' || p_cloud === 'Openstack' || p_cloud === 'AWS') {                    
                    for(var i=0; i<result[1].rows.length; i++) {
                        // crypted = cipher.update(result[1].rows[i].client_secret, 'utf8', 'hex')
                        // crypted += cipher.final('hex');
                        // result[1].rows[i].client_secret = crypted
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(JSON.stringify(result[1].rows[i]), 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[i] = crypted
                    }                    
                }     
                else if(p_cloud === 'Google') {                    
                    for(var v=0; v<result[1].rows.length; v++) {
                        // crypted = cipher.update(result[1].rows[v].service_account_json, 'utf8', 'hex')
                        // crypted += cipher.final('hex');
                        // result[1].rows[v].service_account_json = crypted
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(JSON.stringify(result[1].rows[v]), 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[v] = crypted
                    // result[1].rows[0].service_account_json = JSON.parse(crypted)
                    }
                } 
            }
			res.send(result);
		}
		else {
			console.log('error while performing query.', err);
		}
	});
}
exports.GetCredentialsAndVMDetailsNew = GetCredentialsAndVMDetailsNew;

function GetCredentialsForDestination(req, res, next) {

	var accountid = null;
	var p_mode = null;
    var p_cloud=null;
    var cipher = null;
    var crypted = null;

	if (req.body.accountid)
        accountid = parseInt(req.body.accountid);

	if (req.body.p_mode)
		p_mode = req.body.p_mode;
   
   	if (req.body.p_cloud)
		p_cloud = req.body.p_cloud;
   
   	if (req.body.p_group)
		p_group = parseInt(req.body.p_group);



	config.query("select * from cb_migration_get_credentials_for_destination(" + accountid + ",'" + p_mode + "','" + p_cloud + "'," + p_group + ",'info');fetch all in \"info\";", function (err, result, fields) {
		if (!err) {
			console.log(result);
            res.header("access-control-allow-origin", "*");
            if(p_mode === 'get_credentials') {                           
                for(var i=0; i<result[1].rows.length; i++) {
                    var result_data = JSON.stringify(result[1].rows[i])
                    cipher = crypto.createCipher(algorithm, password)
                    crypted = cipher.update(result[1].rows[i].client_secret, 'utf8', 'hex')
                    crypted += cipher.final('hex');
                    result[1].rows[i].client_secret = crypted
                }                
            }
			res.send(result);
		}
		else {
			console.log('error while performing query.', err);
		}
	});
}
exports.GetCredentialsForDestination = GetCredentialsForDestination;
