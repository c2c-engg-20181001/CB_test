var config = require('../../config');

function get_prediction_data(req, res, next) {
    // config.query("select public._cb_mon_ml_alibaba_sp_prediction_graph_data('5864924564707484', 'info');FETCH ALL IN \"info\";", function (err, res1) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     console.log(res1[1].rows);
    //     res.json(res1[1].rows);
    // });
    config.query("select _cb_mon_prediction('"+req.body.sub+"','"+req.body.mode+"')", function (err, res1) {
        
        console.log(res1.rows);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', '*');
        
        res.send(res1.rows);
    });
}
exports.get_prediction_data = get_prediction_data;

function userDetailsBilling(req, res, next) {
    // config.query("select public._cb_mon_ml_alibaba_sp_prediction_graph_data('5864924564707484', 'info');FETCH ALL IN \"info\";", function (err, res1) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     console.log(res1[1].rows);
    //     res.json(res1[1].rows);
    // });
    config.query("select _cb_billing_parent('"+req.body.group+"','"+req.body.mode+"')", function (err, res1) {
        
        console.log(res1.rows);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', '*');
        
        res.send(res1.rows);
    });
}
exports.userDetailsBilling = userDetailsBilling;