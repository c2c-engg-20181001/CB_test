var config = require('../../config');

function get_ope_per(req, res, next) {
    var content;
    var contents = [];
    //contents = req.query.Tenanntids;
    content = req.query.vm_detailsss;
    contents = JSON.parse(content);
    var Tenant_id = '8d701aac-2869-431d-9b81-9720beb26fb9';
    var p_client_id = '4e159677-fa99-447b-8e62-196dbe13432e';
    var p_client_secret = 'ULcQVGQRhikrHTJh9ugPL+yajd8SBzZatXONmvnEjl0=';
    var p_grant_type = 'client_credentials';
    var p_resource = 'https://management.azure.com/';
    var request = require("request");
    var vmname;
    var resource_group;
    var Performance_data = [];
    var q= 0 ;

    var d = new Date();
    d.setDate(d.getDate() - 6);
    var blablabla = d;

    var currentdate = new Date().toISOString();
    var previousdate = d.toISOString();
    
    
        var options = {
            method: 'POST',
            url: 'https://login.microsoftonline.com/' + Tenant_id + '/oauth2/token',
            headers:
            {
                'Postman-Token': '162cff28-089a-4d30-bdc1-30b3e6c1e8f1',
                'cache-control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form:
            {
                client_id: p_client_id,
                client_secret: p_client_secret,
                grant_type: p_grant_type,
                resource: p_resource,
                undefined: undefined
            }
        };
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            // console.log(body);
            var object1 = JSON.parse(body);
            var token = object1.access_token;
            var bearerToken = 'Bearer ' + token;
            for (var i = 0; i < contents.length; i++) {
                vmname = contents[i].vm_name;
                resource_group = contents[i].resource_group;
                var options = {
                    method: 'GET',
                    //url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/' + resource_group + '/providers/Microsoft.Compute/virtualMachines/' + vmname + '/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU&timespan=2019-05-15T05:47:00Z/2019-05-15T05:55:00Z&aggregation=Average,minimum,maximum,total',
                   url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/' + resource_group + '/providers/Microsoft.Compute/virtualMachines/' + vmname + '/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU,Network%20OUT,Network%20IN,Disk%20Write%20Bytes,Disk%20Read%20Bytes&timespan=2019-05-15T05:45:00Z/2019-05-15T05:55:00Z&aggregation=Average,minimum,maximum,total',
                    //url: 'https://management.azure.com/subscriptions/efbaf842-f428-4020-8718-9e3a642fa2c6/resourceGroups/' + resource_group + '/providers/Microsoft.Compute/virtualMachines/' + vmname + '/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=Percentage%20CPU,Network%20OUT,Network%20IN,Disk%20Write%20Bytes,Disk%20Read%20Bytes&timespan=' + previousdate +'/' + currentdate +'&aggregation=Average,minimum,maximum,total',
                    headers:
                    {
                        'Authorization': bearerToken
                    },
                };
                 request(options, function (error, response, body) {
                         if (error) throw new Error(error);
                    
                       // console.log(body);
                   // res.send(body);
                    var b = [];
                     body;
                     b = JSON.parse(body);
                    var avg;
                    var min;
                     var max;
                     var total
                     var region;
                     var vm;
                     var VMname;
                     var metricName;
                    
                    // var spike=0;
                     region = b.resourceregion;
                     vm = b.value[0].id;
                     VMname = vm.split("/");
                     for (var p = 0; p < b.value.length; p++) {
                         for (var acbd = 0; acbd < b.value[p].timeseries[0].data.length; acbd++) {

                             metricName = b.value[p].name.value;
                             if (b.value[p].timeseries[0].data[acbd].average != undefined) {

                                 avg = b.value[p].timeseries[0].data[acbd].average;
                                 min = b.value[p].timeseries[0].data[acbd].minimum;
                                 max = b.value[p].timeseries[0].data[acbd].maximum;
                                 total = b.value[p].timeseries[0].data[acbd].total;

                                 //       if (spike < max) {
                                 //            x = max;
                                 //        }
                             }
                             //   if (spike == max) {
                             //       spike = undefined;
                             //   }
                         }
                         Performance_data[q] = { location: region, vm_name: VMname[8], avg: avg, min: min, max: max, total: total, metricName: metricName };
                         q++;
                    }
                    
                  
                    
                     if (Performance_data.length == (contents.length * 5)) {
                        var result = JSON.stringify(Performance_data);                        
                        res.header("access-control-allow-origin", "*");
                        console.log(result);
                        res.send(result);

                    }
                });

            }
            
        });
   

}
exports.get_ope_per = get_ope_per;
