var mysql = require("mysql");
var crypto = require('crypto');
var CompareConfig = require('../../CompareConfig');

var os;
var service;

function GetAzureData(req, res, next) {

	//SELECT MeterCategory, MeterRegion, MeterSubCategory, MeterRates, Unit, IF(LOCATE(\"Hour\",Unit),concat(\"$ \",round((IFNULL(MeterRates,0)*30),2),\" / Month\"),concat(\"$\",( IFNULL(MeterRates,0))," / ",Unit))  as finalPrice FROM azure_price_service');

	CompareConfig.query('SELECT MeterCategory,MeterRegion,MeterSubCategory,MeterRates,Unit,IF(LOCATE("Hour",Unit),concat("$ ",round((IFNULL(MeterRates,0)*30),2)," / Month"),concat("$",( IFNULL(MeterRates,0))," /",Unit))  as finalPrice FROM azure_price_service ', function (err, result) {
		if (!err) {
			//console.log(result);
			res.header("access-control-allow-origin", "*");
			res.send(result);
		}
		else {
			console.log('Error while performing Query.', err);
		}
	});
}
exports.GetAzureData = GetAzureData;

function GetAwsData(req, res, next) {
	var query = "";
	var listPara = req.query.region_os.split("@");//split by @ bcz from react we get region and os in case of compute by joining @.
	var Region = listPara[0];//region
	if (listPara.length > 1) {
		os = listPara[1];//os (only for compute) 
		service = listPara[2];
	}

	var name = Region.split('_')[1];
	if (service == 'compute') {
		var regionName = getRegion_AWS(Region);
		query = '';
		//query = 'SELECT distinct(PricePerUnit), OfferingClass, PurchaseOption, LeaseContractLength, concat("$", PricePerUnit, " /", Unit) as finalPrice, Memory, InstanceType, OperatingSystem, vCPU, Unit, PreInstalledSW FROM cloud_data.aws_compute_service where Location="' + regionName + '" and OperatingSystem="' + os + '"';
		query = 'SELECT distinct(PricePerUnit), OfferingClass, PurchaseOption, LeaseContractLength,  PricePerUnit , Memory, InstanceType, OperatingSystem, vCPU, Unit, PreInstalledSW,IF(Unit = "Hrs",concat("$",round((IFNULL(PricePerUnit,0)*30),2),"/Month"),concat("$",round(( IFNULL(PricePerUnit,0)),2),"/",Unit)) as finalPrice,"' + regionName + '" as region FROM cloud_data.aws_compute_service where Location="' + regionName + '" and OperatingSystem="' + os + '" and TermType="OnDemand"';

		service = "";
	}
	else if (name == 'net') {
		var regionName = getRegion_AWS(Region.split('_')[0]);
		query = '';
		// query = 'SELECT FromLocation,ToLocation,TransferType,usageType,concat("$",PricePerUnit," /",Unit ) as finalPrice FROM cloud_data.aws_net_service where FromLocation="' + regionName + '" OR  ToLocation="' + regionName + '"';
		query = 'SELECT FromLocation,ToLocation,TransferType,usageType,PricePerUnit,Unit, IF(Unit = "Hrs" or Unit = "hours", concat("$", round((IFNULL(PricePerUnit, 0) * 30), 2), "/Month"), concat("$", round((IFNULL(PricePerUnit, 0)), 2), "/", Unit)) as finalPrice  FROM cloud_data.aws_net_service where FromLocation="' + regionName + '" OR  ToLocation="' + regionName + '"';

		name = '';
	}
	else if (name == 'Storage') {
		var regionName = getRegion_AWS(Region.split('_')[0]);
		query = '';
		query = 'SELECT FromLocation,ToLocation,TransferType,usageType,PricePerUnit,Unit , IF(Unit = "Hrs" or Unit = "hours" ,concat("$",round((IFNULL(PricePerUnit,0)*30),2),"/Month"),concat("$",round(( IFNULL(PricePerUnit,0)),2),"/",Unit)) as finalPrice FROM cloud_data.aws_storage_service where FromLocation="' + regionName + '" OR  ToLocation="' + regionName + '"';
		name = '';
	}
	else if (Region == 'azure_service')
		query = 'SELECT MeterCategory,MeterRegion,MeterSubCategory,MeterRates,Unit,IF(LOCATE("Hour",Unit),concat("$ ",round((IFNULL(MeterRates,0)*30),2),"/Month"),concat("$",( IFNULL(MeterRates,0)),"/",Unit))  as finalPrice FROM cloud_data.azure_price_service';
	else if (Region == 'google_service')
		// query = 'SELECT * FROM cloud_data.google_price_service';
		query = 'SELECT * FROM cloud_data.google_price_data';


	CompareConfig.query(query, function (err, rows, fields) {
		if (!err) {
			console.log(rows);
			// var data = JSON.parse(rows);
			// console.log('The solution is: ', rows);
			//SET SESSION group_concat_max_len = 1000000;
			res.header("Access-Control-Allow-Origin", "*");
			res.send(
				rows
				//data
			);
		}
		else {
			console.log('Error while performing Query.', err);
			res.json([{
				id: err,
				username: "Error..."
			}]);
		}

	});
}
exports.GetAwsData = GetAwsData;


function GetAwsCompute(req, res, next) {

    var RegionName = req.query.region;
    var RegionArray = RegionName.split(',');
    var computeRegion = "";
    var i = 0;
    for ( i = 0; i < RegionArray.length; i++) {
        if (i == 0) {
            computeRegion = getRegion_AWS(RegionArray[i]);
        }
        else {
            computeRegion = computeRegion + ',' + getRegion_AWS(RegionArray[i]);
        }
      
    }

    var RegionCompute = '\'' + computeRegion.split(',').join('\',\'') + '\'';
    RegionCompute = RegionCompute.replace(/\"/g, "");
    var os = req.query.os;

    CompareConfig.query('SELECT distinct(PricePerUnit), PricePerUnit , Memory, InstanceType, OperatingSystem, vCPU, Unit, IF(Unit = "Hrs", concat("$", round((IFNULL(PricePerUnit, 0) * 30), 2), "/Month"), concat("$", round((IFNULL(PricePerUnit, 0)), 2), "/", Unit)) as finalPrice, Location as region FROM cloud_data.aws_compute_service where Location in (' + RegionCompute+') and OperatingSystem="'+os+'" and TermType= "OnDemand";', function (err, result) {
        if (!err) {
            //console.log(result);
            res.header("access-control-allow-origin", "*");
            res.send(result);
        }
        else {
            console.log('Error while performing Query.', err);
        }
    });
}
exports.GetAwsCompute = GetAwsCompute;

function getRegion_AWS(region) {
	var awsRegion = JSON.parse('{"us-east-1": "US East (N. Virginia)", "us-east-2": "US East (Ohio)","us-west-1": "US West (N. California)","us-west-2": "US West (Oregon)","ap-southeast-1": "Asia Pacific (Singapore)","ap-southeast-2": "Asia Pacific (Sydney)", "ap-south-1": "Asia Pacific (Mumbai)","sa-east-1": "South America (Sao Paulo)","ca-central-1": "Canada (Central)","eu-west-1": "EU (Ireland)", "eu-west-2": "EU (London)", "eu-central-1": "EU (Frankfurt)","ap-northeast-2": "Asia pacific (Seoul)","ap-northeast-1": "Asia pacific (Tokyo)"}');
	return awsRegion[region];
}





