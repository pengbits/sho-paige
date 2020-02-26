Feature: Paginate Promos in Search Context
  Background: 
    Given I am conducting a search
    
  Scenario: The PromoList displays the correct promos for the first page
    Given there are promos in the PromoList
     When the currentSelectedPage is not set and default value is used
     Then promos for the range 0...9 will be visible
 
 Scenario: The PromoList displays the correct promos for the second page
   Given there are promos in the PromoList
    When the currentSelectedPage is set to 2
    Then promos for the range 10...19 will be visible

  Scenario: The number of pagination pages will be set based on the size of the response
    Given there are promos in the PromoList
      And the search response has a size property greater than 0 
     Then a corresponding number of pagination pages (totalResponsePages) will be set

  Scenario: The paginatedList displays promos that correspond to the currentSelectedPage
    Given the PromoList contains more than 10 promos
      And the currentSelectedPage is set
     When a new currentSelectedPage is selected
     Then the paginatedList will display up to 10 promos that correspond to the new currentSelectedPage

  Scenario: There are more pages of results than are initially visible
    Given there is a full page of promos in the PromoList 
      And the currentSelectedPage is set
      And the search response points to a nextPage of promos
     When I select a currentSelectedPage outside the visible range
     Then the next page number to fetch will be different from the last page number that was returned from the server
     Then the search api will be called to fetch the next page
     
  Scenario: Paginated search results with filter applied page 1
    Given there are promos in the PromoList
     When the currentSelectedPage is set to 1
      And I set the filter to 'text:bacon'
     Then only promos from the range 0...9 that have 'bacon' in the title will be visible
     
   Scenario: Paginated search results with filter applied page 2
     Given there are promos in the PromoList
      When the currentSelectedPage is set to 2
       And I set the filter to 'text:bacon'
      Then only promos from the range 10...19 that have 'bacon' in the title will be visible
  
   Scenario: Pagination is not needed when there are less than ten results
     Given there are ten items or less in the PromoList
       And the currentSelectedPage is set
      Then shouldPaginate will be false
  
  Scenario: Filters are reset when page changes
    Given there are promos in the PromoList
      And the filter and currentSelectedPage are set
     When I change the currentSelectedPage
     Then the filtered paginated list is refreshed
  