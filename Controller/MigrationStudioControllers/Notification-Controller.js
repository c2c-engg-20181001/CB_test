var crypto = require('crypto');
var config = require('../../config');

function ScheduledNotifications(req, res, next) {
    var user_id = null;
    if (req.query.id1 != null) {
        user_id = parseInt(req.query.id1);       
    }
    config.query("select * from cb_mig_sp_get_schedule_details_for_notification(" + user_id + ",'select');", function (err, result) {
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
exports.ScheduledNotifications = ScheduledNotifications; 

function userMigrationJobDetails(req, res, next) {
    var user_id = null;
    if (req.query.id1 != null) {
        user_id = parseInt(req.query.id1);
    }
    config.query("select * from cb_mig_sp_select_job_details_DnD(" + user_id + ",'select');", function (err, result) {
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
exports.userMigrationJobDetails = userMigrationJobDetails;

function updateuserMigrationallJobDetails(req, res, next) {
    var user_id = null;
    var job_id = null;
    var job_status = null;
    var error_message = null;

    if (req.query.id1) {
        user_id = parseInt(req.query.id2);
    }
    if (req.query.id2) {
        job_id = req.query.id1;
    }
    if (req.query.id3) {
        job_status = req.query.id3;
    }
    if (req.query.id4) {
        error_message = req.query.id4;
    }

    config.query("select * from cb_mig_sp_update_complete_migration_job_details_dnd('" + job_id + "', " + user_id + ", 'update', '" + job_status + "','" + error_message + "', 'info');", function (err, result) {
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
exports.updateuserMigrationallJobDetails = updateuserMigrationallJobDetails;

function userMigrationallJobDetails(req, res, next) {


    var user_id = null;
    var job_id = null;
    var job_status = null;

    if (req.query.id1 != null) {
        user_id = parseInt(req.query.id1);
        //user_id = 2;


    }
    if (req.query.id2) {
        job_status = req.query.id2;
    }
    if (req.query.id3) {
        //job_status = parseInt(req.query.id3);
    }

    // config.query("select * from sp_select_job_details('', " + user_id + " ,'','select', 'info');", function (err, result) {
    config.query("select * from cb_mig_sp_get_complete_migration_job_details(" + user_id + ", '" + job_status + "' ,'select');", function (err, result) {
        //  config.query("select * from sp_get_complete_migration_job_details(17,'Running','select');", function (err, result) {
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
exports.userMigrationallJobDetails = userMigrationallJobDetails;
