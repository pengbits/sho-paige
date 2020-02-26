// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';
import moment from 'moment'
import { change} from 'redux-form'

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import updatePromoMock from '../mocks/updatePromo'
import contentBlockMock from '../mocks/getContentBlock'

import datetimesReducer, {
  openPicker, OPEN_PICKER,
  closePicker, CLOSE_PICKER,
  setDateTime, SET_DATETIME
} from '../redux/datetimes'

import rootReducer from '../redux'


// validation rules, which'll be applied to form
import {default as FormConfig} from '../components/form-configs'
import {getRules, getValidator} from '../utils/validation'

// models
import Promo from '../models/Promo'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/defaults.feature'), test => {  
  
  let rules
  let store
  let beforeState
  let afterState
  let selectedPicker
  let expectedEndDateTime

  const initialState = rootReducer()
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });
  store = mockStore({...initialState})

  test('Create/Edit a Promo and enter an end date without a time', ({ given, when, then, pending }) => {
    given('there are sensible defaults defined', () => {
      rules = {
        //today at 12:00am
        startDate: {
          date: new Date(), 
          hour: 0,
          minute: 0 
        },
        //today at 11:59pm
        endDate: {
          date: new Date(), 
          hour: 23, 
          minute: 59 
        }
      }

      selectedPicker      = "endDate"
      
      //Create a 'datetime moment' based on the given rules and selected picker
      expectedEndDateTime = moment(rules[selectedPicker].date).hour(rules[selectedPicker].hour).minute(rules[selectedPicker].minute)

    });

    when(/^I open the (.+) picker$/, (name) => {
      store.dispatch(openPicker({name}))
      afterState = resultingState(store, rootReducer, store.getState())
      expect(afterState.datetimes.endDate.isOpen).toBe(true)
    })
    
    when('no datetime has been set', () => {
      expect(afterState.form.promo).toBe(undefined)
    })

    when('I enter an end date without a time', () => {
      //since setting a date is dependent on the # of days in the current month, 
      //let's just assume it's February so a number like 31 doesn't mess up our tests
      const randomDate = Math.floor(Math.random() * 28) + 1 
      const selectedPickerDefaultDatetime = afterState.datetimes[selectedPicker].defaultDateTime
      const selectDate = selectedPickerDefaultDatetime.date(randomDate)
      //user selects a date but doesn't select time and triggers a @@redux-form action 'CHANGE'
      store.dispatch(change('promo', selectedPicker, {payload:selectDate} ))
    });

    when(/^I close the (.+) picker$/, (name) => {
      store.dispatch(closePicker({name}))
      afterState = resultingState(store, rootReducer, store.getState())
      expect(afterState.datetimes.endDate.isOpen).toBe(false)
    })

    then('the time will be 11:59pm',() => {
      afterState = resultingState(store, rootReducer, store.getState())
      expect(afterState.form.promo.values.endDate.payload.hour()).toEqual(expectedEndDateTime.hour())
      expect(afterState.form.promo.values.endDate.payload.minutes()).toEqual(expectedEndDateTime.minutes())
    });
  });


  // test('Create/Edit a Promo and omit some Required Fields', ({ given, when, then, pending }) => {
  //   given('there are validation rules', given_there_are_validation_rules)
  // 
  //   when('I enter some of the required fields', () => {
  //     attrs =  {
  //       'name':'the affair 501 teaser'
  //     }
  //   });
  // 
  //   then('there will be some errors', () => {
  //     const errors  = validator(attrs)
  //     expect(errors.title).toEqual('title can\'t be blank')
  //   });
  // });

  
  // test('Create/Edit a Promo and enter invalid dates', ({ given, when, then, pending }) => {
  //   given('there are validation rules', given_there_are_validation_rules)
  // 
  //   when('I enter end date that occurs before the start date', () => {
  //     attrs = {
  //       'name':'the chi 301 thai combo',
  //       'title':'The Chi First Look Pad Key Mow',
  //       'startDate': Promo.parseDate('10-15-2018'),
  //       'endDate'  : Promo.parseDate('10-01-2018')
  //       // works with times too
  //       // 'startDate': Promo.parseDate('10-01-2018T09:00.000'),
  //       // 'endDate'  : Promo.parseDate('10-01-2018T07:00.000')
  //     }
  //   });
  // 
  //   then('there will be some errors', () => {
  //     const errors  = validator(attrs)     
  //     expect(errors.endDate).toEqual('the endDate must come after the startDate')
  //   })
  // })
  
})



