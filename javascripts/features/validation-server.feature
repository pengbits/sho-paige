Feature: Back-End Form Validation

  Scenario: Create/Edit a Promo with excessively long values for some fields
    Given there is a promo with a very long `smallImageURL`
    When I submit
    Then the server will return an error
  
  Scenario: Create/Edit a Promo with negative ids
    Given there is a promo with negative values for `seriesId`,`seasonNumber` and `showId`
    When I submit
    Then the server will return an error