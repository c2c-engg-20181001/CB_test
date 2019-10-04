var config = require('../../config');

function get_security_groups1(req, res, next) {
    var tenant;
    var p_mod;
    var p_clouds;
    var p_groups;

    tenant = req.query.Tenanntids;
    p_mod = req.query.p_mode;
    p_clouds = req.query.p_cloud;
    //p_clouds ='Google';
    p_groups = req.query.p_group;



    var Tenant_id = '8d701aac-2869-431d-9b81-9720beb26fb9';


    config.query("select * from cb_cmaas_sp_get_credentials_and_security('" + tenant + "','Get_Security','" + p_clouds + "','" + p_groups + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.get_security_groups1 = get_security_groups1;
