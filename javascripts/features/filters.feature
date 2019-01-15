Feature: Filters

  Scenario: Filter by Start Date
    Given there is a list of promos
     When I set the filter to 'startDate:1536764074000'
     Then the list of promos will only contain promos that start on or after '1536764074000' 
     And the list of promos will not be empty
             
  Scenario: Filter by Start and End Date
    Given there is a list of promos
     When I set the filter to 'startDate:1536353328000,endDate:1537455274000'
     Then the list of promos will only contain promos that start on or after '1536353328000' and end on or before '1537455274000'
      And the list of promos will not be empty

  Scenario: Filter by Invalid Date
    Given there is a list of promos
     When I set the filter to 'endDate:944070182' 
     Then the list of promos will be empty
 
  Scenario: Filter by Invalid Filter
    Given there is a list of promos
     When I set the filter to something that is not in the list of filter types
     Then an exception is thrown
 
  Scenario: Filter by Text
    Given there is a list of promos
     When I set the filter to 'text:noah'
     Then the list of promos will only contain promos that have 'noah' in the title
      And the list of promos will not be empty

   Scenario: Filter by Text and End Date
     Given there is a list of promos
      When I set the filter to 'text:preview,endDate:1537455274000'
      Then the list of promos will only contain promos that have 'preview' in the title and that end on or before '1537455274000'
       And the list of promos will not be empty
  
   Scenario: Filter by text and Find Nothing
     Given there is a list of promos
      When I set the filter to 'text:wibble'
      Then the list of promos will be empty