'use strict';
var express = require('express');
var router = express.Router();
var config = require('../config');
var schedule = require('node-schedule');
var AWS = require("aws-sdk");

/*------orchestration-----*/
var orconfig = require('../alibaba_orch_config');

var orchestrationController = require('../Controller/Orchestration/orchestrationCntrl');
/*------orchestration end-----*/

/*-------------------Prediction ------------------*/
var Prediction_1 = require('../Controller/PredictionController/prediction');

/*---------Alibaba Shedular-----*/


//var alibaba_billing_data = require('../Controller/Schedulers/alibaba_data_scheduler');

//var alibaba_scheduler = schedule.scheduleJob('*/30 * * * *', function () {
//   //var alibaba_scheduler = schedule.scheduleJob('35 12 * * *', function () {
//    alibaba_billing_data.getAlibabadata();
// });

//var alibaba_credential = require('../Controller/Schedulers/alibabaCrediantial');
//var alibaba_scheduler1 = schedule.scheduleJob('*/5 * * * *', function () {
//    alibaba_credential.getAlibabadata1();
// });


/*---------Alibaba Shedular-----*/

/*---------Azure Shedular---*/

// var testazuree = require('../Controller/Schedulers/azure_data_scheduler');

//var azureee_data_sheduler = schedule.scheduleJob('1 */4 * * *', function () {
//var azureee_data_sheduler = schedule.scheduleJob('52 19 * * *', function () {
//  testazuree.getAzureedata();
//});

/*---------Azure Shedular End---*/




/*----- Migration Studio ------*/
var migrationJobController = require('../Controller/MigrationStudioControllers/MigrationJobDetails-Controller');
var scheduleMigrationController = require('../Controller/MigrationStudioControllers/ScheduleMigrationDetails-Controller');
var notificationController = require('../Controller/MigrationStudioControllers/Notification-Controller');
var CredentialsVMController = require('../Controller/MigrationStudioControllers/CredentialsVM-Controller');
var migrationController = require('../Controller/MigrationStudioControllers/migration-studio-controller');
var infrastructureMigrationController = require('../Controller/MigrationStudioControllers/InfrastructureMigration-Controller');
var v2vMigrationController = require('../Controller/MigrationStudioControllers/V2VMigration-Controller');

/*----- Migration Studio End -----*/

/*---------------Cloud Container API -------*/
var cloudContainerCluster = require('../Controller/CloudContainerController/CloudCluster');
/*---------------Cloud Container API End Here -------*/



/*-------------------Monitoring ------------------*/
var MonitoringController = require('../Controller/Monitoring/Monitoringdetails');

/*----- Monitoring End -----*/

/*------- Cloud Monitoring Reports --------*/
//var AnnualProjectedController = require('../Controller/CloudMonitoringControllers/AnnualProjectedCostbyService');
var CBMIQCostAnalysisReportController = require('../Controller/CloudMonitoringControllers/CBMIQCostAnalysisReport');
var AnnualProjectedController = require('../Controller/CloudMonitoringControllers/AnnualProjectedCostbyService');
var ResourceUsagebyCloudProviderController = require('../Controller/CloudMonitoringControllers/ResourceUsagebyCloudProvider');
var CBMIQCostVsBudgetOverTimeReportController = require('../Controller/CloudMonitoringControllers/CBMIQCostVsBudgetOverTime');
var CBMIQActualCostOverTimeReportController = require('../Controller/CloudMonitoringControllers/CBMIQActualCostOverTime');
var ResourceUsageOverTimeController = require('../Controller/CloudMonitoringControllers/ResourceUsageOverTime');
var InstanceTypeMapping = require('../Controller/CloudMonitoringControllers/InstanceTypeMapping');
var PortabilityCostAnalysis = require('../Controller/CloudMonitoringControllers/PortabilityCostAnalysis');
var PredictiveAnalysis = require('../Controller/CloudMonitoringControllers/PredictiveAnalysis');
var budgetmanagementcontroller = require('../Controller/CloudMonitoringControllers/Budgetmanagement');
/*----- Cloud Monitoring Reports End  ----------*/

/*----------- Billing ----------*/
var BillingCostController = require('../Controller/CloudBilling/billingCostReport');
var BillingFiltterController = require('../Controller/CloudBilling/billingFiltter');
var BillingInvoiceController = require('../Controller/CloudBilling/billingInvoiceReport');
/*----------- Billing End ----------*/
/*----------- Billing (V2)----------*/
var BillingFiltterListController_v2 = require('../Controller/CloudBilling/FiltersList.js');
var BillingAwsNw_v2 = require('../Controller/CloudBilling/topologyFunction.js');
var CostTrendingController = require('../Controller/CloudBilling/costTrendingBilling');
var getinvoicedetailscontroller = require('../Controller/CloudBilling/Invoice.js');
/*----------- Billing End ----------*/
/*-----------Credentials----------*/
var CBCredentialController = require('../Controller/Credentials/CBCredential-Controller');
/*--------Credentials End--------------*/

/*------------------ Cloud Compare ----------------------*/
var CloudCompareController = require('../Controller/CloudCompareControllers/CloudCompare-Controller');
// Services JSON for service mapping (Cloud Compare - Service)

var ServicesController = require('../Controller/CloudCompareControllers/Services-Controller.js');
/*-------------------End Cloud Compare ------------------*/

var DashboardController = require('../Controller/Dashboard/Dashboard-Controller');

router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

/*-------------------Disaster Recovery ------------------*/
var DRNotificationController = require('../Controller/DisasterRecovery/DRNotification');
var DRDatabaseController = require('../Controller/DisasterRecovery/DRDatabase');
var DRTopologyController = require('../Controller/DisasterRecovery/DRTopology');

/*-------------------Cloud Compare New ------------------*/
var CloudCompareController = require('../Controller/CloudCompareControllerNew/Global-Controller');
var CloudCompareController1 = require('../Controller/CloudCompareControllerNew/Compare-Controller');
var CloudCompareNetworkController = require('../Controller/CloudCompareControllerNew/Network-Controller');
/*-------------------Email Schedular  ------------------*/

var emailschedularbudget = require('../Controller/CloudMonitoringControllers/emailschedular');
var aws_data_scheduler = require('../Controller/Schedulers/Aws_data_Schedulers');
var aws_vm_scheduler = require('../Controller/Schedulers/Aws_vm_schedulers');
var aws_stg_scheduler = require('../Controller/Schedulers/Aws_storage_schedulers');
var aws_updateaccount_scheduler = require('../Controller/Schedulers/Aws_update');

/*-------------------New Dashboard graphs  ------------------*/
var DashboardGraph_controller = require('../Controller/DashboardControllerNew/Dashboard');
var DashboardDatabaseForm_controller = require('../Controller/DashboardControllerNew/DatabaseForm');


