var config = require('../../config');
var request = require('request');
var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
var migration_ip_linux = file.linux_migration_url

// var migration_ip_linux = "http://192.168.1.229/migration-studio/"

var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';

// function to get infrastructure details from database
function GetInfrastructureDetails(req, res, next) {
    var group_id = null;
    var user_id = null;
    var cloud_name = null;
    var account_name = null;
    var zone_id = null;
    if (req.body.group_id != null) {
        group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        user_id = req.body.user_id;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }
    if (req.body.account_name != null) {
        account_name = req.body.account_name;
    }
    if (req.body.zone_id != null) {
        zone_id = req.body.zone_id;
    }
    config.query("SELECT * FROM cb_mig_infra_get_details(" + group_id + "," + user_id + ",'" + cloud_name + "' ,'" + account_name + "','" + zone_id + "');", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.GetInfrastructureDetails = GetInfrastructureDetails;

// function to get account names added by a user
function GetCloudAccountDetails(req, res, next) {
    var group_id = null;
    var cloud_name = null;
    var ref = 'info'

    if (req.body.group_id != null) {
        group_id = req.body.group_id;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }

    config.query("SELECT * FROM cb_mig_infra_sp_get_cloud_accounts_for_migration(" + group_id + ",'" + cloud_name + "' ,'" + ref + "');fetch all in \"info\";", function (err, result) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
            res.header("access-control-allow-origin", "*");
            res.send(err);
        }
    });
}
exports.GetCloudAccountDetails = GetCloudAccountDetails;

