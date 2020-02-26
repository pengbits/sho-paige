Feature: Form Types
  Scenario: Render Position as Text
    Given this input
    """
    {
      "name"      : "position",
      "dataType"  : "text",
      "inputType" : "text"
    }
    """
    When I render it
    Then it has this structure
    """
    <div className="promo-form__input promo-form__input--text promo-form__input--position">
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
    
  Scenario: Render largeImageURL as Text
    Given this input
    """
    {
      "name"      : "largeImageURL",
      "dataType"  : "imagePath",
      "inputType" : "text"
    }
    """
    When I render it
    Then it has this structure
    """
    <div className="promo-form__input promo-form__input--text promo-form__input--image-path promo-form__input--large-image-url">
      <label htmlFor="largeImageURL">
        large image url
      </label>
      <input
        name="largeImageURL"
        type="text"
        value=""
      />
    </div>
    """
    
  Scenario: Render Name as Text (Inline)
    Given this input
    """
    {
      "name"      : "name",
      "dataType"  : "text",
      "inputType" : "text",
      "inline"    : true,
      "required"  : true
    }
    """
    When I render it
    Then it has this structure
    """
    <div className="promo-form__input promo-form__input--text promo-form__input--name">
      <input
        name="name"
        placeholder="Required"
        required
        type="text"
        value=""
      />
    </div>
    """
  