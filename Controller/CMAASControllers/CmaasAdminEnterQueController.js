var config = require('../../config');

function cmaasEnterQue(req, res, next) {
    var cloudid = null;
    var sectionid = null;
    var question = null;
    var questionreason = null;
    var mode = null;
 

    if (req.query.cloudid) {
        cloudid = parseInt(req.query.cloudid);
    }
    if (req.query.sectionid) {
        sectionid = parseInt(req.query.sectionid);
    }
    if (req.query.question) {
        question = req.query.question;
    }
    if (req.query.questionreason) {
        questionreason = req.query.questionreason;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
   


    config.query("select * from cb_cmaas_sp_put_admin_enter_ques(" + sectionid + ",null,'" + question + "','" + questionreason + "','" + cloudid + "','" + mode + "', 'info');", function (err, result) {
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
exports.cmaasEnterQue = cmaasEnterQue; 

function cmaasEnterSection(req, res, next) {
    var cloudid = null;
    var sectionName = null;
    var mode = null;


    if (req.query.cloudid) {
        cloudid = parseInt(req.query.cloudid);
    }

    if (req.query.sectionName) {
        sectionName = req.query.sectionName;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }



    config.query("select * from cb_cmaas_sp_put_admin_secname(" + cloudid + " ,'" + sectionName + "','"  + mode + "', 'info');", function (err, result) {
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
exports.cmaasEnterSection = cmaasEnterSection; 

function cmaasSectionList(req, res, next) {
    var cloudid = null;
    var sectionName = null;
    var mode = null;


    if (req.query.cloudid) {
        cloudid = parseInt(req.query.cloudid);
    }

    if (req.query.sectionName) {
        sectionName = req.query.sectionName;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }



    config.query("select * from cb_cmaas_sp_put_admin_secname('" + cloudid + "',null,'" + mode + "', 'info');FETCH ALL IN \"info\";", function (err, result) {
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
exports.cmaasSectionList = cmaasSectionList; 

function cmaasViewAll(req, res, next) {
    var sectionid = null;
    var question = null;
    var questionreason = null;
    var cloudid = null;
    var mode = null;


    if (req.query.sectionid) {
        sectionid = parseInt(req.query.sectionid);
    }
    if (req.query.cloudid) {
        cloudid = parseInt(req.query.cloudid);
    }

    if (req.query.question) {
        question = req.query.question;
    }
    if (req.query.questionreason) {
        questionreason = req.query.questionreason;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }



    config.query("select * from cb_cmaas_sp_put_admin_enter_ques(null,null,null,null,'" + cloudid + "','" + mode + "', 'info');FETCH ALL IN \"info\";", function (err, result) {
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
exports.cmaasViewAll = cmaasViewAll; 

function cmaasEdit(req, res, next) {
    var questionid = null;
    var question = null;
    var questionreason = null;
    var mode = null;



    if (req.query.questionid) {
        questionid = parseInt(req.query.questionid);
    }

    if (req.query.question) {
        question = req.query.question;
    }
    if (req.query.questionreason) {
        questionreason = req.query.questionreason;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }


    config.query("select * from cb_cmaas_sp_put_admin_enter_ques(null,'" + questionid + "','" + question + "','" + questionreason + "',null,'" + mode + "','info');", function (err, result) {
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
exports.cmaasEdit = cmaasEdit; 

function cmaasDelete(req, res, next) {
    var questionid = null;
    var question = null;
    var questionreason = null;
    var mode = null;



    if (req.query.questionid) {
        questionid = parseInt(req.query.questionid);
    }

    if (req.query.question) {
        question = req.query.question;
    }
    if (req.query.questionreason) {
        questionreason = req.query.questionreason;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }


    config.query("select * from cb_cmaas_sp_put_admin_enter_ques(null,'" + questionid + "',null,null,null,'" + mode + "','info');", function (err, result) {
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
exports.cmaasDelete = cmaasDelete; 

function getsinglecloud(req, res, next) {
    var cloudname;
    // if (req.query.clouddetailss) {
    cloudname = req.query.clouddetailss;
    //  }

    // cb_cmaas_sp_get_dashboard 
    // cb_cmaas_sp_select_cloud
    config.query("select * from  cb_cmaas_sp_get_savecloud('" + cloudname + "','selectCloudList1','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.getsinglecloud = getsinglecloud;