//scheduler code 
scheduler();
function scheduler() {
    //Schedular
    console.log("INdex");
    var next = null
    var req = null
    var res = null
    scheduleMigrationController.getScheduledJobDetailsD2C(req, res, next, function (schedule_id, token, source_details, dest_details, schedule_date, user_id, err) {
        if (!err) {
            //jobid
            console.log("job");
            console.log(token);
            scheduleMigrationController.jobIdCreationD2C(req, res, next, schedule_id, token, source_details, dest_details, function (body, dbType, err) {
                if (!err) {
                    console.log("!error");
                    console.log(body);
                    //updatedetails call
                    scheduleMigrationController.migrationAllDnDJobDetailsD2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, body.job_id, dbType, function (body1, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(body1);

                            scheduleMigrationController.updateCompleteSuccessStatusD2C(req, res, next, schedule_id, function (error_response, err) {
                                if (!err) {
                                    console.log("!error");
                                    console.log(error_response);
                                    //done
                                }
                                else {
                                    console.log("error");
                                    console.log(error_response);
                                    //done
                                }
                            });
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(body1);
                            //done
                        }
                    });
                }
                else {
                    console.log("error");
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                }
            });
        }
        else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            });
        }
    });
    scheduleMigrationController.getScheduledJobDetailsV2C(req, res, next, function (schedule_id, token, source_details, dest_details, schedule_date, user_id, err) {
        if (!err) {
            //jobid
            console.log("job");
            console.log("Token in callback" + token);
            scheduleMigrationController.jobIdCreation_V2C(req, res, next, schedule_id, token, source_details, dest_details, function (body, err) {
                if (!err) {
                    console.log("!error");
                    console.log(body);
                    //updatedetails call
                    // scheduleMigrationController.migrationAllDnDJobDetails_V2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, body.job_id, function (body1, err) {
                    //     if (!err) {
                    console.log("!error");
                    scheduleMigrationController.updateCompleteSuccessStatusV2C(req, res, next, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                    //done
                    //     }
                    //     else {
                    //         console.log("error");
                    //         console.log(body1);
                    //         //done
                    //     }
                    // });
                }
                else {
                    console.log("error");
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                }
            });
        }
        else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            })
        }
    });
    scheduleMigrationController.getScheduledJobDetailsC2C(req, res, next, function (is_rsync, schedule_id, token, source_details, dest_details, schedule_date, user_id, security_group, vswitch_id, topology_name, create_instance, err) {
        if (!err) {
            console.log("job");
            console.log("Token in callback" + token);
            scheduleMigrationController.get_vm_power_state(req, res, next, is_rsync, source_details, function (power_state_on, body, err) {
                console.log("power_state_on in callback", power_state_on)
                if (!err && power_state_on == true) {
                    console.log("Body in callback", body)
                    scheduleMigrationController.jobIdCreation_C2C(req, res, next, is_rsync, schedule_id, token, source_details, dest_details, security_group, vswitch_id, user_id, function (body, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(body);
                            scheduleMigrationController.migrationAllDnDJobDetails_C2C(req, res, next, schedule_id, token, source_details, dest_details, schedule_date, user_id, body.job_id, topology_name, function (body1, err) {
                                if (!err) {
                                    console.log("!error");
                                    console.log(body1);
                                    scheduleMigrationController.updateCompleteSuccessStatusC2C(req, res, next, schedule_id, function (error_response, err) {
                                        if (!err) {
                                            console.log("!error");
                                            console.log(error_response);
                                            //done
                                        }
                                        else {
                                            console.log("error");
                                            console.log(error_response);
                                            //done
                                        }
                                    });
                                    //done
                                }
                                else {
                                    console.log("error");
                                    console.log(err);
                                }
                            });
                        }
                        else if (body == "" || err) {
                            console.log("error");
                            console.log(body);
                            scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                                if (!err) {
                                    console.log("!error");
                                    console.log(error_response);
                                    //done
                                }
                                else {
                                    console.log("error");
                                    console.log(error_response);
                                }
                            })//done
                        }
                    });
                }
                else {
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                        }
                    })
                }
            });
        } else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            })
        }
    });
    scheduleMigrationController.getScheduledJobDetailsV2V(req, res, next, function (schedule_id, token, source_details, dest_details, schedule_date, user_id, err) {
        if (!err) {
            //jobid
            console.log("job");
            console.log("Token in callback" + token);
            scheduleMigrationController.jobIdCreation_V2V(req, res, next, schedule_id, token, source_details, dest_details, function (body, err) {
                if (!err) {
                    console.log("!error");
                    console.log(body);
                    //updatedetails call                  

                    console.log("!error");
                    scheduleMigrationController.updateCompleteSuccessStatusV2V(req, res, next, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                    //done    
                }
                else {
                    console.log("error");
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                }
            });
        }
        else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            })
        }
    });

    scheduleMigrationController.getScheduledJobDetailsS2C(req, res, next, function (schedule_id, token, source_details, dest_details, schedule_date, user_id, err) {
        if (!err) {
            //jobid
            console.log("job");
            console.log("Token in callback" + token);
            scheduleMigrationController.jobIdCreation_S2C(req, res, next, schedule_id, token, source_details, dest_details, function (body, err) {
                if (!err) {
                    console.log("!error");
                    console.log(body);
                    //updatedetails call                  

                    console.log("!error");
                    scheduleMigrationController.updateCompleteSuccessStatusS2C(req, res, next, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                    //done    
                }
                else {
                    console.log("error");
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                }
            });
        }
        else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            })
        }
    });
    scheduleMigrationController.getScheduledJobDetailsP2C(req, res, next, function (schedule_id, token, source_details, dest_details, schedule_date, user_id, err) {
        if (!err) {
            //jobid
            console.log("job");
            console.log("Token in callback" + token);
            scheduleMigrationController.jobIdCreation_P2C(req, res, next, schedule_id, token, source_details, dest_details, function (body, err) {
                if (!err) {
                    console.log("!error");
                    console.log(body);
                    //updatedetails call
                    console.log("!error");
                    scheduleMigrationController.updateCompleteSuccessStatusP2C(req, res, next, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                    //done                        
                }
                else {
                    console.log("error");
                    scheduleMigrationController.updateErrorMessageJobDetails(req, res, next, body, schedule_id, function (error_response, err) {
                        if (!err) {
                            console.log("!error");
                            console.log(error_response);
                            //done
                        }
                        else {
                            console.log("error");
                            console.log(error_response);
                            //done
                        }
                    });
                }
            });
        }
        else {
            scheduleMigrationController.updateErrorMessage(req, res, next, body, schedule_id, function (error_response, err) {
                if (!err) {
                    console.log("!error");
                    console.log(error_response);
                    //done
                }
                else {
                    console.log("error");
                    console.log(error_response);
                }
            })
        }
    });
}
//end schduler


/* ------ CLoud container API calling ----*/

router.post('/api/v1/getCluserDetails', (req, res, next) => {
    cloudContainerCluster.getClusterDeatils(req, res, next);
});

router.post('/api/v1/getPodsDetails', (req, res, next) => {
    cloudContainerCluster.getPodsDetails(req, res, next);
});

router.post('/api/v1/getNodesDetails', (req, res, next) => {
    cloudContainerCluster.getNodesDetails(req, res, next);
});

router.post('/api/v1/getServiceDetails', (req, res, next) => {
    cloudContainerCluster.getServiceDetails(req, res, next);
});

router.post('/api/v1/getRegionListAlibaba', (req, res, next) => {
    cloudContainerCluster.getRegionListAlibaba(req, res, next);
});

router.post('/api/v1/getVPCListAlibaba', (req, res, next) => {
    cloudContainerCluster.getVPCListAlibaba(req, res, next);
});

router.post('/api/v1/getNameSpaceDetails', (req, res, next) => {
    cloudContainerCluster.getNameSpaceDetails(req, res, next);
});

router.post('/api/v1/getDeployemntDetails', (req, res, next) => {
    cloudContainerCluster.getDeployemntDetails(req, res, next);
});

router.post('/api/v1/getSecretDetails', (req, res, next) => {
    cloudContainerCluster.getSecretDetails(req, res, next);
});

router.post('/api/v1/getInstanceListAlibaba', (req, res, next) => {
    cloudContainerCluster.getInstanceListAlibaba(req, res, next);
});

router.post('/api/v1/getKeyPairListAlibaba', (req, res, next) => {
    cloudContainerCluster.getKeyPairListAlibaba(req, res, next);
});

