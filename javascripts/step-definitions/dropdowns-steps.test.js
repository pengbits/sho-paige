import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import window_obj from '../mocks/ctaTypeDropDownsMock'


// reducers
import reducer, {
  setConfig
} from '../redux/configs'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

defineFeature(loadFeature(PAIGE_ROOT + '/features/dropdowns.feature'), test => {
  let beforeState
  let afterState
  let store
  let dropdowns = window_obj.paige.configs.CTA_TYPE_DROPDOWNS;
  
  test('Pre-configured Drop Down in CTA Type', ({ given, when, then, pending }) => {
    given('there is a configuration for ctaType dropdowns', () => {
      expect(dropdowns.length).toBeGreaterThan(0)
    })
    
    when('the config is loaded', () => {
      store = mockStore(reducer())
      store.dispatch(setConfig({
        'CTA_TYPE_DROPDOWNS':dropdowns
      }))
      afterState = resultingState(store, reducer)
    })

    then('the reducer will contain a list of dropdown options for ctaType', () => {
      expect(afterState.CTA_TYPE_DROPDOWNS).toEqual(dropdowns)
    
    })
    
  })
})
