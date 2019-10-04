var config = require('../../config');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'
var password = 'Click2Cloud';
var request = require('request');

var clusterAPIUrl = "http://192.168.0.78:8000/api/ali/"
//var clusterAPIUrl = "http://192.168.1.210:8000/api/ali/"


function getClusterDeatils(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllClustersDetails',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined || body.error =='' ) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getClusterDeatils = getClusterDeatils;

function getPodsDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        // http://192.168.0.78:8000/api/ali/clusterprovisiong/getAllPods
        url: clusterAPIUrl + 'clusterprovisiong/getAllPods',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getPodsDetails = getPodsDetails;


function getNodesDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllNodes',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined || body.error == "") {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getNodesDetails = getNodesDetails;


function getServiceDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllServices',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined && body.error == "") {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getServiceDetails = getServiceDetails;


function getNameSpaceDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllNamespaces',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getNameSpaceDetails = getNameSpaceDetails;


function getDeployemntDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllDeployments',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getDeployemntDetails = getDeployemntDetails;


function getSecretDetails(req, res, next) {
    p_user_id = req.body.user_id;

    var data = {
        "user_id": p_user_id,
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getAllSecrets',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error == undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getSecretDetails = getSecretDetails;


function getRegionListAlibaba(req, res, next) {
    // p_user_id = req.body.user_id;


    if (req.body.user_id) {
        p_user_id = req.body.user_id;
    }
    if (req.body.provider_id) {
        p_provider_id = req.body.provider_id;
    }

    var data = {
        "user_id": p_user_id,
        "provider_id": p_provider_id
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getRegionList',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error != '') {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
            else if (body.region_list != undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getRegionListAlibaba = getRegionListAlibaba;


function getVPCListAlibaba(req, res, next) {

    if (req.body.user_id) {
        p_user_id = req.body.user_id;
    }
    if (req.body.provider_id) {
        p_provider_id = req.body.provider_id;
    }

    if (req.body.region_id) {
        p_region_id = req.body.region_id;
    }

    var data = {
        "user_id": p_user_id,
        "provider_id": p_provider_id,
        "region_id": p_region_id
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getVPCList',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error != '') {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
            else if (body.vpc_list != undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getVPCListAlibaba = getVPCListAlibaba;


function getInstanceListAlibaba(req, res, next) {

    var body = JSON.parse(req.body.data) 
    
    if (body.user_id) {
        p_user_id = body.user_id;
    }
    if (body.provider_id) {
        p_provider_id = body.provider_id;
    }

    if (body.region_id) {
        p_region_id = body.region_id;
    }

    if (body.zone_id) {
        p_zone_id = body.zone_id;
    }

    var data = {
        "user_id": p_user_id,
        "provider_id": p_provider_id,
        "region_id": p_region_id,
        "zone_id_list": p_zone_id
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getInstanceList',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error != '') {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
            else if (body.instance_list != undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getInstanceListAlibaba = getInstanceListAlibaba;


function getKeyPairListAlibaba(req, res, next) {

    // var body = JSON.parse(req.body.data) 
    
    if (req.body.user_id) {
        p_user_id = req.body.user_id;
    }
    if (req.body.provider_id) {
        p_provider_id = req.body.provider_id;
    }

    if (req.body.region_id) {
        p_region_id = req.body.region_id;
    }
    var data = {
        "user_id": p_user_id,
        "provider_id": p_provider_id,
        "region_id": p_region_id        
    }
    var options = {
        method: 'GET',
        url: clusterAPIUrl + 'clusterprovisiong/getKeyPairList',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error != '') {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
            else if (body.key_pairs_list != undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.getKeyPairListAlibaba = getKeyPairListAlibaba;


function createClusterAlibaba(req, res, next) {

    // var body = JSON.parse(req.body.data) 
    
    if (req.body.user_id) {
        p_user_id = req.body.user_id;
    }
    if (req.body.provider_id) {
        p_provider_id = req.body.provider_id;
    }

    if (req.body.request_body) {
        p_request_body = req.body.request_body;
    }
    var data = {
        "user_id": p_user_id,
        "provider_id": p_provider_id,
        "request_body":JSON.parse(p_request_body)         
    }
    var options = {
        method: 'POST',
        url: clusterAPIUrl + 'clusterprovisiong/createKubernetesCluster',
        headers:
        {
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };
    res.header("access-control-allow-origin", "*");
    request(options, function (error, resp, body) {
        console.log(body)
        if (body != undefined) {
            if (body.error != '') {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else if (body.new_cluster_details != undefined) {
                res.header("access-control-allow-origin", "*");
                res.send(body)
            }
            else {
                res.header("access-control-allow-origin", "*");
                res.send(body.error)
            }
        }
        else {
            res.header("access-control-allow-origin", "*");
            res.send(error)
        }
    });
}
exports.createClusterAlibaba = createClusterAlibaba;