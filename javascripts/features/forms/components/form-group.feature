Feature: Form Groups
  Scenario: Render Inline Form Group
    Given this input
    """
    {
      "name"  : "head",
      "inline": true
    }
    """
    When I render it
    Then it has these classnames
    """
    [
      "promo-form-group",
      "promo-form-group--head",
      "promo-form-group--inline"
    ]
    """
      