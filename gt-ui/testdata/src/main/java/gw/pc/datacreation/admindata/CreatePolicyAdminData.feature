Feature: A feature file to create TDM Admin data using TestSupportAPIs.
  Admin data is only created once and is available for rest of the test execution(s).

  @id=PCAdminData
  Scenario: Loading policy admin data using Test Support APIs
    * def policyAdminData = Java.type('gw.pc.datacreation.admindata.CreatePolicyAdminData')
    * policyAdminData.loadAdminData()
