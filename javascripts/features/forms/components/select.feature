Feature: Form Types
Scenario: Render CtaType as Select
  Given this input
  """
  {
    "name"      : "ctaType",
    "dataType"  : "text",
    "inputType" : "select",
    "options"   : ["Trailer","Next On","Preview Scene A","Preview Scene B","BTS","Season Promo","Full Episode","Webisodes","Other Video","Series Site","Episode Guide","Product Page","Facebook","Twitter","Apps","Games","EST","Store","Order"]
  }
  """
  When I render it
  Then it has this structure
  """
  <div className="promo-form__input promo-form__input--select promo-form__input--text promo-form__input--cta-type">
    <label htmlFor="ctaType">
      ctaType
    </label>
    <Field
      component="select"
      name="ctaType"
    >
      <option>
        choose one
      </option>
      <option value="Trailer">
        Trailer
      </option>
      <option value="Next On">
        Next On
      </option>
      <option value="Preview Scene A">
        Preview Scene A
      </option>
      <option value="Preview Scene B">
        Preview Scene B
      </option>
      <option value="BTS">
        BTS
      </option>
      <option value="Season Promo">
        Season Promo
      </option>
      <option value="Full Episode">
        Full Episode
      </option>
      <option value="Webisodes">
        Webisodes
      </option>
      <option value="Other Video">
        Other Video
      </option>
      <option value="Series Site">
        Series Site
      </option>
      <option value="Episode Guide">
        Episode Guide
      </option>
      <option value="Product Page">
        Product Page
      </option>
      <option value="Facebook">
        Facebook
      </option>
      <option value="Twitter">
        Twitter
      </option>
      <option value="Apps">
        Apps
      </option>
      <option value="Games">
        Games
      </option>
      <option value="EST">
        EST
      </option>
      <option value="Store">
        Store
      </option>
      <option value="Order">
        Order
      </option>
    </Field>
  </div>
  """