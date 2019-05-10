Feature: Sort
  Scenario: Sort by Name
    Given there is a list of promos
    When I set the sort type to "name"
    Then the response will contain promos sorted alphabetically by "name" 

  Scenario: Sort by Context
    Given there is a list of promos
    When I set the sort type to "context"
    Then the response will contain promos sorted alphabetically by "context"  

  Scenario:  Default Sort
    Given the sort type has not been set
    When I load the promos endpoint
    Then the PromoList will contain some promos
     And the promos will be sorted numerically by "position" in descending order

  Scenario:  Sort by Position Descending
    Given there is a list of promos
    When I set the sort type to "position" and order to "descending"
    Then the promos will be sorted numerically by "position" in descending order

  Scenario: Sort by Start Date
    Given there is a list of promos 
    When I set the sort type to "startDate"
    Then the response will contain chronologically by "startDate" in ascending order

  Scenario: Sort by Start Date Descending 
    Given there is a list of promos
    When I set the sort type to "startDate" and order to "descending"
    Then the response will contain chronologically by "startDate" in descending order

  Scenario: Sort by End Date 
    Given there is a list of promos 
    When I set the sort type to "endDate"
    Then the response will contain chronologically by "endDate" in ascending order

  Scenario: Sort by End Date Descending     
    Given there is a list of promos
    When I set the sort type to "endDate" and order to "descending"
    Then the response will contain chronologically by "endDate" in descending order
    
  Scenario: Sort by name Descending, then Ascending
    Given there is a list of promos
     When I set the sort type to "name"
     Then the response will contain promos sorted alphabetically by "name" in descending order
     When I set the sort type to "name" again 
     Then the response will contain promos sorted alphabetically by "name" in ascending order