Feature: Create a Promo
  Scenario: Create a Promo Succesfully
    Given the promo details are blank
    When I enter some valid attributes
    Then the promo details will contain those attributes
    When I submit 
    Then the list of promos will contain the new addition

  Scenario: Create and Cancel a Promo
    Given the promo details are blank
    When I enter some valid attributes
    And I cancel
    Then the promo details are empty and the list of promos does not contain the new addition
  
  Scenario: Create Promo with Sort Applied
    Given there are some Promos with positions [300,200,100,75,25]
      And the sort type is "position"
     When I create a Promo with position:125
     Then the list of promos will contain the new addition at index:2