Feature: Filter by Text and Date
  Scenario: Filter by Text and End Date
    Given there is a list of promos
     When I set the filter to 'text:preview,endDate:01-18-2019'
     Then the list of promos will only contain promos that are in window for the endDate and that have the text in a searchable property 
      And the list of promos will not be empty

