Feature: Form Types
  Scenario: Render Description as TextArea
    Given this input
    """
    {
      "name"      : "description",
      "dataType"  : "text",
      "inputType" : "textArea"
    }
    """
    When I render it
    Then it has this structure
    """
    <div className="promo-form__input promo-form__input--text-area promo-form__input--text promo-form__input--description">
      <label htmlFor="description">
        description
      </label>
      <textarea
        name="description"
        rows={5}
        value=""
      />
    </div>
    """