var config = require('../../config');
function billingInvoiceReport(req, res, next) {

    var provider_id = 0;
    var account_display_id = "";
    var dateRange = "";
    var mode = "";
    // we temp not used provider id but we pass
    if (req.query.provider_id) {
        provider_id = parseInt(req.query.provider_id);
    }
    if (req.query.account_display_id) {
        account_display_id = req.query.account_display_id;
    }
    if (req.query.dateRange) {
        dateRange = req.query.dateRange;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("select * from cb_bil_sp_get_billing_invoice_report('" + provider_id + "','" + account_display_id + "','" + dateRange + "','"+mode+"','info');FETCH ALL IN \"info\";", function (err, result, fields) {

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
exports.billingInvoiceReport = billingInvoiceReport;

