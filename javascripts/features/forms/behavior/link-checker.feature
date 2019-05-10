Feature: Form Behaviors
  Scenario: Check Link
    Given this input
    """
    {
      "name":"largeImageURL",
      "dataType"  : "text",
      "inputType" : "text",
      "behavior"  : "linkChecker"
    }
    """
    When I render it
    Then it ensures that the url does not 404
