Feature: Edit a Promo
  Scenario: Edit a Promo
   Given there is a list of promos
     And the promo details are blank  
    When I select a promo
     And I select 'edit' from actions
     And I toggle the promo details
     And I make a change to one or more fields in the promo
    Then the promo details are visible
     And the promo details are updated
    When I submit
    Then the list contains a promo with my changes
  
  Scenario: isEditing Flag
    Given there is a list of promos
      And I am not editing 
      Then isEditing will be false
      When I select a promo
      And I select 'edit' from actions
      Then isEditing will be true