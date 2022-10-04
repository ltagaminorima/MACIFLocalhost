Feature: Producer Codes
  As a system superuser (su) I want to create additional producer codes for policy operations

  Background:
    * def sharedPath = 'classpath:gw/pc/apicomponents/producercodes/'
    * configure headers = read('classpath:admin-headers.js')
    * def response = {}

  @id=CreateProducerCode
  Scenario: Create producer code
    * def createProducerTemplate = sharedPath + 'createProducerCode.json'
    * def producerCodeUrl = PC_URL + '<Please enter producer code url>'
    Given url producerCodeUrl
    And request readWithArgs(createProducerTemplate, {'code': code, 'organization': organization, 'roles':roles})
    When method POST
    Then status 201
    * response.code = response.data.attributes.code
    * response.id = response.data.attributes.id
