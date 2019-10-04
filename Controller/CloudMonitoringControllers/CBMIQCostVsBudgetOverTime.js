var config = require('../../config');
let date = require('date-and-time');
let now = new Date();  //Current Date

function GetTotalCost(req, res, next) {
    var ReportShowBy;
    var dateFilter;
    var entityId;

    if (req.query.entityId) {
        entityId = req.query.entityId;
    }

    if (req.query.dateFilter) {
        dateFilter = req.query.dateFilter;
    }

    if (req.query.ReportShowBy) {
        ReportShowBy = req.query.ReportShowBy;
    }
    if (req.query.username) {
        username = req.query.username;
    }
//   config.query("select * from test_cost_vs_budget_report(" + entityId + ",'" + dateFilter + "', '" + ReportShowBy + "', 'info'); fetch all in \"info\";", function (err, result, fields) {
  config.query("select * from test_cost_vs_budget_report1('" + username + "'," + entityId + ",'" + dateFilter + "', '" + ReportShowBy + "', 'info'); fetch all in \"info\";", function (err, result, fields) {      
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
            //res.send(status);
        }
        else {
            console.log('Error while performing Query.', err);
        }

    });

}
exports.GetTotalCost = GetTotalCost;

function GetBudgetForReport(req, res, next) {

    var ReportShowBy;
    var entityId;
    var dateFilter;
    var Startyear;
    var EndYear;
    var StartMonth1;
    var EndMonth1;
    var StartMonth2;
    var EndMonth2;
    var username;

    if (req.query.entityId) {
        entityId = req.query.entityId;
    }

    if (req.query.dateFilter) {
        dateFilter = req.query.dateFilter;
    }
    if (req.query.username) {
        username = req.query.username;
    }
    if (req.query.ReportShowBy) {
        ReportShowBy = req.query.ReportShowBy;
    }


    if (dateFilter == "Last_30_Days") {
        //StartDate = date.format(date.addDays((date.addDays(now, -1)), -30), 'YYYY-MM-DD'); /*(2018 - 02 - 12)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }


    }
    if (dateFilter == "Last_7_Days") {

        //StartDate = date.format(date.addDays((date.addDays(now, -1)), -7), 'YYYY-MM-DD'); /*(2018 - 03 - 07)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY'); /*(2018 - 03 - 14)*/
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "Yesterday") {

        //StartDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        //EndDate = date.format(date.addDays(now, 0), 'YYYY-MM-DD'); /*(2018 - 03 - 15)*/

        var year1 = date.format(date.addDays(now, -1), 'YYYY');
        var year2 = date.format(date.addDays(now, 0), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays(now, -1), 'MM');
            EndMonth1 = date.format(date.addDays(now, 0), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays(now, -1), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, 0), 'MM');
        }

    }
    if (dateFilter == "The_Previous_Month") {
        Startyear = date.format((date.addMonths(date.addDays(now, 0), -1)), 'YYYY');
        EndYear = "0";
        StartMonth1 = date.format((date.addMonths(date.addDays(now, 0), -1)), 'MM');
        EndMonth1 = date.format((date.addMonths(date.addDays(now, 0), -1)), 'MM');
        StartMonth2 = "0";
        EndMonth2 = "0"
    }
    if (dateFilter == "Last_2_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -2)), 'YYYY-MM-DD'); /*(2018 - 01 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }



    }
    if (dateFilter == "Last_3_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -3)), 'YYYY-MM-DD'); /*(2017 - 12 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "Last_6_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -6)), 'YYYY-MM-DD'); /*(2017 - 09 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/
        var year1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "From_The_Begining_of_Year") {

        CurrentYear = date.format(date.addDays(now, 0), 'YYYY');

        //StartDate = CurrentYear + "-01-01"; /*(2018 - 01 - 01)*/
        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/
        Startyear = CurrentYear;
        EndYear = "0";
        StartMonth1 = "01";
        EndMonth1 = date.format(date.addDays(now, -1), 'MM');
        StartMonth2 = "0";
        EndMonth2 = "0"

    }

    Startyear = parseInt(Startyear);
    EndYear = parseInt(EndYear);
    StartMonth1 = parseInt(StartMonth1);
    EndMonth1 = parseInt(EndMonth1);
    StartMonth2 = parseInt(StartMonth2);
    EndMonth2 = parseInt(EndMonth2);


    //select * from cb_mon_sp_monthly_cost_vs_budget_get_budget(149, 2019, 0, 1, 2, 1, 2, 'Last_30_Days', 'refcursor');
  //  config.query("select * from cb_mon_sp_monthly_cost_vs_budget_get_budget(" + entityId + ", " + Startyear + ", " + EndYear + ", " + StartMonth1 + "," + EndMonth1 + ", " + StartMonth2 + ", " + EndMonth2 + ",'" + ReportShowBy + "','info'); fetch all in \"info\";", function (err, result, fields) {
    
   //  config.query("select * from cb_mon_sp_monthly_cost_vs_budget_get_budget1('" + username + "'," + entityId + ", " + Startyear + ", " + EndYear + ", " + StartMonth1 + "," + EndMonth1 + ", " + StartMonth2 + ", " + EndMonth2 + ",'" + ReportShowBy + "','info'); fetch all in \"info\";", function (err, result, fields) {
     
     config.query("select * from cb_mon_sp_monthly_cost_vs_budget_get_budget1('" + username + "'," + entityId + ", " + Startyear + ", " + EndYear + ", " + StartMonth1 + "," + EndMonth1 + ", " + StartMonth2 + ", " + EndMonth2 + ",'" + ReportShowBy + "','info'); fetch all in \"info\";", function (err, result, fields) { 
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
            //res.send(status);
        }
        else {
            console.log('Error while performing Query.', err);
        }

    });

}