router.post('/api/v1/createClusterAlibaba', (req, res, next) => {
    cloudContainerCluster.createClusterAlibaba(req, res, next);
});
/* ------ CLoud container API calling End here ----*/

// Prediction router

router.post('/api/v1/testProcessed', (req, res, next) => {
    Prediction_1.get_prediction_data(req, res, next);
});

router.post('/api/v1/userBillingData', (req, res, next) => {
    Prediction_1.userDetailsBilling(req, res, next);
});


//new detail billing report


router.get('/api/v1/get_billing_detailReport_resources', (req, res, next) => {
    BillingCostController.getBillingDetails(req, res, next);
});

// new budget report

router.post('/api/v1/team', (req, res, next) => {
    budgetmanagementcontroller.cb_tree_data(req, res, next);
});

router.post('/api/v1/date', (req, res, next) => {
    budgetmanagementcontroller.cb_billingreport(req, res, next);
});

/* new Cost trnding*/
router.get('/api/v1/get_cloud_filter_details', (req, res, next) => {
    CostTrendingController.filterDetails(req, res, next);
});
router.get('/api/v1/get_cloud_table_data', (req, res, next) => {
    CostTrendingController.tablesData(req, res, next);
});
router.post('/api/v1/costTrendUser', (req, res, next) => {
    CostTrendingController.newfilterDetails(req, res, next);
});


/*---------  Migration Studio Start-----------*/
router.get('/api/v1/get_SrcDest', (req, res, next) => {
    migrationJobController.getSrcDest(req, res, next);
});
router.get('/api/v1/post_users_details', (req, res, next) => {
    migrationJobController.migrationUserDetails(req, res, next);
});
router.get('/api/v1/post_dnd_migration_all_job_details', (req, res, next) => {
    migrationJobController.migrationAllDnDJobDetails(req, res, next);
});
router.post('/api/v1/post_scheduled_job_details', (req, res, next) => {
    migrationJobController.migrationScheduledJobDetailsInfo(req, res, next);
});

router.get('/api/v1/get_credentials_and_vm_details_new', (req, res, next) => {
    CredentialsVMController.GetCredentialsAndVMDetailsNew(req, res, next);
});

router.get('/api/v1/get_src_ip_listS2C', (req, res, next) => {
    migrationJobController.migrationSrcIp_s2c(req, res, next);
});

router.get('/api/v1/s2c_input_details', (req, res, next) => {
    migrationJobController.s2c_input_details(req, res, next);
});

//token generation
router.post('/api/v1/get_token', (req, res, next) => {
    migrationJobController.create_token(req, res, next);
});
//get user_id
router.post('/api/v1/get_user_id', (req, res, next) => {
    migrationController.getUserId(req, res, next);
});
//get user_id and group id from username
router.post('/api/v1/get_cb_user_id', (req, res, next) => {
    migrationController.getUserIdFromUsername(req, res, next);
});


//V2C and D2C dropdown and popup functions
router.get('/api/v1/get_dest_list_data', (req, res, next) => {
    migrationJobController.migrationDestList(req, res, next);
});
router.get('/api/v1/get_src_ip_list', (req, res, next) => {
    migrationJobController.migrationSrcIp(req, res, next);
});
router.get('/api/v1/get_src_ip_list_v2c', (req, res, next) => {
    migrationJobController.migrationSrcIp_v2c(req, res, next);
});
router.get('/api/v1/get_dest_detail_data', (req, res, next) => {
    migrationJobController.migrationDestDetailsData(req, res, next);
});
router.get('/api/v1/get_src_host_list', (req, res, next) => {
    migrationJobController.migrationSrcHostdetails(req, res, next);
});
router.get('/api/v1/get_src_host_listVM', (req, res, next) => {
    migrationJobController.migrationSrcHostdetailsVM(req, res, next);
});
router.get('/api/v1/post_src_details', (req, res, next) => {
    migrationJobController.migrationSrcDetails(req, res, next);
});
router.get('/api/v1/post_dest_details', (req, res, next) => {
    migrationJobController.migrationDestDetails(req, res, next);
});
router.get('/api/v1/get_dest_ip_list', (req, res, next) => {
    migrationJobController.migrationDestIp(req, res, next);
});
router.get('/api/v1/get_dest_ip_details', (req, res, next) => {
    migrationJobController.migrationDestIpDetails(req, res, next);
});
router.get('/api/v1/get_host_exist', (req, res, next) => {
    migrationJobController.toCheckExistHost(req, res, next);
})
router.get('/api/v1/get_host_existDest', (req, res, next) => {
    migrationJobController.toCheckExistHostInDest(req, res, next);
})
router.get('/api/v1/get_migrationName_existDest', (req, res, next) => {
    migrationJobController.toCheckExistMigrationInDest(req, res, next);
})
router.get('/api/v1/migration_details_for_edit_and_delete', (req, res, next) => {
    migrationJobController.get_migration_details_for_edit_and_delete(req, res, next);
});

// Notification
router.get('/api/v1/get_schedule_job_details', (req, res, next) => {
    notificationController.ScheduledNotifications(req, res, next);
});
router.get('/api/v1/get_user_migration_job_details', (req, res, next) => {
    notificationController.userMigrationJobDetails(req, res, next);
});
router.get('/api/v1/update_user_migration_all_job_details', (req, res, next) => {
    notificationController.updateuserMigrationallJobDetails(req, res, next);
});
router.get('/api/v1/get_user_migration_all_job_details', (req, res, next) => {
    notificationController.userMigrationallJobDetails(req, res, next);
});

