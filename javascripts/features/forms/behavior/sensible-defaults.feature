Feature: Sensible Defaults in Promo Form

  There are some cases where the inputs are always the same.
  By adding Sensible Defaults to the Promo Form we can pre-populate those values.  

  Scenario: Default Form Values
    Given the 'recaps' content-block is selected
      And there are sensible defaults defined for the 'recaps' content-block
     When I create a new promo
     Then I should see the following values in the form
      """
      {
       "ctaType"  : "other external link",
       "ctaLabel" : "READ MORE AT {title}"
      }
      """

  Scenario: Text Macro
    Given the 'recaps' content-block is selected
      And there are sensible defaults defined for the 'recaps' content-block
      And I enter these values
       """
       {
         "title" : "The Blogosphere"
       }
       """
     When I submit or move the focus to a different input
     Then I should see the following values in the form
       """
       {
        "ctaLabel" : "READ MORE AT The Blogosphere"
       }
       """
