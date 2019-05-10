Feature: Form Types
  Scenario: Render startDate as DateTimeInput
    Given this input
    """
    {
      "name"      : "startDate",
      "dataType"  : "datetime",
      "inputType" : "datetime",
      "input"     : { 
        "name"  : "startDate",
        "value" : 1536591274000
      }
    }
    """
    When I render it
    Then it has these classnames
    """
    [
      "promo-form__input",
      "promo-form__input--datetime",
      "promo-form__input--start-date"
    ]
    """
    And it has this structure