//New api for migration studio
router.post('/api/v1/c2c_ssh_key_operations', (req, res, next) => {
    migrationController.c2cSSHKeyOperations(req, res, next);
});
router.post('/api/v1/fetch_source_and_destination_migration_platforms', (req, res, next) => {
    migrationController.fetch_source_and_destination_migration_platforms(req, res, next);
});
router.post('/api/v1/delete_scheduled_migration', (req, res, next) => {
    migrationController.delete_scheduled_migration(req, res, next);
});
router.post('/api/v1/get_details_for_inprogress_migration', (req, res, next) => {
    migrationController.getDetailsOfInProgressMigration(req, res, next);
});
router.post('/api/v1/check_account_name_exists', (req, res, next) => {
    migrationController.checkAccountNameExists(req, res, next);
});
router.post('/api/v1/check_scheduled_migration_before_edit_delete', (req, res, next) => {
    migrationController.checkScheduledMigrationBeforeEditDelete(req, res, next);
});
router.post('/api/v1/select_add_edit_delete_migration_accounts', (req, res, next) => {
    migrationController.selectAddEditDeleteMigrationAccounts(req, res, next);
});
router.post('/api/v1/get_aws_system_disk_size', (req, res, next) => {
    migrationController.getAWSSystemDiskSize(req, res, next);
});
router.post('/api/v1/aws_to_otc', (req, res, next) => {
    migrationController.awsToOTCMigration(req, res, next);
});
router.post('/api/v1/ssh_key_operations_old', (req, res, next) => {
    migrationController.SSHKeyOperationsOld(req, res, next);
});
router.post('/api/v1/azure_to_otc', (req, res, next) => {
    migrationController.azureToOTCMigration(req, res, next);
});
router.post('/api/v1/otc_credentials_authentication', (req, res, next) => {
    migrationController.AuthenticationOTC(req, res, next);
});
router.post('/api/v1/get_otc_instance_type_list', (req, res, next) => {
    migrationController.getInstanceTypeListOTC(req, res, next);
});
router.post('/api/v1/get_credentials_for_destination', (req, res, next) => {
    CredentialsVMController.GetCredentialsForDestination(req, res, next);
});
router.post('/api/v1/get_notification_data_for_selected_migration_type', (req, res, next) => {
    migrationController.get_notification_data_for_selected_migration_type(req, res, next);
});
router.post('/api/v1/get_in_progress_migration_count', (req, res, next) => {
    migrationController.get_in_progress_migration_count(req, res, next);
});
router.get('/api/v1/get_source_account_details', (req, res, next) => {
    migrationJobController.getSourceAccountDetails(req, res, next);
});
router.get('/api/v1/get_destination_account_details', (req, res, next) => {
    migrationJobController.getDestinationAccountDetails(req, res, next);
});
router.post('/api/v1/get_all_migration_details_of_user', (req, res, next) => {
    migrationController.get_migration_details_of_user(req, res, next);
});
router.post('/api/v1/abort_s2c_migration', (req, res, next) => {
    migrationController.abortS2CMigration(req, res, next);
});
router.post('/api/v1/validate_d2c_credentials', (req, res, next) => {
    migrationController.validateD2CCredentials(req, res, next);
});
router.post('/api/v1/v2v_validate_credentials', (req, res, next) => {
    v2vMigrationController.ValidateV2VCredentials(req, res, next);
});
router.post('/api/v1/get_migration_logs', (req, res, next) => {
    migrationController.getMigrationLogs(req, res, next);
});
router.post('/api/v1/get_s2c_logs', (req, res, next) => {
    migrationController.getS2CLogs(req, res, next);
});
router.post('/api/v1/user_login_logs', (req, res, next) => {
    migrationController.user_login_logs(req, res, next);
});
router.post('/api/v1/create_s2c_bucket', (req, res, next) => {
    migrationController.createS2CBucket(req, res, next);
})
router.post('/api/v1/get_cloud_region_mapping', (req, res, next) => {
    migrationController.getCloudRegionMapping(req, res, next);
});
router.post('/api/v1/get_SSH_key', (req, res, next) => {
    migrationController.getSSHKey(req, res, next);
});
router.post('/api/v1/ssh_key_operations', (req, res, next) => {
    migrationController.SSHKeyOperations(req, res, next);
});
router.post('/api/v1/validate_azure_parameters', (req, res, next) => {
    migrationController.validateAzureParameters(req, res, next);
});
router.post('/api/v1/list_p2c_vms', (req, res, next) => {
    migrationController.listP2CVMs(req, res, next);
});
router.post('/api/v1/start_p2c_migration', (req, res, next) => {
    migrationController.startP2CMigration(req, res, next);
});
router.post('/api/v1/authenticate_lan_vms', (req, res, next) => {
    migrationController.authenticateP2CVMs(req, res, next);
});
router.post('/api/v1/list_p2c_on_premise_vms', (req, res, next) => {
    migrationController.listP2COnPremiseVMs(req, res, next);
});;

router.get('/api/v1/get_credentials_and_vm_details_appln_disc', (req, res, next) => {
    CredentialsVMController.GetCredentialsAndVMDetailsApplnDisc(req, res, next);
});

router.post('/api/v1/get_aapln_details_for_appln_disc', (req, res, next) => {
    CredentialsVMController.GetAppDetailsforApplnDisc(req, res, next);
});
router.post('/api/v1/check_permission_of_azure_resour_grp', (req, res, next) => {
    CredentialsVMController.Check_azure_reso_grp_permission(req, res, next);
});

router.post('/api/v1/to_get_azure_VM_username', (req, res, next) => {
    CredentialsVMController.get_azure_username(req, res, next);
});
router.post('/api/v1/to_get_google_instance_info', (req, res, next) => {
    CredentialsVMController.get_google_instance_info(req, res, next);
});

router.post('/api/v1/list_inprogress_migrations_c2c', (req, res, next) => {
    migrationController.listInprogressMigrationsC2C(req, res, next);
});

router.post('/api/v1/get_bucket_list', (req, res, next) => {
    migrationController.listS2CBuckets(req, res, next);
});
router.post('/api/v1/start_s2c_migration', (req, res, next) => {
    migrationController.startS2CMigration(req, res, next);
});
router.post('/api/v1/add_s2c_input_details', (req, res, next) => {
    migrationController.addS2CInputDetails(req, res, next);
});
router.post('/api/v1/get_db_list_version', (req, res, next) => {
    migrationController.listD2CDatabases(req, res, next);
});
router.post('/api/v1/get_db_list_version_new', (req, res, next) => {
    migrationController.listD2CDatabasesNew(req, res, next);
});
router.post('/api/v1/get_host_names', (req, res, next) => {
    migrationController.migrationHostNames(req, res, next);
});
router.post('/api/v1/start_d2c_migration', (req, res, next) => {
    migrationController.startD2CMigration(req, res, next);
});
router.post('/api/v1/add_src_details', (req, res, next) => {
    migrationController.addMigrationSrcDetails(req, res, next);
});
router.post('/api/v1/add_dest_details', (req, res, next) => {
    migrationController.addMigrationDestDetails(req, res, next);
});
router.post('/api/v1/list_v2c_vms', (req, res, next) => {
    migrationController.listV2CVMs(req, res, next);
});
router.post('/api/v1/create_network', (req, res, next) => {
    migrationController.createNetwork(req, res, next);
});
router.post('/api/v1/get_gcp_data', (req, res, next) => {
    migrationController.getGcpData(req, res, next);
});
router.post('/api/v1/aws_instance_info', (req, res, next) => {
    migrationController.AWSInstanceInfo(req, res, next);
});
router.post('/api/v1/check_azure_resource_group_permission', (req, res, next) => {
    migrationController.checkAzureResourceGroupPermission(req, res, next);
});
router.post('/api/v1/get_azure_info', (req, res, next) => {
    migrationController.getAzureInstanceInfo(req, res, next);
});
router.post('/api/v1/validate_c2c_data', (req, res, next) => {
    migrationController.ValidateC2CData(req, res, next);
});
router.post('/api/v1/physical_to_alibaba', (req, res, next) => {
    migrationController.fetchP2CMigrationDetails(req, res, next);
});
router.post('/api/v1/openstack_to_alibaba', (req, res, next) => {
    migrationController.openstackToAlibabaMigration(req, res, next);
});
router.post('/api/v1/gcp_to_alibaba', (req, res, next) => {
    migrationController.googleToAlibabaMigration(req, res, next);
});
router.post('/api/v1/azure_to_alibaba', (req, res, next) => {
    migrationController.azureToAlibabaMigration(req, res, next);
});
router.post('/api/v1/get_and_validate_regionsList', (req, res, next) => {
    migrationController.getRegionsAlibaba(req, res, next);
});
router.post('/api/v1/get_and_validate_zone', (req, res, next) => {
    migrationController.getZonesAlibaba(req, res, next);
});
router.post('/api/v1/get_and_validate_instanceType', (req, res, next) => {
    migrationController.getInstanceTypeAlibaba(req, res, next);
});
router.post('/api/v1/start_v2c_migration', (req, res, next) => {
    migrationController.startV2CMigration(req, res, next);
});
router.post('/api/v1/list_v2c_regions', (req, res, next) => {
    migrationController.listV2CRegions(req, res, next);
});

// ---------------------D2C diagnosis API---------------- //
router.post('/api/v1/get_ms_sql_diagnosis_details', (req, res, next) => {
    migrationController.get_ms_sql_diagnosis_data(req, res, next);
});

router.post('/api/v1/get_my_sql_diagnosis_details', (req, res, next) => {
    migrationController.get_my_sql_diagnosis_data(req, res, next);
});