exports.GetBudgetForReport = GetBudgetForReport;


function GetBudgetForNotification(req, res, next) {

    var ReportShowBy;
    var entityId;
    var dateFilter;
    var Startyear;
    var EndYear;
    var StartMonth1;
    var EndMonth1;
    var StartMonth2;
    var EndMonth2;
    var username;


    if (req.query.entityId) {
        entityId = req.query.entityId;
    }

    if (req.query.dateFilter) {
        dateFilter = req.query.dateFilter;
    }
    if (req.query.ReportShowBy) {
        ReportShowBy = req.query.ReportShowBy;
    }

    if (req.query.username) {
        username = req.query.username;
    }




    if (dateFilter == "Last_30_Days") {
        //StartDate = date.format(date.addDays((date.addDays(now, -1)), -30), 'YYYY-MM-DD'); /*(2018 - 02 - 12)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -30), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }


    }
    if (dateFilter == "Last_7_Days") {

        //StartDate = date.format(date.addDays((date.addDays(now, -1)), -7), 'YYYY-MM-DD'); /*(2018 - 03 - 07)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY'); /*(2018 - 03 - 14)*/
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays((date.addDays(now, -1)), -7), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "Yesterday") {

        //StartDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        //EndDate = date.format(date.addDays(now, 0), 'YYYY-MM-DD'); /*(2018 - 03 - 15)*/

        var year1 = date.format(date.addDays(now, -1), 'YYYY');
        var year2 = date.format(date.addDays(now, 0), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format(date.addDays(now, -1), 'MM');
            EndMonth1 = date.format(date.addDays(now, 0), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format(date.addDays(now, -1), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, 0), 'MM');
        }

    }
    if (dateFilter == "The_Previous_Month") {
        Startyear = date.format((date.addMonths(date.addDays(now, 0), -1)), 'YYYY');
        EndYear = "0";
        StartMonth1 = date.format((date.addMonths(date.addDays(now, 0), -1)), 'MM');
        EndMonth1 = date.format((date.addMonths(date.addDays(now, 0), -1)), 'MM');
        StartMonth2 = "0";
        EndMonth2 = "0"
    }
    if (dateFilter == "Last_2_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -2)), 'YYYY-MM-DD'); /*(2018 - 01 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -2)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }



    }
    if (dateFilter == "Last_3_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -3)), 'YYYY-MM-DD'); /*(2017 - 12 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/

        var year1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -3)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "Last_6_Months") {

        //StartDate = date.format((date.addMonths(date.addDays(now, -1), -6)), 'YYYY-MM-DD'); /*(2017 - 09 - 14)*/

        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/
        var year1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'YYYY');
        var year2 = date.format(date.addDays(now, -1), 'YYYY');
        if (year1 == year2) {
            Startyear = year1;
            EndYear = "0";
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'MM');
            EndMonth1 = date.format(date.addDays(now, -1), 'MM');
            StartMonth2 = "0";
            EndMonth2 = "0"
        }
        else {
            Startyear = year1;
            EndYear = year2;
            StartMonth1 = date.format((date.addMonths(date.addDays(now, -1), -6)), 'MM');
            EndMonth1 = "12";
            StartMonth2 = "01";
            EndMonth2 = date.format(date.addDays(now, -1), 'MM');
        }

    }
    if (dateFilter == "From_The_Begining_of_Year") {

        CurrentYear = date.format(date.addDays(now, 0), 'YYYY');

        //StartDate = CurrentYear + "-01-01"; /*(2018 - 01 - 01)*/
        //EndDate = date.format(date.addDays(now, -1), 'YYYY-MM-DD'); /*(2018 - 03 - 14)*/
        Startyear = CurrentYear;
        EndYear = "0";
        StartMonth1 = "01";
        EndMonth1 = date.format(date.addDays(now, -1), 'MM');
        StartMonth2 = "0";
        EndMonth2 = "0"

    }

    Startyear = parseInt(Startyear);
    EndYear = parseInt(EndYear);
    StartMonth1 = parseInt(StartMonth1);
    EndMonth1 = parseInt(EndMonth1);
    StartMonth2 = parseInt(StartMonth2);
    EndMonth2 = parseInt(EndMonth2);



    //    config.query("select * from cb_mon_sp_monthly_cost_vs_budget_get_budget(" + entityId + ", " + Startyear + ", " + EndYear + ", " + StartMonth1 + "," + EndMonth1 + ", " + StartMonth2 + ", " + EndMonth2 + ",'" + ReportShowBy + "','info'); fetch all in \"info\";", function (err, result, fields) {
    //config.query("select * from cb_mon_sp_monthly_cost_vs_budget_get_budget1('" + username + "'," + entityId + ", " + Startyear + ", " + EndYear + ", " + StartMonth1 + "," + EndMonth1 + ", " + StartMonth2 + ", " + EndMonth2 + ",'" + ReportShowBy + "','info'); fetch all in \"info\";", function (err, result, fields) {
                                                      
   config.query("select * from _cb_mon_notification_for_budget('" + username + "'," + entityId + ",'" + dateFilter + "','" + ReportShowBy + "');", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
            //res.send(status);
        }
        else {
            console.log('Error while performing Query.', err);
        }

    });

}
   

exports.GetBudgetForNotification = GetBudgetForNotification;




