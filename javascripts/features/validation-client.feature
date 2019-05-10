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
     And non-alphanumeric characters are forbidden
    When I enter forbidden characters
    Then there will be some errors
  
  Scenario: Create/Edit a Promo and enter non-numeric values for ids 
    Given there are validation rules
     And ids must be numbers
    When I enter forbidden characters
    Then there will be some errors
    
  Scenario: Create/Edit a Promo and enter an excessively high value for some fields
    Given there are validation rules
    When I enter an excessively high value for position and seasonNumber
    Then there will be some errors

  Scenario: Create/Edit a Promo with excessively long values for some fields
    Given there are validation rules
    When I enter an excessively long string for smallImageUrl
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
  
  Scenario: Create/Edit a Promo with negative ids
    Given there are validation rules
    When I enter negative values for seriesId, seasonNumber and showId
    Then there will be some errors
    
  Scenario: Validate by DataType
    Given there are validation rules for 'dataType' strategy
    When I enter a string for position
    Then there will be some errors