router.post('/api/v1/get_postgres_sql_diagnosis_details', (req, res, next) => {
    migrationController.get_postgres_sql_diagnosis_data(req, res, next);
});

// ---------------------V2C diagnosis API---------------- //
router.post('/api/v1/get_xen_server_diagnosis_details', (req, res, next) => {
    migrationController.get_xen_server_diagnosis_data(req, res, next);
});

router.post('/api/v1/get_and_validate_v2c_alibaba_cred', (req, res, next) => {
    migrationController.ValidateV2CData(req, res, next);
});


router.post('/api/v1/get_and_validate_vpc', (req, res, next) => {
    migrationController.getVpcsAlibaba(req, res, next);
});

router.post('/api/v1/get_and_validate_security_group', (req, res, next) => {
    migrationController.getSecurityGroupAlibaba(req, res, next);
});

router.post('/api/v1/get_and_validate_vswitch', (req, res, next) => {
    migrationController.getVswitchesAlibaba(req, res, next);
});


// ---------------------C2C diagnosis API---------------- //
router.post('/api/v1/get_gcp_cloud_diagnosis_details', (req, res, next) => {
    migrationController.get_gcp_cloud_diagnosis_data(req, res, next);
});


router.post('/api/v1/get_openstack_cloud_diagnosis_details', (req, res, next) => {
    migrationController.get_openstack_cloud_diagnosis_data(req, res, next);
});


router.post('/api/v1/add_edit_src_details', (req, res, next) => {
    migrationController.get_put_edit_data_of_src(req, res, next);
});


router.post('/api/v1/add_edit_dest_details', (req, res, next) => {
    migrationController.get_put_edit_data_of_dest(req, res, next);
});


// To get credentials and VM details for Migration Studio

router.get('/api/v1/get_credentials_and_vm_details', (req, res, next) => {
    CredentialsVMController.GetCredentialsAndVMDetails(req, res, next);
});

// APIs for infrastructure migration
router.post('/api/v1/get_infrastructure_details', (req, res, next) => {
    infrastructureMigrationController.GetInfrastructureDetails(req, res, next);
});
router.post('/api/v1/get_cloud_account_details_for_infrastructure_migration', (req, res, next) => {
    infrastructureMigrationController.GetCloudAccountDetails(req, res, next);
});
router.post('/api/v1/refresh_cloud_infrastructure_details', (req, res, next) => {
    infrastructureMigrationController.RefreshCloudInfrastructureDetails(req, res, next);
});
router.post('/api/v1/start_cloud_infrastructure_migration', (req, res, next) => {
    infrastructureMigrationController.StartC2CInfrastructureMigrationtoAlibaba(req, res, next);
});
router.post('/api/v1/insert_instance_info', (req, res, next) => {
    infrastructureMigrationController.InsertVMDetails(req, res, next);
});

// APIs for V2V Migration
router.get('/api/v1/get_v2v_account_list', (req, res, next) => {
    v2vMigrationController.GetV2VAccountList(req, res, next);
});
router.post('/api/v1/add_v2v_input_details', (req, res, next) => {
    v2vMigrationController.addV2VInputDetails(req, res, next);
});
router.post('/api/v1/get_v2v_vm_list', (req, res, next) => {
    v2vMigrationController.listV2VVMs(req, res, next);
});
router.post('/api/v1/v2v_migration', (req, res, next) => {
    v2vMigrationController.v2vMigration(req, res, next);
});


/*---------------- Migration Studio End ---------------*/

/*-----   Cloud Monitoring Reports -------------*/

router.get('/api/v1/costanalysisreportcontroller', (req, res, next) => {

    CBMIQCostAnalysisReportController.CostAnalysisReportController(req, res, next);
});


router.get('/api/v1/costvsbudget_budget_details', (req, res, next) => {
    CBMIQCostVsBudgetOverTimeReportController.GetBudgetForReport(req, res, next);
});
router.get('/api/v1/notification_budget_details', (req, res, next) => {
    CBMIQCostVsBudgetOverTimeReportController.GetBudgetForNotification(req, res, next);
});

//costvsbudget cost
router.get('/api/v1/costvsbudget_cost_details', (req, res, next) => {
    CBMIQCostVsBudgetOverTimeReportController.GetTotalCost(req, res, next);
});
router.get('/api/v1/actualcostovertimereportcontroller', (req, res, next) => {

    CBMIQActualCostOverTimeReportController.ActualCostOverTimeReportController(req, res, next);
});
// Resource Usage by Cloud Provider  Report start
router.get('/api/v1/GetResourceUsageDataByCloud', (req, res, next) => {
    ResourceUsagebyCloudProviderController.GetCloudAccontDataReport(req, res, next);
});
router.get('/api/v1/get_cost_analysis_portability', (req, res, next) => {
    PortabilityCostAnalysis.get_cost_analysis_portability(req, res, next);
});
router.get('/api/v1/get_cost_analysis_portability', (req, res, next) => {
    PortabilityCostAnalysis.get_cost_analysis_portability(req, res, next);
});


router.get('/api/v1/get_cost_analysis_portability', (req, res, next) => {
    PortabilityCostAnalysis.get_cost_analysis_portability(req, res, next);
});

router.get('/api/v1/actualcostovertimereportcontroller', (req, res, next) => {

    CBMIQActualCostOverTimeReportController.ActualCostOverTimeReportController(req, res, next);
});

router.get('/api/v1/get_instance_type_mapping', (req, res, next) => {

    InstanceTypeMapping.getInstanceTypeMapping(req, res, next);
});

router.get('/api/v1/GetResourceUsageOverTime_Data', (req, res, next) => {
    ResourceUsageOverTimeController.GetReportData(req, res, next);
});

router.get('/api/v1/GetResourceUsageOverTime_Data_account', (req, res, next) => {
    ResourceUsageOverTimeController.GetReportData_account(req, res, next);
});

router.get('/api/v1/get_instance_cost_previousUsage', (req, res, next) => {
    PredictiveAnalysis.get_cost_previousUsage(req, res, next);
});

router.get('/api/v1/get_budget_details', (req, res, next) => {
    budgetmanagementcontroller.getbudgetdetailsbyentity(req, res, next);
});

router.get('/api/v1/save_budget_details', (req, res, next) => {
    budgetmanagementcontroller.InsertBudget(req, res, next);
});

router.get('/api/v1/getAccountName', (req, res, next) => {
    PredictiveAnalysis.getAccountName(req, res, next);
});

router.get('/api/v1/get_instanceDetails', (req, res, next) => {
    PredictiveAnalysis.getInstance_detail(req, res, next);
});

router.get('/api/v1/get_instance_region_Details', (req, res, next) => {
    PredictiveAnalysis.get_instance_region(req, res, next);
});

router.get('/api/v1/get_instance_cost_previousUsage', (req, res, next) => {
    PredictiveAnalysis.get_cost_previousUsage(req, res, next);
});

// Annual Projected Report start

router.get('/api/v1/get_annual_projectedReport_using_Account', (req, res, next) => {
    AnnualProjectedController.getAnnualProjectedReportUsingAccount(req, res, next);
});



/*----------- Cloud Monitoring Reports End -------------*/

/*------------ Billing report start ----------------------*/
router.get('/api/v1/billingInvoice_Report', (req, res, next) => {
    BillingInvoiceController.billingInvoiceReport(req, res, next);
});
router.get('/api/v1/billingFiltter', (req, res, next) => {
    BillingFiltterController.billingFillterForReport(req, res, next);
});
router.get('/api/v1/billingFiltternew', (req, res, next) => {
    BillingFiltterController.billingFillterForReport_new(req, res, next);
});
router.get('/api/v1/billingCostReport', (req, res, next) => {
    BillingCostController.billingCostAggReport(req, res, next);
});
/*  ------------------  Billing report end ---------------------*/

