Feature: Groups
  As a system user I want to create additional groups for policy operations

  Background:
    * def sharedPath = 'classpath:gw/pc/apicomponents/groups/'
    * configure headers = read('classpath:admin-headers.js')
    * def response = {}

  @id=CreateGroup
  Scenario: Create group
    * def createGroupTemplate = sharedPath + 'createGroup.json'
    * def groupUrl = PC_URL + '<Please enter groups URL>'
    Given url groupUrl
    And request readWithArgs(createGroupTemplate, {'groupName': groupName, 'organization': organization, 'producerCodes': producerCodeId})
    When method POST
    Then status 201
    * response.name = response.data.attributes.name
    * response.id = response.data.attributes.id
