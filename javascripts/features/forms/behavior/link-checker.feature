Feature: Form Behaviors
  Scenario: Image Link Success
    Given there is a 'largeImageURL' registered in the form
    When I enter a value for 'largeImageUrl' that is a valid image path (will not 404)
     And I blur the input
    Then a placeholder image will be rendered
     And it will load

  Scenario: Image Link Failure
    Given there is a 'largeImageURL' registered in the form
    When I enter a value for 'largeImageUrl' that is an invalid image path (will 404)
     And I blur the input
     Then a placeholder image will be rendered
     And there will be an error