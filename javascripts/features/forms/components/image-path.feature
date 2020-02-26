Feature: Form Types
  Scenario: Render Image as ImagePath
  Given this input
  """
  {
    "name"      : "largeImageURL",
    "dataType"  : "text",
    "inputType" : "imagePath",
    "input" : {
      "name"  : "largeImageURL",
      "value" : "https://www.sho.com/site/image-bin/images/1033342_1_0/1033342_1_0_prm-keyart_568x426.jpg"
    } 
  }
  """
  When I render it
  Then it has this structure
  """
  <div className="promo-form__input promo-form__input--image-path promo-form__input--text promo-form__input--large-image-url">
    <label htmlFor="largeImageURL">
      largeImageURL
    </label>
    <input
      name="largeImageURL"
      type="text"
      value="https://www.sho.com/site/image-bin/images/1033342_1_0/1033342_1_0_prm-keyart_568x426.jpg"
    />
    <span className="promo-form__image-actions">
      <Connect(ImageHunter) name="largeImageURL" />
      <ImagePreview
        error={undefined}
        imagePathStatus={null}
        src="https://www.sho.com/site/image-bin/images/1033342_1_0/1033342_1_0_prm-keyart_568x426.jpg"
      />
      <ImagePathValidator
        error={undefined}
        imagePathStatus={null}
      />
    </span>
  </div>
  """