/*----------------------- Routes for Credentials----------------*/
router.get('/api/v1/store_cb_credentials', (req, res, next) => {
    CBCredentialController.InsertCredentials(req, res, next);
});

router.get('/api/v1/update_cb_credentials', (req, res, next) => {
    CBCredentialController.UpdateCredentials(req, res, next);
});
/*-----------------------End Routes for Credentials----------------*/


router.get('/api/v1/get_tenant_name', (req, res, next) => {
    CBCredentialController.GetTenantName(req, res, next);
});

/*-----------------------End Routes for GetTeanant----------------*/

/*-----------------------Routes for Cloud Compare------------------*/

router.get('/api/v1/azure_service', (req, res, next) => {
    CloudCompareController.GetAzureData(req, res, next);
});

router.get('/api/v1/cloudcompare/', (req, res, next) => {
    CloudCompareController.GetAwsData(req, res, next);
});

router.get('/api/v1/ComputeAWS', (req, res, next) => {
    CloudCompareController.GetAwsCompute(req, res, next);
});

// To Get Services Data for Mapping (Cloud Compare - Services)

router.get('/api/v1/get_services_json', (req, res, next) => {
    ServicesController.GetServicesData(req, res, next);
});
/*---------------------End Routes for Cloud Compare------------------*/


// Dashboard Provider count

router.get('/api/v1/get_dashboard_provider_count', (req, res, next) => {
    DashboardController.GetDashboardCount(req, res, next);
});
/*---------------------End Dashboard Provider count------------------*/


/*----------- Cmaas start ----------*/

var CmaasOverviewController = require('../Controller/CMAASControllers/CmaasOverviewController.js');
var CmaasAdminEnterQueController = require('../Controller/CMAASControllers/CmaasAdminEnterQueController.js');
var Azure_Performance = require('../Controller/CMAASControllers/Performance-Controller.js');
var cmassCredentialController = require('../Controller/CMAASControllers/CredentialsVM-Controller');

var cmassQueAnsController = require('../Controller/CMAASControllers/saveQueAnswers');

var cmassQueA = require('../Controller/CMAASControllers/saveQueA');

var clouddetails11 = require('../Controller/CMAASControllers/clouddetails1');

var clouddetails22 = require('../Controller/CMAASControllers/cloudsingledetails');

var overviewdetails = require('../Controller/CMAASControllers/saveoverview');

var tenantsdetails = require('../Controller/CMAASControllers/gettenantdetails');

var azure_security_det = require('../Controller/CMAASControllers/azure_security');

var azure_security_det1 = require('../Controller/CMAASControllers/azure_security1');

var azure_operations_performance1 = require('../Controller/CMAASControllers/operations_performance');
/*----------- Cmaas End ----------*/

// Billing V2 start

router.get('/api/v1/get_billing_fillter_list', (req, res, next) => {
    BillingFiltterListController_v2.getBillingFillterList(req, res, next);
});
// invoice report data using alibaba 
router.get('/api/v1/get_billing_fillter_list1', (req, res, next) => {
    BillingFiltterListController_v2.getBillingFillterList1(req, res, next);
});

router.get('/api/v1/get_aws_storage_topology', (req, res, next) => {
    BillingAwsNw_v2.getAwsStorageNetwork_billing(req, res, next);
});
router.get('/api/v1/get_aws_resource_cost', (req, res, next) => {
    BillingAwsNw_v2.getResourceCost_billing(req, res, next);
});
router.get('/api/v1/get_azure_topology', (req, res, next) => {
    BillingAwsNw_v2.getAzureTopology_billing(req, res, next);
});
router.get('/api/v1/get_azure_topology_storage', (req, res, next) => {
    BillingAwsNw_v2.getAzureTopology_billing_storage(req, res, next);
});
router.get('/api/v1/get_team_list_tco', (req, res, next) => {
    BillingFiltterListController_v2.billingFillterTeamList_tco(req, res, next);
});
router.get('/api/v1/get_acc_list_tco', (req, res, next) => {
    BillingFiltterListController_v2.billingFillterAccList_tco(req, res, next);
});
router.get('/api/v1/get_tco_cost', (req, res, next) => {
    BillingAwsNw_v2.getTco_billing(req, res, next);
});
router.get('/api/v1/costTrendingBill', (req, res, next) => {
    CostTrendingController.costTrendingBill(req, res, next);
});
router.get('/api/v1/get_invoice_details', (req, res, next) => {

    getinvoicedetailscontroller.getinvoicedetails(req, res, next);
});
router.get('/api/v1/get_billing_detailReport_fillter_list', (req, res, next) => {
    BillingFiltterListController_v2.getBillFillter_detailReport_List(req, res, next);
});

router.get('/api/v1/get_billing_detailReport_Usage', (req, res, next) => {
    BillingFiltterListController_v2.getBillUsage_detailReport(req, res, next);
});


//End of Billing V2
/*--------------------Disaster Recovery-----------------*/
//Notifcation Page
router.post('/api/response/token_fetch', (req, res, next) => {
    DRNotificationController.token_generate_using_sp(req, res, next);
});
router.post('/api/response/notification_page', (req, res, next) => {
    DRNotificationController.notification_page_updates(req, res, next);
});
//Database Page
router.get('/api/v1/put_db_account_info', (req, res, next) => {
    DRDatabaseController.putAccount(req, res, next);
});
router.get('/api/v1/get_initial_account_info', (req, res, next) => {
    DRDatabaseController.get_initial_Account(req, res, next);
});
router.get('/api/v1/get_db_account_info', (req, res, next) => {
    DRDatabaseController.getAccount(req, res, next);
});
router.get('/api/v1/delete_db_account_info', (req, res, next) => {
    DRDatabaseController.delete_Account(req, res, next);
});
router.post('/api/v1/replication', (req, res, next) => {
    DRDatabaseController.replicate_details(req, res, next);
});
router.post('/api/v1/token_fetch', (req, res, next) => {
    DRDatabaseController.token_generate_using_sp(req, res, next);
});
router.get('/api/v1/get_db_notification_info', (req, res, next) => {
    DRDatabaseController.get_notification(req, res, next);
});
router.post('/api/v1/database_validate', (req, res, next) => {
    DRDatabaseController.database_validation(req, res, next);
});

//Topology Page
router.post('/api/response/vpclistcall', (req, res, next) => {
    DRTopologyController.vpcList(req, res, next);
});
router.post('/api/response/vpcdetailscall', (req, res, next) => {
    DRTopologyController.vpcDetails(req, res, next);
});
router.post('/api/response/vpcreplicatecall', (req, res, next) => {
    DRTopologyController.replication(req, res, next);
});
router.post('/api/response/token_fetch', (req, res, next) => {
    DRTopologyController.token_generate_using_sp(req, res, next);
});
router.post('/api/response/notifications', (req, res, next) => {
    DRTopologyController.notification_process_using_sp(req, res, next);
});
router.get('/api/response/put_topology_account_info', (req, res, next) => {
    DRTopologyController.putTopologyAccount(req, res, next);
});
router.get('/api/response/get_topology_account_info', (req, res, next) => {
    DRTopologyController.getTopologyAccount(req, res, next);
});
router.get('/api/response/delete_topology_account_info', (req, res, next) => {
    DRTopologyController.delete_topology_Account(req, res, next);
});
router.get('/api/response/get_initial_account_info', (req, res, next) => {
    DRTopologyController.get_initial_Account(req, res, next);
});

router.post('/api/response/template', (req, res, next) => {
    DRTopologyController.templatefunc(req, res, next);
});

