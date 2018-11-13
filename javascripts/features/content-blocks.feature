Feature: Content Blocks

  Scenario: Set Content Block on Initialize
    Given the application is initializing
     Then there is no Content Block selected
     When the application is ready
      And I set the Content Block
     Then there will be a Content block selected
     
  Scenario: Content Block ID Appears in Promotion Details
    Given there is a list of Promos
      And there is a Content Block selected
     When I edit the Promo
     Then the Promo Details will include a Content Block Id

  Scenario: Rename Content Block
    Given there is a Content Block selected 
      And it has the name "Primary Hero"
     When I set the name to "Primary Hero 2"
      And I submit
     Then the Content Block's name will be "Primary Hero 2"
     
  Scenario: Clone Promo
    Given there is a list of Promos
     And there is a Content Block selected 
    When I clone a promo
    Then the cloned promo will include a Content Block Id 