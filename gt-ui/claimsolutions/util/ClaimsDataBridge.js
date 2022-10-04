'use strict';
import {GTUiApiBridge} from "../../config/GTUiApiBridge";
const java = require("java");
java.classpath.push(".");

class CCDataBridge {
  static ccAdminData;

  constructor(gtUiApiBridge) {
        //In this case dataBridge = GTUiApiBridge
        this.dataBridge = gtUiApiBridge;
  }

  generateClaimsAdminData() {
      if (!CCDataBridge.ccAdminData) {
          let adminDataUtil = java.import('gw.cc.datacreation.admindata.CreateClaimsAdminData');
          let data = adminDataUtil.loadAdminDataSync();

          CCDataBridge.ccAdminData = JSON.parse(data);
      }
  }

  getClaimUser(userRole) {
      for (let key in CCDataBridge.ccAdminData.adminData.users) {
          let user = CCDataBridge.ccAdminData.adminData.users[key];
          if(user.testDataIdentifier === userRole)
              return user.userName;
      }
      console.log("UserName for given userRole not found. userRole = " + userRole);
      return "";
  }

  async runGtApiFeature(featureFile) {
      return await this.dataBridge.runGtApiFeature(featureFile);
  }

  async runGtApiScenario(featureFile, scenarioTag) {
      return await this.dataBridge.runGtApiScenario(featureFile, scenarioTag);
  }
}

export const ClaimsDataBridge =  function() {
    return new CCDataBridge(GTUiApiBridge);
}()