var config = require('../../config');

function getcloud(req, res, next) {
    var contents;
    if (req.query.clouddetails) {
        contents = req.query.clouddetails;
    }

   // cb_cmaas_sp_get_dashboard 
   // cb_cmaas_sp_select_cloud
    config.query("select * from  cb_cmaas_sp_get_dashboard(null,null,null,'selectCloudList','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.getcloud = getcloud;