Feature: Form DataTypes
  Scenario: startDate has datetime dataType
    Given this input
    """
    {
      "name":"startDate",
      "dataType"  : "datetime",
      "inputType" : "text"
    }
    """
    When I render it
    Then it has this structure
