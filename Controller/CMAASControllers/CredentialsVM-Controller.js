var config = require('../../config');
//var crypto = require('crypto');
//var algorithm = 'aes-256-ctr'
//var password = 'Click2Cloud';
//var request = require('request');
//var file = require('../../../../../manageiq-ui-classic/app/assets/javascripts/angular_modules/cb_migration/urls_file.json')
//var migration_ip = file.migration_url


function GetCredentialsAndVMDetails(req, res, next) {

    var tenantid = null;
    var p_mode = null;
    var p_cloud = null;
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



    config.query("select * from cb_cmaas_sp_get_credentials_and_vms('" + tenantid + "','" + p_mode + "','" + p_cloud + "','" + p_group + "','info');fetch all in \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            if (p_mode === 'get_credentials') {
                if (p_cloud === 'Azure' || p_cloud === 'Openstack' || p_cloud === 'AWS') {
                    for (var i = 0; i < result[1].rows.length; i++) {
                        // crypted = cipher.update(result[1].rows[i].client_secret, 'utf8', 'hex')
                        // crypted += cipher.final('hex');
                        // result[1].rows[i].client_secret = crypted
                        cipher = crypto.createCipher(algorithm, password)
                        crypted = cipher.update(JSON.stringify(result[1].rows[i]), 'utf8', 'hex')
                        crypted += cipher.final('hex');
                        result[1].rows[i] = crypted

                    }
                }
                else if (p_cloud === 'Google') {
                    for (var v = 0; v < result[1].rows.length; v++) {
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