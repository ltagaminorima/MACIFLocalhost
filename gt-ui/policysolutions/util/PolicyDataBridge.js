'use strict';
import {GTUiApiBridge} from "../../config/GTUiApiBridge";
const java = require("java");
java.classpath.push(".");
const fs = require('fs');
const pcAdminDataFile = 'testdata/src/main/java/gw/pc/datacreation/admindata/policyDataContainer.json';

class PCDataBridge {
    static pcAdminData;

    constructor(gtUiApiBridge) {
        //In this case dataBridge = GTUiApiBridge
        this.dataBridge = gtUiApiBridge;
    }

    generatePolicyAdminData() {
        if (!this.pcAdminData) {
            console.log('Loading Policy Admin Data');
            let adminDataUtil = java.import('gw.pc.datacreation.admindata.CreatePolicyAdminData');
            let data = adminDataUtil.loadAdminDataSync();

            this.pcAdminData = JSON.parse(data);
        }
    }

    getPolicyUser(userRole) {
        if (!this.pcAdminData && fs.existsSync(pcAdminDataFile)) {
            console.log('Policy Admin Data is not defined (reading from cache)');
            let adminData = fs.readFileSync(pcAdminDataFile, 'utf8');
            this.pcAdminData = JSON.parse(adminData.toString());
        }
        if (!this.pcAdminData) {
            console.error("The Admin data cache is empty (failed to retrieve " + userRole + " user)");
        }
        for (var key in this.pcAdminData.adminData.users) {
            var user = this.pcAdminData.adminData.users[key];
            if(user.userIdentifier === userRole)
                return user.userName;
        }
        console.log("UserName for given userRole not found. userRole = " + userRole);
        return "";
    }

    async runGtApiFeature(featureFile) {
        console.log('PolicyDataBridge -> featureFile: ' + featureFile);
        return await this.dataBridge.runGtApiFeature(featureFile);
    }

    async runGtApiScenario(featureFile, scenarioTag) {
        return await this.dataBridge.runGtApiScenario(featureFile, scenarioTag);
    }
}

export const PolicyDataBridge =  function() {
    return new PCDataBridge(GTUiApiBridge);
}()