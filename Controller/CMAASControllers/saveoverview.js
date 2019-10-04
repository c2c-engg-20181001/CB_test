var config = require('../../config');

function putoverview(req, res, next) {
    var cloudname;
    cloudid = req.query.cloudids;
    userid = req.query.userids;
    surveyid = req.query.surveyids;

    config.query("select * from cb_cmaas_sp_get_overview3('" + userid + "','" + cloudid + "','" + surveyid + "','updateoverview1','info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            console.log(result[1].rows);
            res.header("access-control-allow-origin", "*");
            res.send(result[1].rows);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });

}
exports.putoverview = putoverview;
