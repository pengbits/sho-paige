Feature: Promo Details
  Scenario: Toggle Details Visibility
    Given the promo details are hidden
     When I toggle the promo details visibility
     Then the promo details will be visible
 
  Scenario: Show Details
    Given the promo details are hidden
     When I show the details
     Then the promo details will be visible
 
  Scenario: Hide Details
    Given the promo details are visible
     When I hide the details
     Then the promo details will be hidden