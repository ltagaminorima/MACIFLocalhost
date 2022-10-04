package gw.util;

import gw.gtapi.util.KarateJavaUtil;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.jose4j.json.internal.json_simple.JSONObject;
import org.jose4j.json.internal.json_simple.parser.JSONParser;

import javax.swing.text.Utilities;
import java.io.*;
import java.security.SecureRandom;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.*;

public class CommonUtil {
    private static SecureRandom secureRandom = null;

    public static SecureRandom getSecureRandom() {
        if (secureRandom == null) {
            secureRandom = new SecureRandom();
        }

        return secureRandom;
    }

    private static final DateTimeFormatter dtf = ISODateTimeFormat.date();
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public static String getRandomName(String prefix){
        return  prefix + (getSecureRandom().nextInt( Integer.MAX_VALUE ) + 1);
    }

    public static String addMonthsToISODateString(String dateStr, int numMonths) throws ParseException {
        Date date = dtf.parseDateTime(dateStr).toDate();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, numMonths);
        return sdf.format(cal.getTime());
    }

    public static String currentISODateString() throws ParseException {
        Date date = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return sdf.format(cal.getTime());
    }

    public static Map<String, String> getDefaultCredentials() {
        Map<String, String> defaultCredentials = new HashMap<>();
        defaultCredentials.put("username", "su");
        defaultCredentials.put("password", "gw");
        return defaultCredentials;
    }

    /* Get UTC/ISO-8601 Date/Time or Date only

    1) main method getDateWithDayOffset, arguments: long days, boolean isDateTimeFormat:

    days: the future f.e. +5; in the past f.e. -3; last month: -31
    isDateTimeFormat: true or false.
    true – DateTime format - UTC/ISO-8601 date-time format like "2020-04-24T22:06:32.000Z"
    false – Date only format - yyyy-mm-dd f.e. "2020-04-24"

    2) Two generic methods without parameters that use the main one:
       - getCurrentDateTime() gives today Date/Time ISO-8601 format like "2020-04-24T22:06:32.000Z"
       - getCurrentDate() gives today Date only format like "2020-04-24"
    */

    public static String getDateWithDayOffset(long dayOffset, boolean isDateTimeFormat) {
        String adjustedDate = ZonedDateTime.now(ZoneOffset.UTC).plusDays(dayOffset).toString();
        return isDateTimeFormat ? (adjustedDate.substring(0,19) + "Z") : adjustedDate.substring(0,10);
    }
    public static String getCurrentDateTime() {
        return getDateWithDayOffset(0,true);
    }
    public static String getCurrentDate() {
        return getDateWithDayOffset(0,false);
    }

    // generic, to be used i.e. in user name creation (like adjuster34567) or in ServiceRequest scenarios
    public static String addRandomInt(String testName){
        return  testName + (getSecureRandom().nextInt( Integer.MAX_VALUE ) + 1);

    }

    public static JSONObject readJSONFile(String fileName) {
        JSONParser jsonParser = new JSONParser();

        //URL path = CreateClaimsAdminData.class.getResource(fileName);
        JSONObject data = new JSONObject();

        try {
            File file = new File(fileName);
            if (file.exists() && file.canRead()) {
                FileReader reader = new FileReader(file);
                Object obj = jsonParser.parse(reader);
                data = (JSONObject) (obj);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (org.jose4j.json.internal.json_simple.parser.ParseException e) {
            e.printStackTrace();
        }
        return data;
    }

    public static JSONObject saveDataToFile(JSONObject obj, String dataOutputFile) {
        //URL path = CreateClaimsAdminData.class.getResource(dataOutputFileName);
        try {
            File file = new File(dataOutputFile);
            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(obj.toJSONString());
            fileWriter.flush();
            fileWriter.close();
        }
        catch (IOException e) {
            throw new RuntimeException("CommonUtil.saveDataToFile(): Failed to save test data " + e.getMessage());
        }
        return obj;
    }
}
