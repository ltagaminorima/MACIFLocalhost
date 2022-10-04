function fn() {
    var Base64 = Java.type('java.util.Base64');
    var commonUtil = Java.type('gw.util.CommonUtil');
    var userPass = commonUtil.getDefaultCredentials().get("username") + ':' + commonUtil.getDefaultCredentials().get("password");
    var encoded = Base64.getEncoder().encodeToString(userPass.getBytes());
    var headers = {}
    headers['Authorization'] = 'Basic ' + encoded;
    return karate.merge(headers, traceHeadersUtil.generateTraceHeaders());
}
