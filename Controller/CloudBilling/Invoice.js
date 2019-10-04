var config = require('../../config');


function getinvoicedetails(req, res, next) {
    var p_region = null;
    var p_account = null;
    var p_cstartdate = null;
    var p_cenddate = null;
    var p_pstartdate = null;
    var p_penddate = null;
    var p_mode = null;
   

    if (req.query.p_region != "")
        p_region = req.query.p_region

    if (req.query.p_account != "")
        p_account = req.query.p_account

    if (req.query.p_cstartdate != "") {
        p_cstartdate = req.query.p_cstartdate
        p_penddate = req.query.p_cstartdate
    }
    if (req.query.p_cenddate != "") {

        p_cenddate = req.query.p_cenddate

        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var arrstartdate = p_cstartdate.split('-');
        var arrenddate = p_cenddate.split('-');
        var firstDate = new Date(arrstartdate[0], arrstartdate[1]-1, arrstartdate[2]);
        var secondDate = new Date(arrenddate[0], arrenddate[1]-1, arrenddate[2]);
        var date = p_cstartdate.split('-');
        var p_pstartdate = new Date(date[0], date[1], date[2]);

        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        p_pstartdate.setDate(p_pstartdate.getDate() - diffDays);
        var Date1 = ('0' + p_pstartdate.getDate()).slice(-2);
        var Month = ('0' + p_pstartdate.getMonth()).slice(-2);
        //Month = 00 + Month;
        var Year = p_pstartdate.getUTCFullYear();
        p_pstartdate = Year + '-' + Month + '-' + Date1;
    }
    if (req.query.p_pstartdate != "") {
       
    }
    if (req.query.p_penddate != "") {
       
    }

    if (req.query.p_mode != "")
        p_mode = req.query.p_mode


    //SELECT public.cb_inv_sp_get_azure_details(        'uswest,incentral,eastus',        'efbaf842-f428-4020-8718-9e3a642fa2c6,efbaf842-f428-4020-8718-9e3a642fa2c6,efbaf842-f428-4020-8718-9e3a642fa2c6',        '2018-08-06',        '2018-08-30',        '2018-07-06',        '2018-07-30',        'azure_details')

    //SELECT public.cb_inv_sp_get_azure_details(        'USW1,USW2,APN1,EUC1,APS1,EU',        '477463085755,477463085755',        '2019-01-09',        '2019-02-15',        '2018-12-09',        '2019-01-15',        'aws_details')
    //config.query("select * from cb_inv_sp_get_azure_details('" + p_region + "', '" + p_account + "', '" + p_cstartdate + "', '" + p_cenddate + "', '" + p_pstartdate + "','" + p_penddate + "','"+ p_mode +"');", function (err, result, fields) {
        config.query("select * from cb_inv_sp_get_azure_details_1('" + p_region + "', '" + p_account + "', '" + p_cstartdate + "', '" + p_cenddate + "', '" + p_pstartdate + "','" + p_penddate + "','" + p_mode + "');", function (err, result, fields) {
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
exports.getinvoicedetails = getinvoicedetails;