// function to insert infrastructure details of different clouds in database
function RefreshCloudInfrastructureDetails(req, res, next) {
    res.header("access-control-allow-origin", "*");
    GetC2CSourceDetails(req, res, next, function (source_details, err) {
        if (!err) {
            console.log(source_details)
            var source_details_json = source_details[1].rows[0]
            if (req.body.cloud_name == 'openstack') {
                InsertInfrastructureDetailsForOpenstack(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'azure') {
                InsertInfrastructureDetailsForAzure(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'aws') {
                InsertInfrastructureDetailsForAWS(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'google') {
                InsertInfrastructureDetailsForGoogle(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }

        }
        else {
            console.log("Error", source_details)
            res.send(source_details)
        }
    })
}
exports.RefreshCloudInfrastructureDetails = RefreshCloudInfrastructureDetails;

// function to fetch c2c source account credentials
function GetC2CSourceDetails(req, res, next, callback) {

    var group_id = null;
    var cloud_name = null;
    var account_name = null;
    var ref = 'info'

    if (req.body.account_name != null) {
        account_name = req.body.account_name;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }
    if (req.body.group_id != null) {
        group_id = req.body.group_id;
    }

    config.query("select * from cb_mig_infra_sp_get_cloud_accounts_credentials_for_migration(" + group_id + ",'" + cloud_name + "' ,'" + account_name + "' ,'" + ref + "');fetch all in \"info\";", function (err, result) {
        if (!err) {
            callback(result, false)
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
        }
    });
}
exports.GetC2CSourceDetails = GetC2CSourceDetails;

// function to fetch infra target account credentials
function GetC2CTargetDetails(req, res, next, callback) {

    var userid = null;
    var destination_account_name = null;
    var destination_account_id = null;
    var migration_type = null;
    var ref = 'info'
    var group_id = null
    var destination_cloud = null
    var account_details = null

    if (req.body.user_id != null) {
        userid = parseInt(req.body.user_id);
    }
    if (req.body.group_id != null) {
        group_id = parseInt(req.body.group_id);
    }
    if (req.body.destination_account_name != null) {
        destination_account_name = req.body.destination_account_name;
    }
    if (req.body.destination_account_id != null) {
        destination_account_id = parseInt(req.body.destination_account_id);
    }
    if (req.body.destination_cloud != null) {
        destination_cloud = req.body.destination_cloud;
    }
    var query_type = "select_account_details"

    // config.query("select * from cb_migration_add_edit_delete_accounts(" + destination_account_id + " ," + userid + " ," + group_id + ",'" + "Infra" + "' ,'" + destination_cloud + "' ,'" + destination_account_name + "','" + type + "','" + "select_account_details" + "', 'info');fetch all in \"info\";", function (err, result) {

    config.query("select * from cb_migration_add_edit_delete_accounts(" + destination_account_id + " ," + userid + " ," + group_id + ",'" + "Infra" + "' ,'" + destination_cloud + "' ,'" + destination_account_name + "','" + account_details + "','" + query_type + "', 'info');fetch all in \"info\";", function (err, result) {
        if (!err) {
            var decipher = null;
            var dec = null;
            decipher = crypto.createDecipher(algorithm, password)
            dec = decipher.update(result[1].rows[0].account_details.dest_secret_key, 'hex', 'utf8')
            dec += decipher.final('utf8');
            result[1].rows[0].account_details.dest_secret_key = dec
            callback(result, false)
        }
        else {
            console.log('Error while performing Query.', err);
            callback(err, true)
        }
    });
}
exports.GetC2CTargetDetails = GetC2CTargetDetails;

// function to insert openstack infrastructure details in database
function InsertInfrastructureDetailsForOpenstack(req, res, next, source_details, callback) {

    var openstack_api_port = null;
    var openstack_api_version = null;
    var openstack_auth_url = null;
    var openstack_username = null;
    var openstack_password = null;
    var openstack_hostname = null;
    var openstack_security_protocol = null;
    var openstack_user_domain_name = null;
    var openstack_account_name = null;
    var openstack_group_id = null;
    var openstack_user_id = null;
    var openstack_token = null;
    var openstack_zone_id = null;
    var cloud_name = null;

    if (source_details.api_port != null) {
        openstack_api_port = source_details.api_port;
    }
    if (source_details.api_version != null) {
        openstack_api_version = source_details.api_version;
    }
    if (source_details.client_id != null) {
        openstack_username = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        openstack_password = source_details.client_secret;
    }
    if (source_details.hostname != null) {
        openstack_hostname = source_details.hostname;
    }
    if (source_details.security_protocol != null) {
        openstack_security_protocol = source_details.security_protocol;
    }
    if (source_details.v3_domain_id != null) {
        openstack_user_domain_name = source_details.v3_domain_id;
    }
    if (req.body.infra_token != null) {
        openstack_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        openstack_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        openstack_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        openstack_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        openstack_zone_id = req.body.zone;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }

    // if(openstack_security_protocol == 'non-ssl') {
    //     openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    // else {
    //     openstack_auth_url = "https://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    var data = {
        "source": {
            "auth_url": openstack_auth_url,
            "username": openstack_username,
            "password": openstack_password,
            "user_domain_name": openstack_user_domain_name,
            "account_name": openstack_account_name,
            "user_id": openstack_user_id,
            "group_id": openstack_group_id,
            "cloud_name": cloud_name,
            "zone_id": openstack_zone_id
        },
        "destination": {},
        "token": openstack_token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/update-openstack-infra',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertInfrastructureDetailsForOpenstack = InsertInfrastructureDetailsForOpenstack;

// function to insert azure infrastructure details in database
function InsertInfrastructureDetailsForAzure(req, res, next, source_details, callback) {

    var azure_client_id = null;
    var azure_secret_key = null;
    var azure_tenant_id = null;
    var azure_subscription_id = null;
    var azure_token = null;
    var azure_account_name = null;
    var azure_user_id = null;
    var azure_group_id = null;
    var azure_location = null;
    var cloud_name = null;

    if (source_details.client_id != null) {
        azure_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        azure_secret_key = source_details.client_secret;
    }
    if (source_details.tenant_id != null) {
        azure_tenant_id = source_details.tenant_id;
    }
    if (source_details.subscription_id != null) {
        azure_subscription_id = source_details.subscription_id;
    }
    if (req.body.infra_token != null) {
        azure_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        azure_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        azure_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        azure_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        azure_location = req.body.zone;
    }
    if (req.body.cloud_name != null) {
        cloud_name = req.body.cloud_name;
    }

    var data = {
        "client_id": azure_client_id,
        "secret_key": azure_secret_key,
        "tenant_id": azure_tenant_id,
        "subscription_id": azure_subscription_id,
        "location": azure_location,
        "account_name": azure_account_name,
        "user_id": azure_user_id,
        "group_id": azure_group_id,
        "token": azure_token,
        "cloud_name": cloud_name
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/update-azure-infra',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertInfrastructureDetailsForAzure = InsertInfrastructureDetailsForAzure;

// function to insert aws infrastructure details in database
function InsertInfrastructureDetailsForAWS(req, res, next, source_details, callback) {

    var aws_client_id = null;
    var aws_secret_key = null;
    var aws_token = null;
    var aws_account_name = null;
    var aws_user_id = null;
    var aws_group_id = null;
    var aws_zone = null;

    if (source_details.client_id != null) {
        aws_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        aws_secret_key = source_details.client_secret;
    }
    if (req.body.infra_token != null) {
        aws_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        aws_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        aws_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        aws_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        aws_zone = req.body.zone;
    }

    var data = {
        "access_key": aws_client_id,
        "secret_key": aws_secret_key,
        "region_id": aws_zone,
        "account_name": aws_account_name,
        "user_id": aws_user_id,
        "group_id": aws_group_id,
        "token": aws_token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/update-aws-infra',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertInfrastructureDetailsForAWS = InsertInfrastructureDetailsForAWS;

// function to insert google infrastructure details in database
function InsertInfrastructureDetailsForGoogle(req, res, next, source_details, callback) {

    var gcp_project_id = null;
    var gcp_service_account_json = null;
    var gcp_token = null;
    var gcp_account_name = null;
    var gcp_user_id = null;
    var gcp_group_id = null;
    var gcp_zone = null;

    if (source_details.project_id != null) {
        gcp_project_id = source_details.project_id;
    }
    if (source_details.service_account_json != null) {
        gcp_service_account_json = JSON.parse(source_details.service_account_json);
    }
    if (req.body.infra_token != null) {
        gcp_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        gcp_account_name = req.body.account_name;
    }
    if (req.body.user_id != null) {
        gcp_user_id = req.body.user_id;
    }
    if (req.body.group_id != null) {
        gcp_group_id = req.body.group_id;
    }
    if (req.body.zone != null) {
        gcp_zone = req.body.zone;
    }

    var data = {
        "source": {
            "credentials": gcp_service_account_json,
            "zone": gcp_zone,
            "account_name": gcp_account_name,
            "user_id": gcp_user_id,
            "group_id": gcp_group_id,
            "cloud_name": "google"

        },
        "token": gcp_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/update-gcp-infra',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertInfrastructureDetailsForGoogle = InsertInfrastructureDetailsForGoogle;

// function to insert infrastructure details of different clouds in database
function StartC2CInfrastructureMigrationtoAlibaba(req, res, next) {
    res.header("access-control-allow-origin", "*");
    GetC2CSourceDetails(req, res, next, function (source_details, err) {
        if (!err) {
            console.log(source_details)
            var source_details_json = source_details[1].rows[0]
            GetC2CTargetDetails(req, res, next, function (target_details, err) {
                if (!err) {
                    console.log(target_details)
                    var target_details_json = target_details[1].rows[0].account_details
                    if (req.body.cloud_name == 'openstack') {
                        InfrastructureMigrationFromOpenstackToAlibaba(req, res, next, source_details_json, target_details_json, function (insertion_response, err) {
                            if (!err) {
                                console.log(insertion_response)
                                res.send(insertion_response)
                            }
                            else {
                                console.log("Error", insertion_response)
                                res.send(insertion_response)
                            }
                        })
                    }
                    else if (req.body.cloud_name == 'azure') {
                        InfrastructureMigrationFromAzureToAlibaba(req, res, next, source_details_json, target_details_json, function (insertion_response, err) {
                            if (!err) {
                                console.log(insertion_response)
                                res.send(insertion_response)
                            }
                            else {
                                console.log("Error", insertion_response)
                                res.send(insertion_response)
                            }
                        })
                    }
                    else if (req.body.cloud_name == 'aws') {
                        InfrastructureMigrationFromAWSToAlibaba(req, res, next, source_details_json, target_details_json, function (insertion_response, err) {
                            if (!err) {
                                console.log(insertion_response)
                                res.send(insertion_response)
                            }
                            else {
                                console.log("Error", insertion_response)
                                res.send(insertion_response)
                            }
                        })
                    }
                    else if (req.body.cloud_name == 'google') {
                        InfrastructureMigrationFromGoogleToAlibaba(req, res, next, source_details_json, target_details_json, function (insertion_response, err) {
                            if (!err) {
                                console.log(insertion_response)
                                res.send(insertion_response)
                            }
                            else {
                                console.log("Error", insertion_response)
                                res.send(insertion_response)
                            }
                        })
                    }
                }
                else {
                    console.log("Error", target_details)
                    res.send(target_details)
                }
            })

        }
        else {
            console.log("Error", source_details)
            res.send(source_details)
        }
    })
}
exports.StartC2CInfrastructureMigrationtoAlibaba = StartC2CInfrastructureMigrationtoAlibaba;

// function to migrate openstack infrastructure to alibaba
function InfrastructureMigrationFromOpenstackToAlibaba(req, res, next, source_details, target_details, callback) {

    var openstack_api_port = null;
    var openstack_api_version = null;
    var openstack_auth_url = null;
    var openstack_username = null;
    var openstack_password = null;
    var openstack_hostname = null;
    var openstack_security_protocol = null;
    var openstack_user_domain_name = null;
    var openstack_account_name = null;
    var openstack_user_id = null;
    var openstack_group_id = null;
    var openstack_token = null;

    var alibaba_access_key = null
    var alibaba_secret_key = null
    var alibaba_region_id = null
    var alibaba_zone_id = null

    if (source_details.api_port != null) {
        openstack_api_port = source_details.api_port;
    }
    if (source_details.api_version != null) {
        openstack_api_version = source_details.api_version;
    }
    if (source_details.client_id != null) {
        openstack_username = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        openstack_password = source_details.client_secret;
    }
    if (source_details.hostname != null) {
        openstack_hostname = source_details.hostname;
    }
    if (source_details.security_protocol != null) {
        openstack_security_protocol = source_details.security_protocol;
    }
    if (source_details.v3_domain_id != null) {
        openstack_user_domain_name = source_details.v3_domain_id;
    }
    if (req.body.infra_token != null) {
        openstack_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        openstack_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        openstack_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        openstack_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        openstack_zone_id = req.body.zone;
    }
    if (target_details.dest_access_key != null) {
        alibaba_access_key = target_details.dest_access_key;
    }
    if (target_details.dest_secret_key != null) {
        alibaba_secret_key = target_details.dest_secret_key;
    }
    if (target_details.dest_region != null) {
        alibaba_region_id = target_details.dest_region;
    }
    if (target_details.zone_id != null) {
        alibaba_zone_id = target_details.zone_id;
    }

    // if(openstack_security_protocol == 'non-ssl') {
    //     openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    // else {
    //     openstack_auth_url = "https://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version

    var data = {
        "source": {
            "auth_url": openstack_auth_url,
            "username": openstack_username,
            "password": openstack_password,
            "user_domain_name": openstack_user_domain_name,
            "account_name": openstack_account_name,
            "group_id": openstack_group_id,
            "user_id": openstack_user_id,
            "cloud_name": "openstack",
            "zone_id": openstack_zone_id
        },
        "destination": {
            "access_key": alibaba_access_key,
            "secret_key": alibaba_secret_key,
            "region_id": alibaba_region_id,
            "zone_id": alibaba_zone_id,
            "cloud_name": "Alibaba"
        },
        "token": openstack_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/openstack-to-alibaba',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InfrastructureMigrationFromOpenstackToAlibaba = InfrastructureMigrationFromOpenstackToAlibaba;

// function to migrate azure infrastructure to alibaba
function InfrastructureMigrationFromAzureToAlibaba(req, res, next, source_details, target_details, callback) {

    var azure_client_id = null;
    var azure_secret_key = null;
    var azure_tenant_id = null;
    var azure_subscription_id = null;
    var azure_token = null;
    var azure_account_name = null;
    var azure_group_id = null;
    var azure_user_id = null;
    var azure_location = null;

    var alibaba_access_key = null
    var alibaba_secret_key = null
    var alibaba_region_id = null
    var alibaba_zone_id = null

    if (source_details.client_id != null) {
        azure_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        azure_secret_key = source_details.client_secret;
    }
    if (source_details.tenant_id != null) {
        azure_tenant_id = source_details.tenant_id;
    }
    if (source_details.subscription_id != null) {
        azure_subscription_id = source_details.subscription_id;
    }
    if (req.body.infra_token != null) {
        azure_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        azure_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        azure_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        azure_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        azure_location = req.body.zone;
    }
    if (target_details.dest_access_key != null) {
        alibaba_access_key = target_details.dest_access_key;
    }
    if (target_details.dest_secret_key != null) {
        alibaba_secret_key = target_details.dest_secret_key;
    }
    if (target_details.dest_region != null) {
        alibaba_region_id = target_details.dest_region;
    }
    if (target_details.zone_id != null) {
        alibaba_zone_id = target_details.zone_id;
    }

    var data = {
        "source": {
            "client_id": azure_client_id,
            "secret_key": azure_secret_key,
            "tenant_id": azure_tenant_id,
            "subscription_id": azure_subscription_id,
            "location": azure_location,
            "account_name": azure_account_name,
            "group_id": azure_group_id,
            "user_id": azure_user_id,
            "cloud_name": "azure"
        },
        "destination": {
            "access_key": alibaba_access_key,
            "secret_key": alibaba_secret_key,
            "region_id": alibaba_region_id,
            "zone_id": alibaba_zone_id,
            "cloud_name": "Alibaba"
        },
        "token": azure_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/azure-to-alibaba',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InfrastructureMigrationFromAzureToAlibaba = InfrastructureMigrationFromAzureToAlibaba;

// function to migrate aws infrastructure to alibaba
function InfrastructureMigrationFromAWSToAlibaba(req, res, next, source_details, target_details, callback) {

    var aws_client_id = null;
    var aws_secret_key = null;
    var aws_token = null;
    var aws_account_name = null;
    var aws_user_id = null;
    var aws_group_id = null;
    var aws_zone = null;

    var alibaba_access_key = null
    var alibaba_secret_key = null
    var alibaba_region_id = null
    var alibaba_zone_id = null

    if (source_details.client_id != null) {
        aws_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        aws_secret_key = source_details.client_secret;
    }
    if (req.body.infra_token != null) {
        aws_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        aws_account_name = req.body.account_name;
    }
    if (req.body.user_id != null) {
        aws_user_id = req.body.user_id;
    }
    if (req.body.group_id != null) {
        aws_group_id = req.body.group_id;
    }
    if (req.body.zone != null) {
        aws_zone = req.body.zone;
    }
    if (target_details.dest_access_key != null) {
        alibaba_access_key = target_details.dest_access_key;
    }
    if (target_details.dest_secret_key != null) {
        alibaba_secret_key = target_details.dest_secret_key;
    }
    if (target_details.dest_region != null) {
        alibaba_region_id = target_details.dest_region;
    }
    if (target_details.zone_id != null) {
        alibaba_zone_id = target_details.zone_id;
    }

    // var destination_zone_id_list = []
    // destination_zone_id_list.push(alibaba_zone_id)

    var data = {
        "source": {
            "access_key": aws_client_id,
            "secret_key": aws_secret_key,
            "region_id": aws_zone,
            "account_name": aws_account_name,
            "group_id": aws_group_id,
            "user_id": aws_user_id,
            "cloud_name": "aws"
        },
        "destination": {
            "access_key": alibaba_access_key,
            "secret_key": alibaba_secret_key,
            "region_id": alibaba_region_id,
            "cloud_name": "alibaba",
            "zone_ids": alibaba_zone_id
        },
        "token": aws_token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/aws-to-alibaba',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InfrastructureMigrationFromAWSToAlibaba = InfrastructureMigrationFromAWSToAlibaba;

// function to migrate google infrastructure to alibaba
function InfrastructureMigrationFromGoogleToAlibaba(req, res, next, source_details, target_details, callback) {

    var gcp_project_id = null;
    var gcp_service_account_json = null;
    var gcp_token = null;
    var gcp_account_name = null;
    var gcp_user_id = null;
    var gcp_group_id = null;
    var gcp_zone = null;

    var alibaba_access_key = null
    var alibaba_secret_key = null
    var alibaba_region_id = null
    var alibaba_zone_id = null

    if (source_details.project_id != null) {
        gcp_project_id = source_details.project_id;
    }
    if (source_details.service_account_json != null) {
        gcp_service_account_json = JSON.parse(source_details.service_account_json);
    }
    if (req.body.infra_token != null) {
        gcp_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        gcp_account_name = req.body.account_name;
    }
    if (req.body.user_id != null) {
        gcp_user_id = req.body.user_id;
    }
    if (req.body.group_id != null) {
        gcp_group_id = req.body.group_id;
    }
    if (req.body.zone != null) {
        gcp_zone = req.body.zone;
    }
    if (target_details.dest_access_key != null) {
        alibaba_access_key = target_details.dest_access_key;
    }
    if (target_details.dest_secret_key != null) {
        alibaba_secret_key = target_details.dest_secret_key;
    }
    if (target_details.dest_region != null) {
        alibaba_region_id = target_details.dest_region;
    }
    if (target_details.zone_id != null) {
        alibaba_zone_id = target_details.zone_id;
    }

    var data = {
        "source": {
            "credentials": gcp_service_account_json,
            "zone": gcp_zone,
            "account_name": gcp_account_name,
            "user_id": gcp_user_id,
            "group_id": gcp_group_id,
            "cloud_name": "google"
        },
        "destination": {
            "access_key": alibaba_access_key,
            "secret_key": alibaba_secret_key,
            "region_id": alibaba_region_id,
            "zone_id": alibaba_zone_id,
            "cloud_name": "Alibaba"
        },
        "token": gcp_token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/gcp-to-alibaba',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InfrastructureMigrationFromGoogleToAlibaba = InfrastructureMigrationFromGoogleToAlibaba;

// function to insert vm details in database
function InsertVMDetails(req, res, next) {
    res.header("access-control-allow-origin", "*");
    GetC2CSourceDetails(req, res, next, function (source_details, err) {
        if (!err) {
            console.log(source_details)
            var source_details_json = source_details[1].rows[0]
            if (req.body.cloud_name == 'openstack') {
                InsertVMDetailsForOpenstack(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'azure') {
                InsertVMDetailsForAzure(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'aws') {
                InsertVMDetailsForAWS(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
            else if (req.body.cloud_name == 'google') {
                InsertVMDetailsForGoogle(req, res, next, source_details_json, function (insertion_response, err) {
                    if (!err) {
                        console.log(insertion_response)
                        res.send(insertion_response)
                    }
                    else {
                        console.log("Error", insertion_response)
                        res.send(insertion_response)
                    }
                })
            }
        }
        else {
            console.log("Error", source_details)
            res.send(source_details)
        }
    })
}
exports.InsertVMDetails = InsertVMDetails;

// function to insert openstack vm details in database
function InsertVMDetailsForOpenstack(req, res, next, source_details, callback) {

    var openstack_api_port = null;
    var openstack_api_version = null;
    var openstack_auth_url = null;
    var openstack_username = null;
    var openstack_password = null;
    var openstack_hostname = null;
    var openstack_security_protocol = null;
    var openstack_user_domain_name = null;
    var openstack_account_name = null;
    var openstack_user_id = null;
    var openstack_group_id = null;
    var openstack_token = null;

    if (source_details.api_port != null) {
        openstack_api_port = source_details.api_port;
    }
    if (source_details.api_version != null) {
        openstack_api_version = source_details.api_version;
    }
    if (source_details.client_id != null) {
        openstack_username = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        openstack_password = source_details.client_secret;
    }
    if (source_details.hostname != null) {
        openstack_hostname = source_details.hostname;
    }
    if (source_details.security_protocol != null) {
        openstack_security_protocol = source_details.security_protocol;
    }
    if (source_details.v3_domain_id != null) {
        openstack_user_domain_name = source_details.v3_domain_id;
    }
    if (req.body.infra_token != null) {
        openstack_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        openstack_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        openstack_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        openstack_user_id = req.body.user_id;
    }

    // if(openstack_security_protocol == 'non-ssl') {
    //     openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    // else {
    //     openstack_auth_url = "https://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version
    // }
    openstack_auth_url = "http://" + openstack_hostname + ":" + openstack_api_port + "/" + openstack_api_version

    var data = {
        "auth_url": openstack_auth_url,
        "username": openstack_username,
        "password": openstack_password,
        "user_domain_name": openstack_user_domain_name,
        "account_name": openstack_account_name,
        "group_id": openstack_group_id,
        "user_id": openstack_user_id,
        "token": openstack_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/openstack-instance-info',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertVMDetailsForOpenstack = InsertVMDetailsForOpenstack;

// function to insert azure vm details in database
function InsertVMDetailsForAzure(req, res, next, source_details, callback) {

    var azure_client_id = null;
    var azure_secret_key = null;
    var azure_tenant_id = null;
    var azure_subscription_id = null;
    var azure_token = null;
    var azure_account_name = null;
    var azure_group_id = null;
    var azure_user_id = null;
    var azure_location = null;

    if (source_details.client_id != null) {
        azure_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        azure_secret_key = source_details.client_secret;
    }
    if (source_details.tenant_id != null) {
        azure_tenant_id = source_details.tenant_id;
    }
    if (source_details.subscription_id != null) {
        azure_subscription_id = source_details.subscription_id;
    }
    if (req.body.infra_token != null) {
        azure_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        azure_account_name = req.body.account_name;
    }
    if (req.body.group_id != null) {
        azure_group_id = req.body.group_id;
    }
    if (req.body.user_id != null) {
        azure_user_id = req.body.user_id;
    }
    if (req.body.zone != null) {
        azure_location = req.body.zone;
    }

    var data = {
        "client_id": azure_client_id,
        "secret_key": azure_secret_key,
        "tenant_id": azure_tenant_id,
        "subscription_id": azure_subscription_id,
        "location": azure_location,
        "account_name": azure_account_name,
        "group_id": azure_group_id,
        "user_id": azure_user_id,
        "token": azure_token
    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/azure-instance-info',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertVMDetailsForAzure = InsertVMDetailsForAzure;

// function to insert aws vm details in database
function InsertVMDetailsForAWS(req, res, next, source_details, callback) {

    var aws_client_id = null;
    var aws_secret_key = null;
    var aws_token = null;
    var aws_account_name = null;
    var aws_user_id = null;
    var aws_group_id = null;
    var aws_zone = null;

    if (source_details.client_id != null) {
        aws_client_id = source_details.client_id;
    }
    if (source_details.client_secret != null) {
        aws_secret_key = source_details.client_secret;
    }
    if (req.body.infra_token != null) {
        aws_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        aws_account_name = req.body.account_name;
    }
    if (req.body.user_id != null) {
        aws_user_id = req.body.user_id;
    }
    if (req.body.group_id != null) {
        aws_group_id = req.body.group_id;
    }
    if (req.body.zone != null) {
        aws_zone = req.body.zone;
    }

    var data = {
        "access_key": aws_client_id,
        "secret_key": aws_secret_key,
        "region_id": aws_zone,
        "account_name": aws_account_name,
        "group_id": aws_group_id,
        "user_id": aws_user_id,
        "token": aws_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/aws-instance-info',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertVMDetailsForAWS = InsertVMDetailsForAWS;

// function to insert google vm details in database
function InsertVMDetailsForGoogle(req, res, next, source_details, callback) {

    var gcp_project_id = null;
    var gcp_service_account_json = null;
    var gcp_token = null;
    var gcp_account_name = null;
    var gcp_user_id = null;
    var gcp_group_id = null;
    var gcp_zone = null;

    if (source_details.project_id != null) {
        gcp_project_id = source_details.project_id;
    }
    if (source_details.service_account_json != null) {
        gcp_service_account_json = JSON.parse(source_details.service_account_json);
    }
    if (req.body.infra_token != null) {
        gcp_token = req.body.infra_token;
    }
    if (req.body.account_name != null) {
        gcp_account_name = req.body.account_name;
    }
    if (req.body.user_id != null) {
        gcp_user_id = req.body.user_id;
    }
    if (req.body.group_id != null) {
        gcp_group_id = req.body.group_id;
    }
    if (req.body.zone != null) {
        gcp_zone = req.body.zone;
    }

    var data = {
        "credentials": gcp_service_account_json,
        "zone": gcp_zone,
        "account_name": gcp_account_name,
        "user_id": gcp_user_id,
        "group_id": gcp_group_id,
        "token": gcp_token

    }

    var options = {
        method: 'POST',
        url: migration_ip_linux + 'infra-migration/google-instance-info',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    request(options, function (error, resp, body) {
        if (body != undefined) {
            callback(body, false)
        }
        else {
            callback(error, true)
        }
    })

}
exports.InsertVMDetailsForGoogle = InsertVMDetailsForGoogle;