//Monitoring

router.post('/api/v1/monitoring/get_provider_info', (req, res, next) => {
    MonitoringController.providerlistformonitoring(req, res, next);
});

router.post('/api/v1/monitoring/get_monitoring_info', (req, res, next) => {
    MonitoringController.providermonitoringlist(req, res, next);
});

router.post('/api/v1/monitoring/addprovider', (req, res, next) => {
    MonitoringController.addProvider(req, res, next);
});

router.post('/api/v1/monitoring/removeprovider', (req, res, next) => {
    MonitoringController.removeProvider(req, res, next);
});

router.post('/api/v1/monitoring/removestack', (req, res, next) => {
    MonitoringController.removeStack(req, res, next);
});

router.post('/api/v1/monitoring/token_fetch', (req, res, next) => {
    MonitoringController.generatetoken(req, res, next);
});

//CMAAS

router.get('/api/v1/put_cloudname', (req, res, next) => {

    CmaasAdminEnterQueController.getsinglecloud(req, res, next);
});
router.get('/api/v1/get_user_list', (req, res, next) => {

    CmaasOverviewController.cmaasUserList(req, res, next);
});
router.get('/api/v1/get_user_id', (req, res, next) => {

    CmaasOverviewController.cmaasUserid(req, res, next);
});
router.get('/api/v1/get_overview_details', (req, res, next) => {

    CmaasOverviewController.cmaasOverview(req, res, next);
});

router.get('/api/v1/get_overview_progress_details', (req, res, next) => {

    CmaasOverviewController.cmaasOverviewProgress(req, res, next);
});
router.get('/api/v1/get_overview_delete', (req, res, next) => {

    CmaasOverviewController.cmaasOverviewDelete(req, res, next);
});
router.get('/api/v1/post_admin_enter_que', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasEnterQue(req, res, next);
});
router.get('/api/v1/post_admin_enter_sec', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasEnterSection(req, res, next);
});
router.get('/api/v1/post_admin_secList', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasSectionList(req, res, next);
});
router.get('/api/v1/post_admin_viewall', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasViewAll(req, res, next);
});
router.get('/api/v1/post_admin_edit_que', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasEdit(req, res, next);
});
router.get('/api/v1/admin_delete_que', (req, res, next) => {

    CmaasAdminEnterQueController.cmaasDelete(req, res, next);
});
router.get('/api/v1/get_cloud_list', (req, res, next) => {

    CmaasOverviewController.cmaasDashboardCloudList(req, res, next);
});
router.get('/api/v1/get_existing_list', (req, res, next) => {

    CmaasOverviewController.cmaasDashboardExistingList(req, res, next);
});

router.get('/api/v1/post_survey_name', (req, res, next) => {

    CmaasOverviewController.cmaasSurvey(req, res, next);
});

router.get('/api/v1/get_vms_appn_details', (req, res, next) => {

    CmaasOverviewController.cmaasGetVmsAppnDetails(req, res, next);
});
router.get('/api/v1/get_vms_operations_monitoring', (req, res, next) => {

    CmaasOverviewController.cmaasGetOperations(req, res, next);
});
router.get('/api/v1/get_cmaas_performance', (req, res, next) => {

    Azure_Performance.get_performance(req, res, next);
});

router.post('/api/v1/save_QueAns', (req, res, next) => {
    cmassQueAnsController.saveAnswers(req, res, next);
});

router.post('/api/v1/get_QueAns', (req, res, next) => {
    cmassQueAnsController.getQueAnswers(req, res, next);
});

router.get('/api/v1/get_user_id', (req, res, next) => {
    cmassQueAnsController.get_loggedin_user_id(req, res, next);
});

router.get('/api/v1/getSurvey', (req, res, next) => {
    cmassQueAnsController.getSurveyName(req, res, next);
});

// To get credentials and VM details for Migration Studio
router.get('/api/v1/get_credentials_and_vm_details', (req, res, next) => {
    cmassCredentialController.GetCredentialsAndVMDetails(req, res, next);
});

/*end of sneha mam routes*/



router.post('/api/v1/save_QueAns', (req, res, next) => {
    cmassQueAnsController.saveAnswers(req, res, next);
});

router.post('/api/v1/get_QueAns', (req, res, next) => {
    cmassQueAnsController.getQueAnswers(req, res, next);
});


router.post('/api/v1/import_que', (req, res, next) => {
    cmassQueA.importa(req, res, next);
});


router.get('/api/v1/import_cloud', (req, res, next) => {
    clouddetails11.getcloud(req, res, next);
});

router.post('/api/v1/import_singlecloud', (req, res, next) => {
    clouddetails22.getsinglecloud(req, res, next);
});

router.post('/api/v1/import_survey', (req, res, next) => {
    overviewdetails.putoverview(req, res, next);
});

router.get('/api/v1/gettingtenants', (req, res, next) => {
    tenantsdetails.getenant(req, res, next);
});

router.get('/api/v1/get_sec_detail', (req, res, next) => {
    azure_security_det.get_security_groups(req, res, next);
});

router.get('/api/v1/get_sec_detail1', (req, res, next) => {
    azure_security_det1.get_security_groups1(req, res, next);
});


router.get('/api/v1/get_operations_and_per_details', (req, res, next) => {
    azure_operations_performance1.get_ope_per(req, res, next);
});

router.get('/api/v1/get_operations_and_per_details1', (req, res, next) => {
    azure_operations_performance2.get_ope_per1(req, res, next);
});


/*-------------------Cloud Compare New ------------------*/

router.post('/api/v1/getData', (req, res, next) => {
    CloudCompareController.globalFunction(req, res, next);
});

router.post('/api/v1/insertexcel', (req, res, next) => {
    CloudCompareController1.insertexcel(req, res, next);
    // res.send("hello")
});


/*---------- compute --------------*/
router.post('/api/v1/getPriceData', (req, res, next) => {
    CloudCompareController.globalFunction(req, res, next);
});

router.post('/api/v1/getDiskPriceData', (req, res, next) => {
    CloudCompareController.globalFunction(req, res, next);
});
/*---------- storage --------------*/
router.post('/api/v1/getstorage_cost', (req, res, next) => {
    CloudCompareController.globalFunction(req, res, next);
});
/*---------- network --------------*/
router.post('/api/v1/getDestNetworkPriceData', (req, res, next) => {
    CloudCompareNetworkController.getDestNetworkData(req, res, next);
});
/*---------- document --------------*/
router.post('/api/v1/get_doc', (req, res, next) => {
    CloudCompareController.globalFunction(req, res, next);
});
//onPremises
router.post('/api/v1/comp_users', (req, res, next) => {
    CloudCompareController.comp_onprem_user(req, res, next);
});

router.post('/api/v1/insert_excel_name', (req, res, next) => {
    CloudCompareController.onprem_excel_insert(req, res, next);
});

router.post('/api/v1/getDataonprem', (req, res, next) => {
    CloudCompareController.onpremgetDatauser(req, res, next);
});

router.post('/api/v1/onprem_user_table', (req, res, next) => {
    CloudCompareController.onpremusertable(req, res, next);
});



/*------- End routes for Cloud Compare --------*/


// Prediction router

router.post('/api/v1/testProcessed', (req, res, next) => {
    Prediction_1.get_prediction_data(req, res, next);
});

router.post('/api/v1/userBillingData', (req, res, next) => {
    Prediction_1.userDetailsBilling(req, res, next);
});



/*-------orchestration----*/

