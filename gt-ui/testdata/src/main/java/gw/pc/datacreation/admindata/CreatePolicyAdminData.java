package gw.pc.datacreation.admindata;

import gw.gtapi.util.fileio.FileIOUtils;
import gw.pc.apicomponents.organizations.OrganizationDO;
import gw.pc.apicomponents.producercodes.ProducerCodeDO;
import gw.pc.apicomponents.users.PolicyUserDO;
import gw.pc.apicomponents.groups.GroupDO;
import gw.util.CommonUtil;
import gw.util.GtApiBridge;

import org.jose4j.json.internal.json_simple.JSONArray;
import org.jose4j.json.internal.json_simple.JSONObject;

import java.util.*;

public class CreatePolicyAdminData {
    private static final String dataInputFileName = "/policyAdminData.json";
    private static final String dataCacheFileName = "/policyDataContainer.json";
    private static final String dataFolder = FileIOUtils.setPath("testdata", "testdata", CreatePolicyAdminData.class.getPackage().getName());
    private static final String dataInputFile = dataFolder + dataInputFileName;
    private static final String dataCacheFile = dataFolder + dataCacheFileName;
    private static final String POLICY_USERS_FEATURE = "classpath:gw/pc/apicomponents/users/PolicyUsers.feature";
    private static final String GROUPS_FEATURE = "classpath:gw/pc/apicomponents/groups/Groups.feature";
    private static final String PRODUCER_CODES_FEATURE = "classpath:gw/pc/apicomponents/producercodes/ProducerCodes.feature";
    private static final String ORGANIZATIONS_FEATURE = "classpath:gw/pc/apicomponents/organizations/Organizations.feature";
    private static final String ADMIN_FEATURE = "classpath:gw/pc/apicomponents/admin/Admin.feature";

    public static void main(String[] args) {
        loadAdminData();
    }

    public static String loadAdminData() {
        // Read saved data
        JSONObject data = FileIOUtils.readJSONFile(dataCacheFile);
        boolean cacheIsValid = isCachedDataValid(data);

        if (cacheIsValid && !PolicyDataContainer.isDataLoaded()) {
            // ToDo: Implement Java logging
            System.out.println("Reloading cached data for PolicyCenter from " + dataCacheFile);
            JSONObject attributesObj = (JSONObject) data.get("adminData");

            // Set Organizations
            ((JSONArray) attributesObj.get("organizations")).stream().forEach(element -> {
                JSONObject obj = (JSONObject) element;
                // Add in PolicyDataContainer
                PolicyDataContainer.setPolicyOrganization(obj.get("organizationIdentifier").toString(),
                        new OrganizationDO(obj.get("organizationName").toString(), obj.get("organizationID").toString()));
            });

            // Set Producer codes
            ((JSONArray)attributesObj.get("producerCodes")).stream().forEach(element -> {
                JSONObject obj = (JSONObject) element;
                // Add in PolicyDataContainer
                PolicyDataContainer.setPolicyProducerCode(obj.get("producerCodeIdentifier").toString(),
                        new ProducerCodeDO(obj.get("producerCode").toString() ,
                                obj.get("producerCodeID").toString()));
            });

            // Set Groups
            ((JSONArray)attributesObj.get("groups")).stream().forEach(element -> {
                JSONObject obj = (JSONObject)element;
                // Add in PolicyDataContainer
                PolicyDataContainer.setPolicyGroup(obj.get("groupIdentifier").toString(),
                        new GroupDO(obj.get("groupName").toString(), obj.get("groupID").toString()));
            });

            // Set Users
            ((JSONArray)attributesObj.get("users")).stream().forEach(element -> {
                JSONObject obj = (JSONObject)element;
                // Add in PolicyDataContainer
                PolicyDataContainer.setPolicyUser(obj.get("userIdentifier").toString(),
                        new PolicyUserDO(obj.get("userName").toString() ,
                                obj.get("groupId").toString(),
                                obj.get("userId").toString()));
            });
        }

        if (!cacheIsValid) {
            // ToDo: Implement Java logging
            System.out.println("Rebuilding cached data for PolicyCenter based on " + dataInputFile);
            data = createDataFromInputJSONFile();
        }
        return data.toJSONString();
    }

