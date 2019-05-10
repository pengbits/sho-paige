
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { 
  expectActions, 
  resultingState, 
  respondWithMockResponse
} from '../mockStore'
import {
  smallImageUrlErrorXhrResponse, 
  negativeIdErrorsXhrResponse
} from '../mocks/createPromoServerError'

// reducers
import reducer from '../redux/promos'
import {setAttributes, createPromo}   from '../redux/promos/actions'
import {SET_ATTRIBUTES, CREATE_PROMO} from '../redux/promos/types'

import rootReducer from '../redux'

// models
import Promo from '../models/Promo'

// utils
import {camelize} from '../utils/string'

// validation 
import {fieldnamesContainedInErrorMessages} from '../utils/validation-server'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';


// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/validation-server.feature'), test => {  
  let beforeState
  let afterState
  let store
  let attrs
  let exception
  let errors
  
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });

  test('Create/Edit a Promo with excessively long values for some fields', ({ given, when, then, pending }) => {
    given('there is a promo with a very long `smallImageURL`', () => {
      let blah = '',i; for(i=0;i<151;i++){ blah += 'x' }
      attrs = {
        'title' :'A Mischievous Promo',
        'name'  :'A Mischievous Promo',
        'weight':600,
        'smallImageUrl' : blah
      }
      
      beforeState = rootReducer({}, setAttributes(attrs))
    });

    when('I submit', () => {
      respondWithMockResponse(moxios, smallImageUrlErrorXhrResponse)
      
      store = mockStore(beforeState)
      return store.dispatch(createPromo(attrs))
       .then(() => afterState = resultingState(store, rootReducer, beforeState))
       .catch((e) => exception = e)
    })
    
    then('the server will return an error', () => {
      const {detailsError} = afterState.promos
      expect(detailsError).toBeTruthy()
      expect(detailsError.message).toEqual('422 Unprocessable Entity')
      expect(detailsError.map.smallImageUrl).toBeTruthy()
      expect(detailsError.map.smallImageUrl).toContain('length exceeded')
    });
  })

  test('Create/Edit a Promo with negative ids', ({ given, when, then }) => {
    given('there is a promo with negative values for `seriesId`,`seasonNumber` and `showId`', () => {
      attrs = {
        'title'    : 'A Mischievous Promo',
        'name'     : 'A Mischievous Promo',
        'seriesId' : -1,
        'seasonNumber' : -1,
        'showId'   : -1
      }
    });

    when('I submit', () => {
      respondWithMockResponse(moxios, negativeIdErrorsXhrResponse)
      
      store = mockStore(beforeState)
      return store.dispatch(createPromo(attrs))
        .then(() => afterState = resultingState(store, rootReducer, beforeState))
        .catch((e) => exception = e)
    })

    then('the server will return an error', () => {
      const {detailsError} = afterState.promos
      expect(detailsError).toBeTruthy()
      expect(detailsError.map).toEqual({ 
        seriesId: 'Series ID can only be positive.',
        seasonNumber: 'Season number can only be positive.',
        showId: 'Show ID can only be positive.' 
      })
    })
  })
})