router.post('/api/v1/aliacct', (req, res, next) => {
    orchestrationController.orch_ali(req, res, next);
});
router.post('/api/v1/alistatus', (req, res, next) => {
    orchestrationController.orch_details(req, res, next);
});
router.post('/api/v1/validate', (req, res, next) => {
    orchestrationController.orch_validate(req, res, next);
});
router.post('/api/v1/submit', (req, res, next) => {
    orchestrationController.orch_submit(req, res, next);
});

router.post('/api/v1/update', (req, res, next) => {
    orchestrationController.orch_update(req, res, next);
});

router.post('/api/v1/interval', (req, res, next) => {
    orchestrationController.orch_interval(req, res, next);
});

router.post('/api/v1/delete', (req, res, next) => {
    orchestrationController.orch_delete(req, res, next);
});
/*-------orchestration end----*/


/*-------------------New Dashboard graphs  ------------------*/

router.get('/api/v1/get_allcloud_cost', (req, res, next) => {
    DashboardGraph_controller.get_allCloudCost_TCO(req, res, next);
});
router.get('/api/v1/dashboardconsumption', (req, res, next) => {
    DashboardGraph_controller.GetDashboardConsumptionCost(req, res, next);
});
router.get('/api/v1/get_count_migration', (req, res, next) => {
    DashboardGraph_controller.get_migration(req, res, next);
});
router.get('/api/v1/get_dashboard_database', (req, res, next) => {
    DashboardGraph_controller.dashboard_database_graph(req, res, next);
});
router.get('/api/v1/get_allcloud_database_cost', (req, res, next) => {
    DashboardGraph_controller.get_allClouddatabase(req, res, next);
});
router.get('/api/v1/get_allcloud_storage_cost', (req, res, next) => {
    DashboardGraph_controller.get_allCloudstorage(req, res, next);
});
router.get('/api/v1/dashboardstorage', (req, res, next) => {
    DashboardGraph_controller.GetDashboardStorageCount(req, res, next);
});

router.get('/api/v1/DetailsContainers', (req, res, next) => {
    DashboardGraph_controller.get_container(req, res, next);
});
router.get('/api/v1/get_dashboard_cloudacc', (req, res, next) => {
    DashboardGraph_controller.dashboard_cloudacc_count(req, res, next);
});

router.get('/api/v1/Providersmap', (req, res, next) => {
    DashboardGraph_controller.dynamic_google_map(req, res, next);
});


/*-------------------New Dashboard Database Forms  ------------------*/
router.post('/api/v1/get_token_dashboard', (req, res, next) => {
    DashboardDatabaseForm_controller.create_token(req, res, next);
});

router.post('/api/v1/validate_dashboard_d2c_credentials', (req, res, next) => {
    DashboardDatabaseForm_controller.validateD2CCredentials(req, res, next);
});

router.post('/api/v1/check_dashboard_account_name_exists', (req, res, next) => {
    DashboardDatabaseForm_controller.checkAccountNameExists(req, res, next);
});

router.post('/api/v1/add_dashboard_datbase_accounts', (req, res, next) => {
    DashboardDatabaseForm_controller.selectAddEditDeleteMigrationAccounts(req, res, next);
});
router.post('/api/v1/get_db_cb_user_id', (req, res, next) => {
    DashboardDatabaseForm_controller.getUserIdFromUsername(req, res, next);
});
router.post('/api/v1/get_cloud_region_mapping1', (req, res, next) => {
    DashboardDatabaseForm_controller.getCloudRegionMapping(req, res, next);
});

router.post('/api/v1/get_bucket_list1', (req, res, next) => {
    DashboardDatabaseForm_controller.listS2CBuckets(req, res, next);
});




// aws scheduler for account data

var params = '';
var acccess_key = [];
var secret_key = [];



var j = schedule.scheduleJob('1 */3 * * * *', function () {
    getAwsdata();
});

var k = schedule.scheduleJob('1 */5 * * * *', function () {
    updata_data();
});

var m = schedule.scheduleJob('1 1 13 * * *', function () {
    emailschedularbudget.globalEmailFunction();
});
//// getting aws data into DB 
//var m = schedule.scheduleJob('1 1 5 * * *', function () {
//    aws_data_scheduler.updateAwsDatabase();
//});

//var m = schedule.scheduleJob('1 8 5 * * *', function () {
//    aws_data_scheduler.updateAccountId();
//});
//var m1 = schedule.scheduleJob('1 15 5 * * *', function () {
//    aws_vm_scheduler.Account_Detail();
//});
//var m2 = schedule.scheduleJob('1 30 5 * * *', function () {
//    aws_stg_scheduler.caller();
//});
///* var m3 = schedule.scheduleJob('1 45 5 * * *', function(){
//     aws_updateaccount_scheduler.getAwsdata();
//});
// var m4 = schedule.scheduleJob('1 50 5 * * *', function(){
//     aws_updateaccount_scheduler.updata_data();
//});

//*/


async function getAwsdata() {
    var Key_Result = [];

    await config.query("select * from cb_mon_aws_scheduler_get_data('get_values',null,null,null,'info');FETCH ALL IN \"info\";", function (err, result, fields) {
        if (!err) {
            Key_Result = result[1].rows;
            console.log("form Key_Result" + Key_Result)
            call_setdata(Key_Result);
        } else {
            throw err;
        }
    });
}

exports.getAwsdata = getAwsdata;

async function call_setdata(data) {
    for (let i = 0; i < data.length; i++) {
        acccess_key[i] = data[i].client_id;
        secret_key[i] = data[i].client_secret;
        console.log("access : " + acccess_key[i] + " secret : " + secret_key[i]);
    }
    await calling_Object(acccess_key, secret_key);

}
exports.call_setdata = call_setdata;


async function calling_Object(access_key, secret_key) {
    var account_id = '';

    for (let i = 0; i < access_key.length; i++) {
        await getAwsObject(access_key[i], secret_key[i], async function (firstresult, err) {
            if (!err) {
                console.log("after getAwsObject executed : " + i)
                await validateKeys(firstresult, async function (secondresult, err) {
                    if (!err) {
                        console.log("after validateKeys executed : " + i)
                        account_id = secondresult.Account;
                        await insert_into_DB(access_key[i], secret_key[i], account_id, async function (status, err) {
                            if (!err) {
                                await console.log("account id inserted : " + i);
                            } else {
                                await console.log("account id not inserted");
                            }
                        });

                    }
                    else {
                        console.log("Account not found");
                    }
                });
            } else {
                console.log("error in loading data");
            }
        });

    }


}
exports.calling_Object = calling_Object;

async function getAwsObject(access_key, secret_key, callback) {

    var sts = await new AWS.STS({
        apiVersion: '2011-06-15',
        accessKeyId: access_key,
        secretAccessKey: secret_key
    });

    await callback(sts, false);
}
exports.getAwsObject = getAwsObject;

async function validateKeys(firstresult, callback) {
    await firstresult.getCallerIdentity(params, async function (err, data) {
        if (err) {
            console.log(err, err.stack);
            await callback(err, true);
        }
        else {

            await callback(data, false);
        }
    });

}
exports.validateKeys = validateKeys;

async function insert_into_DB(access_key, secret_key, account_id, callback) {

    await config.query("select * from cb_mon_aws_scheduler_get_data('put_values','" + access_key + "','" + secret_key + "','" + account_id + "','info');", async function (err, result) {
        if (!err) {

            await callback(result, false);
        } else {

            await callback(result, true);
        }
    });


}

exports.insert_into_DB = insert_into_DB;



function updata_data() {

    config.query("select * from cb_mon_aws_scheduler_get_data('update_values','null','null','null','info');", function (err, result) {
        if (!err) {
            console.log("data updated")
        } else {
            console.log("data not updated")

        }
    });

}

exports.updata_data = updata_data;




module.exports = router;
