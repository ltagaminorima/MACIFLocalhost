'use strict';
const fs = require('fs');
const path = require('path');
const java = require("java");

java.classpath.push(".");
const tdmJarLocation = "../testdata/build/libs/testdata.jar";
const gtApiLibs = "../testdata/repository/supportingLibs/";

class UiApiBridge {
  constructor() {
      try {
        fs.existsSync(path.resolve(__dirname, tdmJarLocation));
      }
      catch (err) {
        console.error('Not able find TDM jar. Make sure to build Jar for GT-API TDM scenarios.');
        throw err;
      }
      java.classpath.push(path.resolve(__dirname, tdmJarLocation));
      java.classpath.push(path.resolve(__dirname, gtApiLibs + 'graal-sdk-21.1.0.jar'));
      java.classpath.push(path.resolve(__dirname, gtApiLibs + 'truffle-api-21.1.0.jar'));
      java.classpath.push(path.resolve(__dirname, gtApiLibs + 'js-21.1.0.jar'));
      return this;
  }

  async runGtApiFeature(featureFile, args) {
      console.log('UiApiBridge -> featureFile: ' + featureFile);

      let gtApiBridge = java.import('gw.util.GtApiBridge');
      var result = await gtApiBridge.executeGtApiFeatureSync(featureFile, args);
      return result;
  }

  async runGtApiScenario(featureFile, scenarioTag, args) {
      let gtApiBridge = java.import('gw.util.GtApiBridge');
      var result = await gtApiBridge.executeGtApiScenarioSync(featureFile, scenarioTag, args);
      return result;
  }

}

export const GTUiApiBridge =  function() {
    return new UiApiBridge();
}()
