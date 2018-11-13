Feature: Get Promos in Content Block Context
  Scenario: Populate PromoList
    Given there are Promos in the db
      And there are no Promos in the PromoList
      And the app context has been set
     When I load the promos endpoint
     Then the PromoList will contain some promos