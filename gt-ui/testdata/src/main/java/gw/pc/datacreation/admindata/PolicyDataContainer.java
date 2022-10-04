package gw.pc.datacreation.admindata;

import gw.pc.apicomponents.groups.GroupDO;
import gw.pc.apicomponents.organizations.OrganizationDO;
import gw.pc.apicomponents.producercodes.ProducerCodeDO;
import gw.pc.apicomponents.users.PolicyUserDO;
import gw.gtapi.util.KarateJavaWrapper;

import java.util.*;

public class PolicyDataContainer {
    private static Map<String, PolicyUserDO> users = new HashMap<>();

    public static PolicyUserDO getPolicyUser(String userObjectName) {
        if (users.containsKey(userObjectName)) {
            return users.get(userObjectName);
        } else {
            throw new KarateJavaWrapper.WrappedJavaException(
                    new RuntimeException("Unable to find user with object identifier: " + userObjectName));
        }
    }

    public static void setPolicyUser(String userObjectName, PolicyUserDO userDO){
        users.put(userObjectName, userDO);
    }

    private static Map<String, GroupDO> groups = new HashMap<>();

    public static GroupDO getPolicyGroup(String groupObjectName) {
        if (groups.containsKey(groupObjectName)) {
            return groups.get(groupObjectName);
        } else {
            throw new KarateJavaWrapper.WrappedJavaException(
                    new RuntimeException("Unable to find group with object identifier: " + groupObjectName));
        }
    }

    public static void setPolicyGroup(String groupObjectName, GroupDO groupDO){
        groups.put(groupObjectName, groupDO);
    }

    private static Map<String, ProducerCodeDO> producerCodes = new HashMap<>();

    public static ProducerCodeDO getPolicyProducerCode(String producerCodeObjectName) {
        if (producerCodes.containsKey(producerCodeObjectName)) {
            return producerCodes.get(producerCodeObjectName);
        } else {
            throw new KarateJavaWrapper.WrappedJavaException(new RuntimeException(
                    "Unable to find producer code with object identifier: " + producerCodeObjectName));
        }
    }

    public static void setPolicyProducerCode(String producerCodeObjectName, ProducerCodeDO producerCodeDO) {
        producerCodes.put(producerCodeObjectName, producerCodeDO);
    }

    // Adding organization codes
    private static Map<String, OrganizationDO> organizations = new HashMap<>();

    public static OrganizationDO getPolicyOrganization(String organizationObjectName) {
        if (organizations.containsKey(organizationObjectName)) {
            return organizations.get(organizationObjectName);
        } else {
            throw new KarateJavaWrapper.WrappedJavaException(new RuntimeException(
                    "Unable to find organization with object identifier: " + organizationObjectName));
        }
    }

    public static void setPolicyOrganization(String organizationObjectName, OrganizationDO organizationDO) {
        organizations.put(organizationObjectName, organizationDO);
    }

    public static boolean isDataLoaded() {
        return !(producerCodes.isEmpty() || groups.isEmpty() || users.isEmpty() || organizations.isEmpty());
    }
}
