Feature: Form Behaviors
  Scenario: Attach Video Metadata
    Given this input
    """
    {
      "name"      :"videoId",
      "dataType"  :"number",
      "inputType" :"text",
      "behavior"  :"attachVideoMeta"
    }
    """
    When I render it
    Then it adds some extra video metadata to the field
