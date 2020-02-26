Feature: Form Behaviors
  Scenario: Hunt for Images
    Given I am editing a promo
     And there is an input with a type of 'imageHunter' registered in the form
     And the hunter dependencies are available
     And Hunter is initialized
     And the promo has a seriesId defined
    When I click on the Hunter button in the 'imageHunter' input
    Then there will be a call to Hunter with the seriesId as one of the search parameters
    When it loads
    Then there will be a list of images
    When I select an image
    Then Hunter will close
     And the input will be populated with my image path
     
  Scenario Outline: Hunter Host Configurations
    Given I am editing a promo
      And I am on <environment> environment
      And the origin is <origin>
     When Hunter is initialized
     Then the config will have remoteHost=<remoteHost>

    Examples:
      | environment       | origin                   | remoteHost             |
      | LOCAL             | http://localhost:8080    | http://localhost:8080  |
      | DEVELOPMENT       | http://dev.tools.sho.com | http://dev.www.sho.com |
      | TESTING INSECURE  | http://qa.tools.sho.com  | https://qa-www.sho.com |
      | TESTING SECURE    | https://qa.tools.sho.com | https://qa-www.sho.com |
      | PRODUCTION        | https://tools.sho.com    | https://www.sho.com    |