Feature: Filter by Dates

  Scenario: Filter by Start Date
    Given these promos
      | startDate  | endDate     | name                        |
      | 01-01-2019 | 01-15-2019  | apples the affair teaser    |
      | 01-05-2019 | 01-20-2019  | bananas the affair teaser   |
      | 01-10-2019 | 01-12-2019  | cherries the affair teaser  |
      | 01-17-2019 | 01-28-2019  | zuccini the affair teaser   |

     When I set the filter to 'startDate:01-14-2019'
     Then the list of promos will only contain promos with a window that contain the startDate or with a window in the future of it
     And the list of promos will not be empty
 
 Scenario: Filter by End Date
   Given these promos
     | startDate  | endDate     | name                        |
     | 01-01-2019 | 01-15-2019  | apples the affair teaser    |
     | 01-05-2019 | 01-20-2019  | bananas the affair teaser   |
     | 01-10-2019 | 01-12-2019  | cherries the affair teaser  |
     | 01-17-2019 | 01-28-2019  | zuccini the affair teaser   |

    When I set the filter to 'endDate:01-16-2019'
    Then the list of promos will only contain promos with a window that contain the endDate or with a window in the past of it
    And the list of promos will not be empty
    
  
  Scenario: Filter by Start and End Date
    Given these promos
      | startDate  | endDate     | name                        |
      | 01-01-2019 | 01-15-2019  | apples the affair teaser    |
      | 01-05-2019 | 01-20-2019  | bananas the affair teaser   |
      | 01-10-2019 | 01-12-2019  | cherries the affair teaser  |
      | 01-23-2019 | 01-01-2019  | grapes the affair teaser    |
      | 01-24-2019 | 01-30-2019  | oranges the affair teaser   |

     When I set the filter to 'startDate:01-14-2019,endDate:01-22-2019'
     Then the list of promos will only contain promos matching this criteria
     """
      ("promos that start before or on the end-date" AND "don't end before the start-date"), 
      "OR",
      ("promos that end after or on the start-date" AND "don't start after the end-date")
     """
     And the list of promos will not be empty
     
  Scenario: Default Filter
    Given these promos
      | startDate  | endDate     | name                        |
      | 01-01-2019 | 01-15-2019  | apples the affair teaser    |
      | 01-05-2019 | 01-20-2019  | bananas the affair teaser   |
      | 04-10-2019 | 06-12-2019  | cherries the affair teaser  |
      | 04-23-2019 | 06-01-2019  | grapes the affair teaser    |
      | 04-24-2019 | 06-30-2019  | oranges the affair teaser   |
     And the filter type has not been set
     And the date is '03-01-2019'
    When the promo-list renders
    Then the default filter is used 'startDate:moment(new Date())'
    Then the list of promos will only contain promos that are in window for 'startDate:moment(new Date())'
     And the list of promos will not be empty