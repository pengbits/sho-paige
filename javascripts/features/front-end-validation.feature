Feature: Front-End Form Validation

  Scenario: Create/Edit a Promo and enter all Required Fields
    Given there are validation rules
    When I enter all of the required fields
    Then there will not be any errors
  
  Scenario: Create/Edit a Promo and omit some Required Fields
    Given there are validation rules
    When I enter some of the required fields
    Then there will be some errors

  Scenario: Create/Edit a Promo and enter forbidden characters
    Given there are validation rules
    When I enter forbidden characters
    Then there will be some errors
    
  Scenario: Create/Edit a Promo and enter an excessively high value for position
    Given there are validation rules
    When I enter an excessively high value for position
    Then there will be some errors
  
  Scenario: Create/Edit a Promo and enter a string value for position
    Given there are validation rules
    When I enter a string for position
    Then there will be some errors
    
    Scenario: Create/Edit a Promo and enter invalid dates
      Given there are validation rules
      When I enter end date that occurs before the start date
      Then there will be some errors
    
    Scenario: Create/Edit a Promo and enter a decimal value for position
      Given there are validation rules
      When I enter a decimal for position
      Then there will be some errors