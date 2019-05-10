Scenario: Render Image as ImagePath
  Given this input
  """
  {
    "name"      : "largeImageURL",
    "dataType"  : "text",
    "inputType" : "imagePath",
    "input" : {
      "value" : "https://www.sho.com/site/image-bin/images/1033342_1_0/1033342_1_0_prm-keyart_568x426.jpg"
    } 
  }
  """
  When I render it
  Then it has this structure
  """
  <div className="promo-form__input promo-form__input--text promo-form__input--image-path promo-form__input--large-image-url">
    <label htmlFor="largeImageURL">
      position
    </label>
    <input
      name="form__input"
      type="text"
      value="https://www.sho.com/site/image-bin/images/1033342_1_0/1033342_1_0_prm-keyart_568x426.jpg"
    />
    <div class="image-validator image-validator--success">
      <span class="image-validator__status">√</span> 
    </div>
  </div>
  """