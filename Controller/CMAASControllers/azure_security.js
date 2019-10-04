var config = require('../../config');

function get_security_groups(req, res, next) {
    var contents;
    contents = req.query.Tenanntids;
    var Tenant_id ='8d701aac-2869-431d-9b81-9720beb26fb9';


    config.query("select * from cb_cmaas_sp_get_azure_security('" + contents + "','Get_Security','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.get_security_groups = get_security_groups;
