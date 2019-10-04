var config = require('../../config');
//TCO Graph
function get_allCloudCost_TCO(req, res, next) {
    var usergroup = "";
    var mode = "";    
    if (req.query.usergroup) {
        usergroup = req.query.usergroup;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }   
    config.query("select * from cb_dashboard_tco('" + usergroup + "','" + mode + "');", function (err, result, fields) {       
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
exports.get_allCloudCost_TCO = get_allCloudCost_TCO;

// Consumption Graph
function GetDashboardConsumptionCost(req, res, next) {
    var group = null;
    var mode = null;

    if (req.query.group) {
        group = req.query.group;
    }

    if (req.query.mode)
        mode = req.query.mode;

    config.query("select * from cb_dashboard_consumption_by_services1('" + group + "','" + mode + "')", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('error while performing query.', err);
        }
    });
}
    exports.GetDashboardConsumptionCost = GetDashboardConsumptionCost;

//Migration Graph
function get_migration(req, res, next) {
    var username = "";
     var type = "";
   
    if (req.query.username) {
        username = req.query.username;
    }
     if (req.query.type) {
        type = req.query.type;
    }
   
    config.query("select * from cb_migration_get_migration_count('" + username + "','" + type + "');", function (err, result, fields) {
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
exports.get_migration = get_migration;

//new dashboard database graph
function dashboard_database_graph(req, res, next) {
   
    var usergroup = "";
    var mode = "";


    if (req.query.usergroup) {
        usergroup = req.query.usergroup;
    }

    if (req.query.mode) {
        mode = req.query.mode;
    }

    spName = 'cb_migration_get_migration_count'

    config.query("select * from " + spName + "('" + usergroup + "','" + mode + "');", function (err, result, fields) {

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
exports.dashboard_database_graph = dashboard_database_graph;

//dashboard database accounts graph 
function get_allClouddatabase(req, res, next) {
    var usergroup = "";
    var mode = "";
    if (req.query.usergroup) {
        usergroup = req.query.usergroup;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    config.query("select * from cb_migration_get_migration_count('" + usergroup + "','" + mode + "');", function (err, result, fields) {
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
exports.get_allClouddatabase = get_allClouddatabase;

// dashboard storage accounts graph
function get_allCloudstorage(req, res, next) {
    var usergroup = "";
    var mode = "";
    if (req.query.usergroup) {
        usergroup = req.query.usergroup;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    config.query("select * from cb_migration_get_migration_count('" + usergroup + "','" + mode + "');", function (err, result, fields) {
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
exports.get_allCloudstorage = get_allCloudstorage;

// dashboard storage graph

function GetDashboardStorageCount(req, res, next) {

    var group = null;
    var mode = null;


    if (req.query.group) {
        group = req.query.group;
    }

    if (req.query.mode)
        mode = req.query.mode;


    config.query("select * from cb_migration_get_migration_count('" + group + "','" + mode + "')", function (err, result, fields) {
        if (!err) {
            console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('error while performing query.', err);
        }
    });
}
exports.GetDashboardStorageCount = GetDashboardStorageCount;
//container
function get_container(req, res, next) {
    var user = "";
   
    if (req.query.user) {
        user = req.query.user;
    }
    
    config.query("select * from cb_mon_container_providers_detail_report('" + user + "');", function (err, result, fields) {
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
exports.get_container = get_container;
//cloud Account Count
function dashboard_cloudacc_count(req, res, next) {

    var p_group = "";
    var p_mode = "";


    if (req.query.p_group) {
        p_group = req.query.p_group;
    }

    if (req.query.p_mode) {
        p_mode = req.query.p_mode;
    }

    spName = 'cb_cloud_provider_count2'

    config.query("select * from " + spName + "('" + p_group + "','" + p_mode + "');", function (err, result, fields) {

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
exports.dashboard_cloudacc_count = dashboard_cloudacc_count;

//google maps

function dynamic_google_map(req, res, next) {
    var user = "";
    var mode = "";

    if (req.query.user) {
        user = req.query.user;

    }
    if (req.query.mode) {
        mode = req.query.mode;
    }


    console.log("APi hitted")

    //console.log(req.query.user)

    config.query("select cb_dashboard_map_details_upgraded('" + user + "','"  + mode + "')", function (err, result, fields) {
        if (!err) {
            console.log(result.rows);
            res.header("access-control-allow-origin", "*");
            res.send(result.rows);

        } else
            console.log('Error while performing Query.', err);

    });
}
exports.dynamic_google_map = dynamic_google_map;