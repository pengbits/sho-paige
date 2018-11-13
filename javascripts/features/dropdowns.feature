Feature: Pre-configured Drop Down Boxes

  Scenario: Pre-configured Drop Down in CTA Type
    Given there is a configuration for ctaType dropdowns
     When the config is loaded
     Then the reducer will contain a list of dropdown options for ctaType