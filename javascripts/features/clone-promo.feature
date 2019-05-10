Feature: Clone a Promo
  Scenario: Clone a Promo
    Given there is a list of Promos
    When I clone a promo
    When I submit 
    Then the list contains a copy of the promo with '(Copy 1)' in the name

  Scenario: Clone a Promo with Offset Duration Ray Next-Ons
    Given there is a promo with these attributes 
      """
      {    "name" : "Ray Donovan 304 Next On",
      "startDate" : "10-12-2018 10:00 PM",
        "endDate" : "10-19-2018 09:55 PM" }
      """
      When I clone it with 'offset-duration=true'
      Then the clone will have these attributes
      """
      { "startDate" : "10-19-2018 10:00 PM",
          "endDate" : "10-26-2018 09:55 PM" }
      """
      
  Scenario: Cloning a Promo with Offset Duration is not allowed without Start and End Dates
    Given there is a list of Promos
    When I clone a promo with 'offset-duration=true'
     And the promo does not have a start and end date
    When I submit  
    Then there will be an error

  Scenario: Clone a Promo Multiple Times
    Given there is a list of Promos
    When I clone a promo once 
    When I submit once
    When I clone a promo twice
    When I submit twice
    When I clone a promo three times
    When I submit three times
    Then the list contains a copy of the promo with '(Copy 3)' in the name

