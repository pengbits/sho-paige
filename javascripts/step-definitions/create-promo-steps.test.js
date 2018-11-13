// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import createPromoMock from '../mocks/createPromo'
import getContentBlockMock from '../mocks/getContentBlock'
import getPromosMock from '../mocks/getPromos'
const ContentBlockMock = getContentBlockMock.payload

// reducers
import reducer, { 
  setAttributes, SET_ATTRIBUTES,
  createPromo,   CREATE_PROMO,
  selectPromo,   SELECT_PROMO,
  toggleDetails, TOGGLE_DETAILS,
  cancelEditing, CANCEL_EDITING
} from '../redux/promos'

import rootReducer from '../redux'

import {
  APPLY_SORT
} from '../redux/sort'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import {trace} from '../step-definition-utils'

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/create-promo.feature'), test => {  
  let beforeState
  let afterState
  let store
  let thePromo
  let theEdit
  
  const initialState = reducer()
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });
  
  test('Create a Promo Succesfully', ({ given, when, then, pending }) => {
    given('the promo details are blank', () => {
      const initialState = rootReducer()
      const {details}    = initialState.promos
      expect(details).toEqual({})
    });
    
    when('I enter some valid attributes', () => {
      beforeState = rootReducer({}, setAttributes(createPromoMock.payload))
    });

    then('the promo details will contain those attributes', () => {
      expect(beforeState.promos.details).toEqual(createPromoMock.payload)
    });

    when('I submit', () => {
      respondWithMockResponse(moxios, createPromoMock)

      store = mockStore(beforeState)
      return store.dispatch(createPromo(createPromoMock.payload))
       .then(() => {
         expectActions(store, [
           `${CREATE_PROMO}_PENDING`,
           `${CREATE_PROMO}_FULFILLED`,
           APPLY_SORT
         ])
         
       })
    });
    
    then('the list of promos will contain the new addition', () => {
      afterState = resultingState(store, rootReducer, beforeState)
      expect(afterState.promos.list).toEqual(expect.arrayContaining([createPromoMock.payload]))
    });
  });


  test('Create and Cancel a Promo', ({ given, when, then, pending }) => {
    
    given('the promo details are blank', () => {
      const {details} = initialState
      expect(details).toEqual({})
    });
        
    when('I enter some valid attributes', () => {
      beforeState = reducer({}, setAttributes(createPromoMock.payload.promo))
    });

    when('I cancel', () => {
      store = mockStore(beforeState)
      store.dispatch(cancelEditing())
      expectActions(store, [
        CANCEL_EDITING
      ])
    });

    then('the promo details are empty and the list of promos does not contain the new addition', () => {
      const {list,details} = resultingState(store, reducer, beforeState)
      expect(list).not.toEqual(expect.arrayContaining([createPromoMock.payload.promo]))
      expect(details).toEqual({})
    });
  });

  test('Create Promo with Sort Applied', ({ given, when, then, pending }) => {
    given(/^there are some Promos with positions \[(.+)\]/, (positionArr) => {
      const positions = positionArr.split(',')
      const list      = ContentBlockMock.promotionList.slice(0, positions.length).map((promo,idx) => {
        const position = Number(positions[idx])
        return {...promo, position}
      })

     store = mockStore(rootReducer({promos:{list}}))
     beforeState = resultingState(store, reducer, store.getState())
     expect(beforeState.promos.list.length).toEqual(positions.length)
    });
    
    given('the sort type is "position"', () => {
      expect(beforeState.sort.type).toEqual('position')
    })

    when(/^I create a Promo with position:(.*)$/, (position) => {
      createPromoMock.payload.position = Number(position)
      thePromo = createPromoMock.payload
      respondWithMockResponse(moxios, createPromoMock)
      return store.dispatch(createPromo(thePromo))
    })

    then(/^the list of promos will contain the new addition at index:(\d+)/, (index) => {
      const afterState = resultingState(store, rootReducer, beforeState)
      const {list} = afterState.promos
      //console.log(`expecting list[${index}] to contain '${thePromo.name}'...`)
      //trace('result', list, 'position','name')
      expect(list[index]).toEqual(thePromo)
    });
  });


});