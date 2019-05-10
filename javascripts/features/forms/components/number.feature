# type should be number for html5 number input,
# but we are not making that change yet as it creates styling issues
Feature: Form Types
  Scenario: Render Position as Number
    Given this input
    """
    {
      "name"      : "position",
      "dataType"  : "number",
      "inputType" : "number"
    }
    """
    When I render it
    Then it has this structure
    """
    <div className="promo-form__input promo-form__input--number promo-form__input--position">
      <label htmlFor="position">
        position
      </label>
      <input
        name="position"
        size="4"
        type="text"
        value=""
      />
    </div>
    """