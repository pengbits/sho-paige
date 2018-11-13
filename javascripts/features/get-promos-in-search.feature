Feature: Get Promos in Search Context
  Scenario: Populate PromoList
    Given there are Promos in the db
      And there are no Promos in the PromoList
      And there is a search query
      And the app context has been set
     When I load the search endpoint
     Then the PromoList will contain some promos 

  Scenario: Promos do not match Search Context 
    Given there are Promos in the db
      And there are no Promos in the PromoList
      And there is a search query
      And the app context has been set
     When I load the search endpoint     
     Then the PromoList will be empty 