Feature: Start Date and End Date Flags in Promotions
  Scenario: Promotion is active
    Given there is a Promotion 
      And current datetime is '08-08-2018 15:00'
     When I apply these dates 'startDate:08-01-2018,endDate:09-01-2018'
     Then the Promotion is active
 
 Scenario: Promotion is active with no endDate
     Given there is a Promotion 
       And current datetime is '08-08-2018 15:00'
      When I apply this startDate '08-01-2018'
      Then the Promotion is active
     
  Scenario: Promotion is expired
    Given there is a Promotion 
      And current datetime is '08-15-2018 15:00'
     When I apply these dates 'startDate:08-01-2018,endDate:08-14-2018'
     Then the Promotion is expired
     
  Scenario: Promotion is upcoming
    Given there is a Promotion 
      And current datetime is '08-08-2018 15:00'
     When I apply these dates 'startDate:08-15-2018,endDate:09-15-2018'
     Then the Promotion is upcoming

  Scenario: Promotion is draft
    Given there is a Promotion 
      And Promotion is a draft
      And current datetime is '08-15-2018 15:00'
     When I apply these dates 'startDate:08-01-2018,endDate:08-14-2018'
     Then the Promotion is draft
  