    // ToDo: Consolidate with similar version in ClaimsAdminData?
    private static boolean isCachedDataValid(JSONObject data) {
        boolean validData = false;
        if (!data.isEmpty()) {
            JSONObject adminData = ((JSONObject)data.get("adminData"));
            JSONArray users = ((JSONArray)adminData.get("users"));
            JSONObject user = (JSONObject)users.get(0);
            // ToDo: Implement Java logging
            System.out.println("Stale cached data check: validating the " + user.get("userIdentifier")
                    + " user (" +  user.get("userId") + ")");
            Map<String, Object> result = (HashMap) GtApiBridge.executeGtApiScenario(
                    ADMIN_FEATURE, "@GetUserScenario",
                    new HashMap<>() {{ put("userId", user.get("userId")); }}).get("response");
            validData = result.get("userExists").toString().equalsIgnoreCase("true");
        }
        if (!validData) {
            // ToDo: Implement Java logging
            System.out.println("Stale cached data check: Failed to validate cached user");
        }
        return validData;
    }

    public static JSONObject createDataFromInputJSONFile() {
        // Read json file
        JSONObject inputObj = FileIOUtils.readJSONFile(dataInputFile);
        JSONObject attributesObj = (JSONObject)((JSONObject)inputObj.get("data")).get("attributes");

        // Create Organizations
        JSONArray organizations = generateOrganizations((JSONArray)attributesObj.get("organizations"));

        // Create Producer codes
        JSONArray producerCodes = generateProducerCodes((JSONArray)attributesObj.get("producerCodes"));

        // Create Groups
        JSONArray groups = generateGroups((JSONArray)attributesObj.get("groups"));

        // Create Users
        JSONArray users = generateUsers((JSONArray)attributesObj.get("users"));

        // Write data to output json file
        return saveDataToFile(organizations, producerCodes, groups, users);
    }

    public static JSONArray generateOrganizations(JSONArray orgs) {
        JSONArray organizations = new JSONArray();
        orgs.stream().forEach(e -> {
            JSONObject element = (JSONObject)e;
            String organizationName = CommonUtil.getRandomName("organization");
            // Generate Organizations
            Map<String, Object> result = (HashMap) GtApiBridge.executeGtApiFeature(
                    ORGANIZATIONS_FEATURE,
                    new HashMap<>() {{
                        put("organizationName", organizationName);
                    }}).get("response");

            // Add in PolicyDataContainer
            PolicyDataContainer.setPolicyOrganization(
                    getAndValidateValueFromJSONObject(element, "organizationIdentifier"),
                    new OrganizationDO(organizationName, result.get("id").toString()));

            // Add to hashmap, so that it would be saved in file storage later.
            organizations.add(new JSONObject() {{
                put("organizationIdentifier", element.get("organizationIdentifier"));
                put("organizationName", result.get("name"));
                put("organizationID", result.get("id"));
            }});
        });
        return organizations;
    }

    public static JSONArray generateProducerCodes(JSONArray producerCodes) {
        JSONArray pCodes = new JSONArray();
        producerCodes.stream().forEach(e -> {
            JSONObject element = (JSONObject)e;
            String producerCode = CommonUtil.getRandomName("producerCode");
            String organization = getAndValidateValueFromJSONObject(element, "organizationIdentifier");

            // Generate Producer Code
            HashMap<String, Object> result = (HashMap)GtApiBridge.executeGtApiFeature(
                    PRODUCER_CODES_FEATURE,
                    new HashMap<>() {{
                        put("code", producerCode);
                        put("organization", PolicyDataContainer.getPolicyOrganization(organization).getId());
                        put("roles", "producer");
                    }}).get("response");

            // Add in PolicyDataContainer
            PolicyDataContainer.setPolicyProducerCode(
                    getAndValidateValueFromJSONObject(element, "producerCodeIdentifier"),
                    new ProducerCodeDO(result.get("code").toString(), result.get("id").toString()));

            // Add to hashmap, so that it would be saved in file storage later.
            pCodes.add(new JSONObject() {{
                put("producerCodeIdentifier", element.get("producerCodeIdentifier"));
                put("producerCode", result.get("code"));
                put("producerCodeID", result.get("id"));
            }});
        });
        return pCodes;
    }

