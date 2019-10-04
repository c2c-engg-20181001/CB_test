//import { url } from 'inspector';

var request = require('request');
var querystring = require('querystring');
//var async = require('async');
var report = '';
var token = '';
var result1 = '';
var result2 = '';
var ResultArr = [];

var form = {
	grant_type: 'password',
	scope: 'openid',
	resource: 'https://analysis.windows.net/powerbi/api',
	client_id: 'bad4ff44-0a15-45dd-a8db-b48fb064dc36',
	username: 'suchita.nikhade@click2cloud.net',
	password:'Ganesh_88'
};

var formData = querystring.stringify(form);

// to get Authentication Token
function vital(req, res, next) {
	// report = req.query.report_id;
	url = "https://login.microsoftonline.com/common/oauth2/token",
		//auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

		request.get({
			url: url, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData, method: 'POST' }, function (error, response, body) {
		if (error) {
			console.log(error);
		} else {
			// console.log(body);
			token = (JSON.parse(body)).access_token;
			//console.log("Token =" + token);
			result2 = GetReportDetails(function (Result, err) {
				if (Result !== '') {
					//console.log("Result: " + Result);
					res.header("access-control-allow-origin", "*");
					 res.send(Result);
				} else {
					console.log("Error from function 1");
				}
			});

		}
	}
	);

}

exports.vital = vital;

function GetReportDetails(callback) {

	url = "https://api.powerbi.com/v1.0/myorg/groups/965da5f7-7aa2-416d-8f07-d8cc12b34998/reports",
		request.get({ url: url, headers: { "Authorization": 'Bearer'+' '+token } }, function (error, response, body) {
			if (error) {
				console.log(error);
			} else {

				ResultArr = [];
				ResultArr.push((JSON.parse(body)).value[0].id);
				ResultArr.push((JSON.parse(body)).value[0].embedUrl);

				GetEmbedToken(ResultArr,
					function (Result, err) {
						if (Result != '') {
						//	console.log("Array Result: " + Result);
							callback(Result, false);
						} else {
							console.log("Error from function GetReportDetails");
						}
					});
			}
		}
		);

}
exports.GetReportDetails = GetReportDetails;

function GetEmbedToken(obj, callback1) {

	var form2 = {
		accessLevel: 'View',
		allowSaveAs: 'false',
	};

	var formData2 = querystring.stringify(form2);

	url = "https://api.powerbi.com/v1.0/myorg/groups/965da5f7-7aa2-416d-8f07-d8cc12b34998/reports/1ba63214-18c6-43a4-ac8e-b166f53ca2ad/GenerateToken";
	request.post({
		url: url, headers: { "Authorization": 'Bearer' + ' ' + token, "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
		body: formData2, method: 'POST' }, function (error, response, body) {
			if (error) {
				console.log(error);
				callback(Result, true);
			} else {
				//console.log("--------------------------------------------------------------------------------------------");
				//console.log("I am  from getReportResult() ");
				ResultArr.push((JSON.parse(body)).token);
				
				callback1(ResultArr, false);
				}
		
	});


}

exports.GetEmbedToken = GetEmbedToken;









