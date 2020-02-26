Feature: Copy Promo to Section
  Scenario: Copy Cross-Promotional Sampler Tile to a Different Series
    Given there is a list of Promos 
      And the app context has been set
      And there is a Content Block selected
      And the promo details are blank  
     When I select a promo
      And I select 'copy to section' from actions
      And I submit
     Then There will be a fetch of the contexts endpoint
     When It loads
     Then there is a list of contexts
     When I select a context
      And It loads
     Then There will be a list of content-blocks
     When I select a content-block
     Then the application state changes to reflect my selection
      And the selected promo is saved to the destination
      And it does not appear in the promo-list in the original context
      And the browser is redirected to the destination
     When I visit the destination
     Then the list of promos will contain the new addition
      And it will be highlighted
      
   Scenario: Copy Promo to Section but cancel in the middle
     Given I am copying a promo to a content-block
       And I close the list of destinations without making a selection
      Then the application will revert to the previous state
