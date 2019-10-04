var config = require('../../config');

function importa(req, res, next) {


    var contents;
    var rest = {};
    var subcontents = [];
    var sub;
    var arri = [];
    var i;
    var j;
    var m = 0;
    var a = [];
    var l;
    var k = 0;
    var cloudid;
    var sectionidi = 1;
    var sectionsend;
    var section;
    var question;
    var why;
    var excelDatatoNode;
    //contents = req.data
    if (req.query.excelDatatoNode) {
        contents = req.query.excelDatatoNode;
        cloudid = req.query.cloudids;

        var array = JSON.parse("[" + contents + "]");
        var arry = array[0];

        function getFields(input, field) {
            var output = [];
            for (var i = 0; i < input.length; ++i)
                output.push(input[i][field]);
            return output;
        }

        var secname = getFields(arry, "Section Name");
        var quename = getFields(arry, "Question");
        var whyname = getFields(arry, "Why Do We ask Question");

    //    arri = array[0].split("");
        var secnamelength = secname.length;
        var quenamelength = quename.length;
        var whynamelength = whyname.length;
    //    var alength = le - 1;
    }
           
    for (var i = 0; i < secnamelength ;) {
        section = secname[i];
        var countSection = 0;
        config.query("select * from cb_cmaas_sp_put_admin_insert_question11('" + cloudid + "','" + section + "','insert11','info');FETCH ALL IN \"info\";", function (err, result, fields) {
            // if (!err) {
            //     console.log(result);
           // for (var k = 0; k < alength;) {
                section = secname[k];
                config.query("select * from cb_cmaas_sp_put_admin_insert_data3('" + cloudid + "','" + section + "','select1','info');FETCH ALL IN \"info\";", function (err, results, fields) {
                    a[m] = results[1].rows[0].sectionid;
                    question = quename[m];
                    why = whyname[m];
                    
                    config.query("select * from cb_cmaas_sp_put_admin_insert_question12('" + a[m] + "','" + question + "','" + why + "','" + cloudid + "','insert11','info');FETCH ALL IN \"info\";", function (err, result, fields) {
                        if (!err) {
                            countSection++;                            
                            if (countSection == secnamelength) {
                                console.log(result);
                                res.header("access-control-allow-origin", "*");
                                res.send(result);
                            }
                        }
                        else {
                            console.log('Error while performing Query.', err);
                        }

                    });
                    m++;
                });
                k = k + 1;
       //     }


            //     res.header("access-control-allow-origin", "*");
            //     res.send(result);
            // }
            // else {
            //     console.log('Error while performing Query.', err);
            // }
        });

       // config.query("select * from cb_cmaas_sp_put_admin_insert_data3('" + cloudid + "','" + section + "','select1','info');FETCH ALL IN \"info\";", function (err, results, fields) {
            //if (!err) {
            //    console.log(results);
            //    res.header("access-control-allow-origin", "*");
       //     a[m] = results[1].rows[0].sectionid;
            
       //         question = arri[((m * 3) + 1)];
       //         why = arri[((m * 3) + 2)];
       //         config.query("select * from cb_cmaas_sp_put_admin_insert_data2('" + a[m] + "','" + question + "','" + why + "','insert1','info');FETCH ALL IN \"info\";", function (err, result, fields) {
                        //if (!err) {
                        //    console.log(result);
                         //    res.header("access-control-allow-origin", "*");
                        //    res.send(result);
                        //}
                        //else {
                        //    console.log('Error while performing Query.', err);
                        //}
      //      });
      //      m++;
            //    res.send(results);
            //}
            //else {
            //    console.log('Error while performing Query.', err);
            //}
    //    });
        i = i + 1;
        
    }


    //r   for (var k = 0; k < alength;) {

    //r        config.query("select * from cb_cmaas_sp_put_admin_insert_data3('" + cloudid + "','" + section + "','select1','info');FETCH ALL IN \"info\";", function (err, results, fields) {
    //if (!err) {
    //    console.log(results);
    //    res.header("access-control-allow-origin", "*");
    //r           a[m] = results[1].rows[0].sectionid;
    //r           m++;
    //    res.send(results);
    //}
    //else {
    //    console.log('Error while performing Query.', err);
    //}
    //r   });
    //r   k = k + 3;
    //r    }



    /*
    for (var j = 0; j < alength - 1;) {
        section = arri[j];
        question = arri[j + 1];
        why = arri[j + 2];


        config.query("select * from cb_cmaas_sp_put_admin_insert_data2('" + a + "','" + question + "','" + why + "','insert1','info');FETCH ALL IN \"info\";", function (err, result, fields) {
            if (!err) {
            //    console.log(result);
            //    res.header("access-control-allow-origin", "*");
            //    res.send(result);
            //}
            //else {
            //    console.log('Error while performing Query.', err);
            //}
        });
        j = j + 3;
    }
    
    // res.header("access-control-allow-origin", "*");
    //res.send(contents);
    // res.send(contents)
    //subcontents = str.contents(2, 5);
    //subcontents = contents.substr(1, 3);
    // sub = subcontents;
    */
}
    exports.importa = importa;