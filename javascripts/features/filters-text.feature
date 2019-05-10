Feature: Filter by Text
  Scenario: Filter by Invalid Filter
    Given there is a list of promos
     When I set the filter to something that is not in the list of filter types
     Then an exception is thrown
 
  Scenario: Filter by Text
    Given there is a list of promos
     When I set the filter to 'text:noah'
     Then the list of promos will only contain promos that have 'noah' in the title
      And the list of promos will not be empty
  
   Scenario: Filter by text and Find Nothing
     Given there is a list of promos
      When I set the filter to 'text:wibble'
      Then the list of promos will be empty