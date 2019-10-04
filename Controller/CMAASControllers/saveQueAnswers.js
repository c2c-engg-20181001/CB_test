var config = require('../../config');

function saveAnswers(req, res, next) {  
    var issueBlocker = null;
    var complexity = null;
    var comments = null;  
    var sectionid = 0;
    var userid = 0;
    var questionid = 0;
    var surveyId = 0;
    var answerType = null;
    //var isSubmit = null;
   
    if (req.body.issueBlocker) {
        issueBlocker = req.body.issueBlocker;
    }
    if (req.body.complexity) {
        complexity = req.body.complexity;
    }
    if (req.body.comments) {
        comments = req.body.comments;
    }
    if (req.body.sectionid) {
        sectionid = req.body.sectionid;
    }
    if (req.body.userid) {
        userid = req.body.userid;
    }
    if (req.body.questionid) {
        questionid = req.body.questionid;
    }
    if (req.body.answerType) {
        answerType = req.body.answerType;
    } 
    if (req.body.surveyId) {
        surveyId = req.body.surveyId;
    }

    config.query("select * from cb_cmaas_sp_insert_answers('" + issueBlocker + "','" + complexity + "','" + answerType + "','" + comments + "','" + sectionid + "','" + userid + "','" + questionid + "','" + surveyId + "','insertifnotexist','info');", function (err, result, fields) {
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
exports.saveAnswers = saveAnswers;

/*----  to get question and available answers ---*/
function getQueAnswers(req, res, next) {
    var sectionid = null;
    var userid = null;
    var surveyid = null;
    var mode = null;

    if (req.body.sectionid) {
        sectionid = req.body.sectionid;
    }
    if (req.body.userid) {
        userid = req.body.userid;
    }
    if (req.body.surveyid) {
        surveyid = req.body.surveyid;
    }
    if (req.body.mode) {
        mode = req.body.mode;
    }
    
    config.query("select * from cb_cmaas_sp_get_questions('" + userid + "','" + sectionid + "','" + surveyid + "','" + mode+"');", function (err, result, fields) {
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
exports.getQueAnswers = getQueAnswers;

/*----  to get logged in user id from user name ---*/
function get_loggedin_user_id(req, res, next) {
    var user_id = null;
    var user_name = null;
    var mode = '';

    if (req.query.user_name) {
        user_name = req.query.user_name;
    }

    if (req.query.mode) {
        mode = req.query.mode;
    }

    config.query("SELECT * from cb_cmaas_sp_get_dashboard(null,'" + user_name + "',null,'" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) {
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
exports.get_loggedin_user_id = get_loggedin_user_id;


/*----  to get Survey Name  ---*/
function getSurveyName(req, res, next) {
    var cloud_id = null;
    var user_id = null;
    var mode = null;

    if (req.query.cloud_id) {
        cloud_id = req.query.cloud_id;
    }
    if (req.query.user_id) {
        user_id = req.query.user_id;
    }
    if (req.query.mode) {
        mode = req.query.mode;
    }
    config.query("SELECT * from cb_cmaas_sp_get_overview2('" + user_id + "','" + cloud_id + "','null','" + mode + "','info');FETCH ALL IN \"info\";", function (err, result, fields) { 
        //config.query("select * from cb_cmaas_sp_get_overview2('" + user_id + "','" + cloud_id + "','null','" + mode + "');", function (err, result, fields) {
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
exports.getSurveyName = getSurveyName;