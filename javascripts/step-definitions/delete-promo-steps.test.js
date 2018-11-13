import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from '../mockStore'
import getPromosMock from '../mocks/getPromos'
import createPromoMock from '../mocks/createPromo'
import deletePromoMock from '../mocks/deletePromoMock'

// reducers
import rootReducer from '../redux' 
// reducers 
import reducer, { 
  setAttributes, SET_ATTRIBUTES,
  selectPromo,   SELECT_PROMO,
  deletePromo,   DELETE_PROMO,
} from '../redux/promos'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/delete-promo.feature'
), test => {

  let initialState;
  let store;
  let state;
  let thePromo;
  let afterState; 
  let beforeState;
  
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall(); 
  });
    
  test('Delete a Promo from PromoList', ({ given, when, then, pending }) => {
    given('there is a list of Promos', () => {
      initialState = reducer({
        details: {},
        list: getPromosMock.page.content
      })
      
      store = mockStore(initialState)
      state = store.getState()
      expect(state.list.length).toBeGreaterThan(0)
    });

    when('I select a promo', () => {
      const {list}   = state
      const {length} = list
      const i        = Math.floor(Math.random() * length)
      thePromo       = list[i];
      const {id}     = thePromo

      store.dispatch(selectPromo({id}))    
      afterState = resultingState(store, reducer, state)
      expect(afterState.selected).toEqual(id)
    });

    when('I select "delete" from actions', () => {
      respondWithMockResponse(moxios, deletePromoMock);
      
      // the 'after' state from last step forms basis for 'before' state in this one
      beforeState = {...afterState}
      // every time you recreate the store, take care at which state is passed in..
      // alternatively, might not need to reinitialize the store var at all
      store = mockStore(beforeState)
      // dispatch the delete, AND IN THE PROMISE CALLBACK, capture the resulting afterState 
      return store.dispatch(deletePromo({id: thePromo.id}))
       .then(() => {
         expectActions(store, [
          `${DELETE_PROMO}_PENDING`,
          `${DELETE_PROMO}_FULFILLED`
         ])
         afterState = resultingState(store, reducer, store.getState())
       })
    });

    then('the list does not contain my promo', () => {
      afterState = resultingState(store, reducer, beforeState)
      const {list} = afterState
      expect(list.find(p => p.id == thePromo.id)).toBe(undefined)
    });
  });

  test('Delete a Promo from PromoDetails', ({ given, when, then, pending }) => {
    given('there is a Promo in PromoDetails', () => {
      initialState = reducer({
        details: createPromoMock.payload,
        list: []
      })
      
      store = mockStore(initialState)
      state = store.getState()
      expect(state.details.id).toBeTruthy()
    })

    when('I select "delete" from actions', () => {
      respondWithMockResponse(moxios, deletePromoMock);

      // the 'after' state from last step forms basis for 'before' state in this one
      beforeState = {...afterState}
      // every time you recreate the store, take care at which state is passed in..
      // alternatively, might not need to reinitialize the store var at all
      store = mockStore(beforeState)
      // dispatch the delete, AND IN THE PROMISE CALLBACK, capture the resulting afterState 
      return store.dispatch(deletePromo({id: thePromo.id}))
      .then(() => {
        expectActions(store, [
          `${DELETE_PROMO}_PENDING`,
          `${DELETE_PROMO}_FULFILLED`
        ])
        afterState = resultingState(store, reducer, store.getState())
      })
    });

    then('the PromoDetails is empty', () => {
      beforeState = {...afterState}
      afterState = resultingState(store, reducer, beforeState)
      expect(afterState.details).toEqual({})
    });

    then('the list does not contain my promo', () => {
      const {id} = initialState.details
      expect(afterState.list.find(p => p.id == id)).toEqual(undefined)
    });
  });
})