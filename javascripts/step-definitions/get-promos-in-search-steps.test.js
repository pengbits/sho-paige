import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'

// replace with search query mock!
import getContentBlockMock from '../mocks/getContentBlock'
import searchQueryMock from '../mocks/searchQueryMock'

// reducers
import rootReducer from '../redux'
import reducer from '../redux/promos/reducers'
import {getPromos} from '../redux/promos/actions'
import * as types from '../redux/promos/types'
import appReducer, { setContext, SEARCH_CONTEXT } from '../redux/app'
import {APPLY_SORT } from '../redux/sort'
import {SET_TOTAL_RESPONSE_PAGES, SET_RESPONSE_SIZE} from '../redux/pagination'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import {SEARCHABLE_PROPERTIES} from '../models/Promo'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/get-promos-in-search.feature'
), test => {
  
  beforeEach(function(){ moxios.install()  ; })
   afterEach(function(){ moxios.uninstall(); })
  
  let store
  let beforeState
  let afterState
  let query
 
  
  test('Populate PromoList', ({ given, when, then }) => {
    given('there are Promos in the db', () => {}) // nothing to do

    given('there are no Promos in the PromoList', () => {
      store = mockStore(rootReducer())
      beforeState = store.getState() 
      expect(beforeState.promos.list).toHaveLength(0)
    })
    
    given('there is a search query', () => {
      // this is just passed into the store because thats 
      // how it works in the browser context - we could make action creators
      // and test with store.dispatch, but haven't had a need to do so
      query = 'affair' 
      store = mockStore(rootReducer({search:{query}}))
      beforeState = resultingState(store, rootReducer, store.getState())
      expect(beforeState.search.query).toEqual('affair')
    })
    
    given('the app context has been set', () => {
      store.dispatch(setContext(SEARCH_CONTEXT))
      afterState = resultingState(store, rootReducer, beforeState)
      expect(afterState.app.context).toEqual(SEARCH_CONTEXT)
    })
    
    when('I load the search endpoint', () => {
      respondWithMockResponse(moxios, searchQueryMock)

      store = mockStore(afterState)
      return store.dispatch(getPromos())
      .then(() => {
        
        expectActions(store, [
          `${types.GET_PROMOS}_PENDING`,
          SET_TOTAL_RESPONSE_PAGES,
          SET_RESPONSE_SIZE,
          `${types.GET_PROMOS}_FULFILLED`,
          APPLY_SORT
        ])  
      })
    });
    
    then('the PromoList will contain some promos', () => {
      afterState = resultingState(store, rootReducer, beforeState)
      const {list} = afterState.promos

      const matches = list.filter(p => {
        return SEARCHABLE_PROPERTIES.find(key => p[key].indexOf(query) > -1)        
      })
      expect(list.length).toBeGreaterThan(0)
      expect(matches.length).toEqual(list.length)
    })
  });

  test('Promos do not match Search Context', ({ given, when, then, pending }) => {
    given('there are Promos in the db', () => {
        
    });

    given('there are no Promos in the PromoList', () => {
      store = mockStore(rootReducer())
      beforeState = store.getState() 
      expect(beforeState.promos.list).toHaveLength(0)
    });

    given('there is a search query', () => {
      query = 'wibbble' 
      store = mockStore(rootReducer({search:{query}}))
      beforeState = resultingState(store, rootReducer, store.getState())
      expect(beforeState.search.query).toEqual('wibbble')
    });

    given('the app context has been set', () => {
      store.dispatch(setContext(SEARCH_CONTEXT))
      afterState = resultingState(store, rootReducer, beforeState)
      expect(afterState.app.context).toEqual(SEARCH_CONTEXT)
    });

    when('I load the search endpoint', () => {
      const emptyMockResponse = {...searchQueryMock, page:{content:[]}} 
      respondWithMockResponse(moxios, emptyMockResponse)      
      store = mockStore(afterState)
      return store.dispatch(getPromos())
      .then(() => {
        
        expectActions(store, [
          `${types.GET_PROMOS}_PENDING`,
          SET_TOTAL_RESPONSE_PAGES,
          SET_RESPONSE_SIZE,
          `${types.GET_PROMOS}_FULFILLED`,
          APPLY_SORT
        ])  
      })
      });
 
    then('the PromoList will be empty', () => {
      afterState = resultingState(store, rootReducer, beforeState)
      const {list} = afterState.promos
      expect(list.length).toEqual(0)
    })
  });
})  