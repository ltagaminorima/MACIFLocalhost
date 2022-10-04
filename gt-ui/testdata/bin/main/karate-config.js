function fn() {
    var PC_URL = java.lang.System.getenv('PCbase_URL') ? java.lang.System.getenv('PCbase_URL') : 'undefined';

    var config = {
        util: Java.type('gw.gtapi.util.KarateJavaWrapper'),
        commonUtil: Java.type('gw.util.CommonUtil'),
        policyDataContainer : Java.type('gw.pc.datacreation.admindata.PolicyDataContainer'),
        execution: Java.type("com.gw.execution.KarateExecution")
    };

    karate.configure('logPrettyRequest', true);
    karate.configure('logPrettyResponse', true);

    config.PC_URL = PC_URL;

    karate.callSingle('classpath:com/gw/GtApiHealthCheck.feature@id=AppHealthCheck', { 'appUrl': config.PC_URL });

    // Override karate feature files root dir location.
    config.execution.setKarateFeatureDirLocation("classpath:gw");

    karate.call('classpath:gtapi-e2e-util.js', config);
    attachE2EHelperMethods(config);

    return config;
}
