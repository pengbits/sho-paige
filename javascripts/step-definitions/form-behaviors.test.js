import moment from 'moment'
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import FormDefaultsMock from '../mocks/formDefaultsConfig'
const {FORM_DEFAULTS}  = FormDefaultsMock
const {CONTENT_BLOCKS} = FORM_DEFAULTS

// reducers
import rootReducer    from '../redux'
import {initialState} from '../redux/promos/reducers'
import {newPromo}     from '../redux/promos/actions'
import {setDefaults, SET_DEFAULTS} from '../redux/form-defaults'
import {NEW_PROMO}    from '../redux/promos/types'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'
import {trace} from '../step-definition-utils'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/forms/behavior/sensible-defaults.feature'
), test => {
  
  let store, 
  beforeState, 
  afterState,
  values
  ;
  
  const given_the_content_block_is_selected = (contentBlockName) => {
    store = mockStore(rootReducer({
      ...initialState,
      contentBlock: {
        name: 'Recaps',
        id: 1,
        contentBlockKey: '212-recaps',
        contextId: 212,
        createdDate: 1532977810000,
        updatedDate: 1532968789600
      }
    }))
    beforeState = resultingState(store, rootReducer, store.getState())
  }
  
  const given_there_are_sensible_defaults = (key) => {
    const defaults = CONTENT_BLOCKS[key] // 'recaps'
    store.dispatch(setDefaults({key, defaults}))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.formDefaults[key]).toBeTruthy()
  }
  
  test('Default Form Values', ({ given, when, then, pending }) => {
    given(/^the \'(.+)\' content-block is selected$/, given_the_content_block_is_selected)
    given(/^there are sensible defaults defined for the \'(.+)\' content-block$/, given_there_are_sensible_defaults)
    when('I create a new promo', () => {
      beforeState = {...afterState}
      store.dispatch(newPromo())
      afterState = resultingState(store, rootReducer, beforeState)
    })
    
    then('I should see the following values in the form', (json) => {
      values = JSON.parse(json)
      expectActions(store, [SET_DEFAULTS, NEW_PROMO])
      // there is no way to test the form state without dispatching a bunch of redux-form actions
    })
  });

  test('Text Macro', ({ given, when, then, pending }) => {
    given(/^the \'(.+)\' content-block is selected$/, given_the_content_block_is_selected)
    given('there are sensible defaults defined for the \'recaps\' content-block', () => {})
    given('I enter these values', (attrs) => {})
    when('I submit or move the focus to a different input', () => {})
    then('I should see the following values in the form', (attrs) => {})
  });

})