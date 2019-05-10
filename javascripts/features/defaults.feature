Feature: Defaults

  Scenario: Create/Edit a Promo and enter an end date without a time
    Given there are sensible defaults defined
    When I open the endDate picker
     And no datetime has been set
    When I enter an end date without a time
    When I close the endDate picker
    Then the time will be 11:59pm