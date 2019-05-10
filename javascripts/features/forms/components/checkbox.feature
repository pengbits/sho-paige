Feature: Form Types
  Scenario: Render SetDraftMode as Checkbox
    Given this input
    """
    {
      "name"      : "setDraftMode",
      "dataType"  : "boolean",
      "inputType" : "checkbox",
      "isChecked" : true,
      "input"     : {"name":"setDraftMode","value":true}
    }
    """
    When I render it
    Then it has this structure
    """
    <label>
      <Field
        checked
        component="input"
        defaultChecked
        name="setDraftMode"
        type="checkbox"
      />
      Draft Mode
    </label>
    """