    public static JSONArray generateGroups(JSONArray array) {
        JSONArray groups = new JSONArray();
        array.stream().forEach(e -> {
            JSONObject element = (JSONObject)e;
            String groupName = CommonUtil.getRandomName("group");
            String organization = getAndValidateValueFromJSONObject(element, "organizationIdentifier");
            String producerCode = getAndValidateValueFromJSONObject(element, "producerCodeIdentifier");

            // Generate Groups
            Map<String, Object> result = (HashMap)GtApiBridge.executeGtApiFeature(
                    GROUPS_FEATURE,
                    new HashMap<>() {{
                        put("groupName", groupName);
                        put("organization", PolicyDataContainer.getPolicyOrganization(organization).getId());
                        put("producerCodeId", PolicyDataContainer.getPolicyProducerCode(producerCode).getId());
                    }}).get("response");

            // Add in PolicyDataContainer
            PolicyDataContainer.setPolicyGroup(getAndValidateValueFromJSONObject(element, "groupIdentifier"),
                    new GroupDO(groupName, result.get("id").toString()));

            // Add to hashmap, so that it would be saved in file storage later.
            groups.add(new JSONObject() {{
                put("groupIdentifier", element.get("groupIdentifier"));
                put("groupName", result.get("name"));
                put("groupID", result.get("id"));
            }});
        });
        return groups;
    }

    public static JSONArray generateUsers(JSONArray array) {
        JSONArray users = new JSONArray();
        array.stream().forEach(e -> {
            JSONObject element = (JSONObject)e;
            String userName = CommonUtil.getRandomName("user");
            String groupID = getAndValidateFirstValueFromJSONArray(element, "groups");

            // Generate User
            Map<String, Object> result = (HashMap)GtApiBridge.executeGtApiFeature(
                    POLICY_USERS_FEATURE,
                    new HashMap<>() {{
                        put("userName", userName);
                        put("roles", getAndValidateFirstValueFromJSONArray(element, "roles"));
                        put("groups", PolicyDataContainer.getPolicyGroup(groupID).getId());
                        put("useProducerCodeSecurity", element.get("useProducerCodeSecurity"));
                    }}).get("response");

            // Add in PolicyDataContainer
            PolicyDataContainer.setPolicyUser(getAndValidateValueFromJSONObject(element, "userName"),
                    new PolicyUserDO(userName, PolicyDataContainer.getPolicyGroup(groupID).getId(),
                            result.get("userId").toString()));

            // Add to hashmap, so that it would be saved in file storage later.
            users.add(new JSONObject() {{
                put("userIdentifier", element.get("userName"));
                put("userName", result.get("userName"));
                put("groupId", PolicyDataContainer.getPolicyGroup(groupID).getId());
                put("userId", result.get("userId"));
            }});
        });
        return users;
    }

    private static String getAndValidateValueFromJSONObject(JSONObject obj, String key) {
        if (obj.get(key) == null) {
            throw new NullPointerException("No value for key '" + key + "' found in JSON element: "
                    + obj.toJSONString());
        }
        return obj.get(key).toString();
    }

    private static String getAndValidateFirstValueFromJSONArray(JSONObject obj, String key) {
        if (obj.get(key) == null || ((JSONArray)obj.get(key)).size() == 0) {
            throw new NullPointerException("No value for key '" + key + "' found in JSON element: "
                    + obj.toJSONString());
        }
        return ((JSONArray)obj.get(key)).get(0).toString();
    }

    public static JSONObject saveDataToFile(
            JSONArray organizations, JSONArray pCodes, JSONArray groups, JSONArray users) {
        JSONObject obj = new JSONObject();
        obj.put("adminData", new JSONObject(new HashMap() {{
            put("organizations", organizations);
            put("producerCodes", pCodes);
            put("groups", groups);
            put("users", users);
        }}));
        FileIOUtils.saveDataToFile(obj, dataCacheFile);
        return obj;
    }
}