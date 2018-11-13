Feature: Delete a Promo
  Scenario: Delete a Promo from PromoList
    Given there is a list of Promos
    When I select a promo 
    When I select "delete" from actions
    Then the list does not contain my promo

  Scenario: Delete a Promo from PromoDetails
    Given there is a Promo in PromoDetails
    When I select "delete" from actions
    Then the PromoDetails is empty  
    And the list does not contain my promo