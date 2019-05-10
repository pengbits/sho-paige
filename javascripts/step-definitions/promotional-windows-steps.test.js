import moxios from 'moxios'
import moment from 'moment'

import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import getContentBlock from '../mocks/getContentBlock'

// reducers
import reducer from '../redux/promos'
import {setAttributes} from '../redux/promos/actions'
 
// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo, {
  DISPLAY_DATE_FORMAT, 
  UNIX_MILLISECOND_TIMESTAMP_FORMAT
} from '../models/Promo'

import {trace} from '../step-definition-utils'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/promotional-windows.feature'
), test => {
  
  let beforeState
  let afterState
  let store
  let current
  let promo
  
  const initialState = reducer()
  
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });

  const given_there_is_a_promotion = () => {
    const details = getContentBlock.payload.promotionList[0]
    store         = mockStore({...initialState, details})
    beforeState   = resultingState(store, reducer, store.getState())
    expect(beforeState.details).toBeTruthy()
  }
  
  const given_current_datetime_is = (dateStr) => {
    current = Promo.parseDate(dateStr) 
  }

  const given_promotion_is_a_draft = () => {
    beforeState.details.isDraft = true; 
  }
  
  const when_i_apply_these_dates = (startDateStr,endDateStr) => {
    // pull promo attributes from state
    let edit = {...beforeState.details}
    // convert formatted date strings to timestamps,
    // pass them into the attributes hash
    if(!!startDateStr) edit.startDate = moment(startDateStr, DISPLAY_DATE_FORMAT).format(UNIX_MILLISECOND_TIMESTAMP_FORMAT)
    if(!!endDateStr)   edit.endDate   = moment(endDateStr,   DISPLAY_DATE_FORMAT).format(UNIX_MILLISECOND_TIMESTAMP_FORMAT)
    
    // apply the  edits to the details w/ setAttributes
    // strictly speaking, this is not required, we could just assert directly against a model instance,
    // but this is more in line with other tests..
    store.dispatch(setAttributes(edit))
    afterState = resultingState(store, reducer, store.getState())
  }
  
  test('Promotion is active', ({ given, when, then}) => {
    given('there is a Promotion',         given_there_is_a_promotion)
    given(/^current datetime is '(.+)'$/, given_current_datetime_is)
    when(/^I apply these dates 'startDate:(.+),endDate:(.+)'$/, when_i_apply_these_dates)
    
    then('the Promotion is active', () => {
      promo = Promo.fromAttributes(afterState.details)
      // console.log('active? ' +promo.window({dateTime: current}).active)
      expect(promo.window({dateTime: current}).active).toEqual(true)
    })
  })
  
  test('Promotion is active with no endDate', ({ given, when, then }) => {
    given('there is a Promotion',         given_there_is_a_promotion)
    given(/^current datetime is '(.+)'$/, given_current_datetime_is)
    when(/^I apply this startDate '(.+)'$/, when_i_apply_these_dates)
    
    then('the Promotion is active', () => {
      const {'endDate': deletedKey, ...attrs} = afterState.details
      promo = Promo.fromAttributes(attrs)
      // console.log('active? ' +promo.window({dateTime: current}).active)
      expect(promo.window({dateTime: current}).active).toEqual(true)
    })
  });

  
  test('Promotion is expired', ({ given, when, then}) => {
    given('there is a Promotion',         given_there_is_a_promotion)
    given(/^current datetime is '(.+)'$/, given_current_datetime_is)
    when(/^I apply these dates 'startDate:(.+),endDate:(.+)'$/, when_i_apply_these_dates)

    then('the Promotion is expired', () => {
      promo = Promo.fromAttributes(afterState.details)
      expect(promo.window({dateTime: current}).expired).toEqual(true)
    })
  })
  
  test('Promotion is upcoming', ({ given, when, then}) => {
    given('there is a Promotion',         given_there_is_a_promotion)
    given(/^current datetime is '(.+)'$/, given_current_datetime_is)
    when(/^I apply these dates 'startDate:(.+),endDate:(.+)'$/, when_i_apply_these_dates)

    then('the Promotion is upcoming', () => {
      promo = Promo.fromAttributes(afterState.details)
      expect(promo.window({dateTime: current}).upcoming).toEqual(true)
    })
  })
   
  test('Promotion is draft', ({ given, when, then}) => {
    given('there is a Promotion',         given_there_is_a_promotion)    
    given ('Promotion is a draft', given_promotion_is_a_draft)
    given(/^current datetime is '(.+)'$/, given_current_datetime_is)
    when(/^I apply these dates 'startDate:(.+),endDate:(.+)'$/, when_i_apply_these_dates)

    then('the Promotion is draft', () => {
      promo = Promo.fromAttributes(afterState.details)
      expect(promo.window({dateTime: current}).draft).toEqual(true)
    })
  })

})