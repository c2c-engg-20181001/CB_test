var config = require('../../config');


function InsertBudget(req, res, next) {
     var Jan = null; var JanPer = null; var JanEq = null;
    var Feb = null; var FebPer = null; FebEq = null;
    var Mar = null; var MarPer = null; MarEq = null;
    var Apr = null; var AprPer = null; AprEq = null;
    var May = null; var MayPer = null; MayEq = null;
    var Jun = null; var JunPer = null; JunEq = null;
    var Jul = null; var JulPer = null; JulEq = null;
    var Aug = null; var AugPer = null; AugEq = null;
    var Sep = null; var SepPer = null; SepEq = null;
    var Oct = null; var OctPer = null; OctEq = null;
    var Nov = null; var NovPer = null; NovEq = null;
    var Dec = null; var DecPer = null; DecEq = null;
    var BudgetTotal;
    var year = "";
    var entityid = "";
    var status = "completed";
    var user_group = '';
    var emailReceipient = '';

    if (req.query.Jan != "") {
        Jan = parseFloat(req.query.Jan)
        JanPer = parseFloat(req.query.JanPer)
        JanEq = parseFloat(JanPer / 100 * Jan);
    }

    if (req.query.Feb != "") {
        Feb = parseFloat(req.query.Feb)
        FebPer = parseFloat(req.query.FebPer)
        FebEq = parseFloat(FebPer / 100 * Feb);
    }
    if (req.query.Mar != "") {
        Mar = parseFloat(req.query.Mar)
        MarPer = parseFloat(req.query.MarPer)
        MarEq = parseFloat(MarPer / 100 * Mar);
    }
    if (req.query.Apr != "") {
        Apr = parseFloat(req.query.Apr)
        AprPer = parseFloat(req.query.AprPer)
        AprEq = parseFloat(AprPer / 100 * Apr);
    }
    if (req.query.May != "") {
        May = parseFloat(req.query.May)
        MayPer = parseFloat(req.query.MayPer)
        MayEq = parseFloat(MayPer / 100 * May);
    }
    if (req.query.Jun != "") {
        Jun = parseFloat(req.query.Jun)
        JunPer = parseFloat(req.query.JunPer)
        JunEq = parseFloat(JunPer / 100 * Jun);
    }
    if (req.query.Jul != "") {
        Jul = parseFloat(req.query.Jul)
        JulPer = parseFloat(req.query.JulPer)
        JulEq = parseFloat(JulPer / 100 * Jul);
    }
    if (req.query.Aug != "") {
        Aug = parseFloat(req.query.Aug)
        AugPer = parseFloat(req.query.AugPer)
        AugEq = parseFloat(AugPer / 100 * Aug);
    }
    if (req.query.Sep != "") {
        Sep = parseFloat(req.query.Sep)
        SepPer = parseFloat(req.query.SepPer)
        SepEq = parseFloat(SepPer / 100 * Sep);
    }
    if (req.query.Oct != "") {
        Oct = parseFloat(req.query.Oct)
        OctPer = parseFloat(req.query.OctPer)
        OctEq = parseFloat(OctPer / 100 * Oct);
    }
    if (req.query.Nov != "") {
        Nov = parseFloat(req.query.Nov)
        NovPer = parseFloat(req.query.NovPer)
        NovEq = parseFloat(NovPer / 100 * Nov);
    }
    if (req.query.Dec != "") {
        Dec = parseFloat(req.query.Dec)
        DecPer = parseFloat(req.query.DecPer)
        DecEq = parseFloat(DecPer / 100 * Dec);
    }
    if (req.query.year)
        year = parseInt(req.query.year)

    if (req.query.BudgetTotal)
        BudgetTotal = req.query.BudgetTotal

    if (req.query.entityid)
        entityid = parseInt(req.query.entityid)

    if (req.query.user_name)
        user_group = req.query.user_name

    if (req.query.emailReceipient)
        emailReceipient = req.query.emailReceipient

    
    config.query("select * from cb_mon_sp_budget_management1_new(" + entityid + ", " + year + ", 'insert_budget', " + Jan + ", " + Feb + "," + Mar + ", " + Apr + "," + May + ", " + Jun + "," + Jul + ", " + Aug + "," + Sep + ", " + Oct + "," + Nov + ", " + Dec + ",'" + user_group + "'," + JanPer + ", " + FebPer + "," + MarPer + ", " + AprPer + "," + MayPer + ", " + JunPer + "," + JulPer + ", " + AugPer + "," + SepPer + ", " + OctPer + "," + NovPer + ", " + DecPer + ", " + JanEq + ", " + FebEq + "," + MarEq + ", " + AprEq + "," + MayEq + ", " + JunEq + "," + JulEq + ", " + AugEq + "," + SepEq + ", " + OctEq + "," + NovEq + ", " + DecEq + ", '" + emailReceipient + "','info');", function (err, result, fields) {
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
exports.InsertBudget = InsertBudget;



function GetBudget(req, res, next) {
    var year = "";
    var entityid = "";
    var user_group='';

       if (req.query.year)
              year = parseInt(req.query.year)

    if (req.query.entityid)
              entityid = parseInt(req.query.entityid)
                     
        if (req.query.user_name)
        user_group = req.query.user_name  

       config.query("select * from sp_budget_management(" + entityid + "," + year+",'get_budget',null,null,null,null,null,null,null,null,null,null,null,null,'"+user_group+"','info');fetch all in \"info\";", function (err, result, fields) {
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
exports.GetBudget = GetBudget;


function getbudgetdetailsbyentity(req, res, next) {
    var p_user_name = "";
    var p_period = "";
    var p_year = 0;
    var p_budgetmonth = 0;
    var p_budget_amount = 0;
    var p_entity_id = 0;
    var user_group = "";
    if (req.query.user_name)
        user_group = req.query.user_name

    if (req.query.p_user_name) {
        p_user_name = req.query.p_user_name;
    }
    if (req.query.p_period) {
        p_period = req.query.p_period;
    }
    if (req.query.p_year) {
        p_year = parseInt(req.query.p_year);
    }
    if (req.query.p_budgetmonth) {
        p_budgetmonth = parseInt(req.query.p_budgetmonth);
    } if (req.query.p_entity_id) {
        p_entity_id = parseInt(req.query.p_entity_id);
    }
    if (req.query.p_budget_amount) {
        p_budget_amount = req.query.p_budget_amount;
    }
    //select * from cb_mon_get_budget_details(2018,149,'select')
    //config.query("select * from cb_mon_get_budget_details(" + p_year + "," + p_entity_id + ",'select','" + user_group + "');", function (err, result) {

    config.query("select * from cb_mon_get_budget_details1_new(" + p_year + "," + p_entity_id + ",'select','" + user_group + "');", function (err, result) {
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
exports.getbudgetdetailsbyentity = getbudgetdetailsbyentity;

function cb_tree_data(req, res, next) {

    config.query("SELECT * from _a_tree_data('" + req.body.usergroup + "','select1','info');fetch all in \"info\";", function (err, res1) {
        console.log(err);
        if (!err) {
            console.log(res1.rows);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Credentials', '*');
            console.log(res1[1].rows)
            res.send(res1[1].rows);
        }
    });
}
exports.cb_tree_data = cb_tree_data;

function cb_billingreport(req, res, next) {

    console.log("select _cb_new_billingreport1('" + req.body.usergroup + "'," + req.body.entityid + ",'" + req.body.startdate + "','" + req.body.enddate + "','" + req.body.subs + "','" + req.body.mode + "')");
    config.query("select _cb_new_billingreport1('" + req.body.usergroup + "'," + req.body.entityid + ",'" + req.body.startdate + "','" + req.body.enddate + "','" + req.body.subs + "','" + req.body.mode + "')", function (err, res1) {

        console.log(res1.rows);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', '*');

        res.send(res1.rows);
    });
}
exports.cb_billingreport = cb_billingreport;


