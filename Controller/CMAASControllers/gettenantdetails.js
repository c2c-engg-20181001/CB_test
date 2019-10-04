var config = require('../../config');

function getenant(req, res, next) {
    var cloudname;
    var cloud = null;
    var group = null;

    // if (req.query.clouddetailss) {
  cloud = req.query.p_cloud;
    group = req.query.p_group;
    //  }

    // cb_cmaas_sp_get_dashboard 
    // cb_cmaas_sp_select_cloud
    config.query("select * from  cb_mig_sp_get_credentials_and_vms4(null,'get_tenant_info','" + cloud + "','" + group + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.getenant = getenant;
