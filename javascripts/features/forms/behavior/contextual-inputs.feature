Feature: Contextual Inputs in Promo Form

  Contextual Inputs offers the ability to render a specific subset of inputs into the Promo Form.
  Because sometimes you are only concerned with a handful of inputs.

  Scenario: Contextual Inputs for Content Block
    Given there are custom inputs defined for the 'Email Module' content-block
     When I create a new promo
     Then the form will have this structure
     """
      [{
        "name"      : "name",
        "inputType" : "text",
        "validate"  : {'required':true, 'maxLength':200}
      },{
        "name"      : "startDate",
        "dataType"  : "datetime",
        "inputType" : "datetime",
        "validate"  : {'validForEndDate': true }
      },{
        "name"      : "endDate",
        "dataType"  : "datetime",
        "inputType" : "datetime",
        "validate"  : {'validForStartDate': true }
      },{
        "name"      : "title",
        "inputType" : "text",
        "validate"  : {'required':true, 'maxLength':200}
      }]
    """