Feature: Form DataTypes
  Scenario: Position has text dataType
    Given this input
    """
    {
      "name":"position",
      "dataType"  : "text",
      "inputType" : "text"
    }
    """
    When I render it
    Then it has this structure
