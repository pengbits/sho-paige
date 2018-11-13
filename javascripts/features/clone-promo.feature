Feature: Clone a Promo
  Scenario: Clone a Promo
    Given there is a list of Promos
    When I clone a promo
    When I submit 
    Then the list contains a copy of the promo with '(Copy)' in the name

  Scenario: Clone a Promo with Offset Duration
    Given there is a list of Promos
    When I clone a promo with 'offset-duration=true'
    When I submit  
    Then the list contains a copy of the promo with '(Copy)' in the title and the offset duration