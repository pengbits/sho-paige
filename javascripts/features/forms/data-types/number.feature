Feature: Form DataTypes
  Scenario: Position has Number dataType 
    Given this input
    """
    {
      "name":"position",
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