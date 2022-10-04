Feature: To create and manage administrative objects
  As a system superuser (su) I want to create admin data such as organizations, users, and producer codes

  Background:
    * def username = '<Please enter username>'
    * def password = '<Please enter password>'
    * configure headers = read('classpath:headers.js')
    * def adminUrl = PC_URL + '<Please enter admin url>'
    * def adminPath = 'classpath:gw/apicomponents/admin/'
    * def userPath = 'classpath:gw/apicomponents/users/'
    * def response = {}

  @id=CreateOrganization
  Scenario: Create new organizations
    * def createOrganizationJson =  adminPath + 'postOrganization.json'
    * url organizationUrl = adminUrl + 'organizations'
    Given url organizationUrl
    And request readWithArgs(createOrganizationJson, templateArgs)
    When method POST
    Then status 201
    * setStepVariable('id', response.data.attributes.id)
    * setStepVariable('rootGroupId', response.data.attributes.rootGroup.id)

  @id=CreateProducerCode
  Scenario: Create a new producerCode
    * def createProducerCodeJson =  adminPath + 'postProducerCode.json'
    * url producerCodeUrl = adminUrl + 'producer-codes'
    Given url producerCodeUrl
    And request readWithArgs(createProducerCodeJson, templateArgs)
    When method POST
    Then status 201
    * setStepVariable('producerCodeId', response.data.attributes.id)

  @id=AddUser
  Scenario: Add user
    * def addUserTemplate = userPath + 'createPolicyUser.json'
    * def userUrl = PC_URL + '<Please enter create users url>'
    Given url userUrl
    And request readWithArgs(addUserTemplate, templateArgs)
    When method POST
    Then status 201

  @GetUserScenario
  @id=GetUser
  Scenario: Get an individual user
    Given url adminUrl + '<Please enter get user url>'
    When method GET
    Then assert responseStatus == 200 || responseStatus == 404
    * response.userExists = responseStatus == 200