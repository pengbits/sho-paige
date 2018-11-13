import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from '../mockStore'
import getContentBlock from '../mocks/getContentBlock'

// reducers
import rootReducer from '../redux'
import reducer, {
  clonePromo, 
  createPromo,   CREATE_PROMO,
  setAttributes, SET_ATTRIBUTES
} from '../redux/promos'
import {
  APPLY_SORT 
} from '../redux/sort'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/clone-promo.feature'
), test => {
  
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });
  
  const initialState = reducer({
    list: getContentBlock.payload.promotionList
  })
  
  let store
  let state
  let thePromo
  let attrs
  let response
  let action
  
  const given_there_is_a_list_of_promos = () => {
    store = mockStore(initialState)
    state = store.getState()
    expect(state.list.length).toBeGreaterThan(0)
  }
  
  const when_i_clone_a_promo = (opts={}) => {
    const i  = Math.floor(Math.random() * state.list.length)
    thePromo = state.list[i]
    action   = clonePromo({id: thePromo.id}, opts)
  }
  
  const when_i_submit = (response) => {
    respondWithMockResponse(moxios, response);
    
    return store.dispatch(action)
     .then(() => {
       expectActions(store, [
        SET_ATTRIBUTES,
        `${CREATE_PROMO}_PENDING`,
        `${CREATE_PROMO}_FULFILLED`,
        APPLY_SORT
       ])
     })
  }
  
  const randomId = () => (Math.floor(Math.random() * 100))
  
  test('Clone a Promo', ({ given, when, then }) => {
    given('there is a list of Promos', () => {
      given_there_is_a_list_of_promos()
    });
    
    when('I clone a promo', () => {
      when_i_clone_a_promo({offsetDuration:false})
    });
    
    when('I submit', () => {
      attrs = {
        ...thePromo,
        'id'  : randomId(),
        'name': thePromo.name.replace(/\s\(Copy\)$/,'') + ' (Copy)'
      }
      return when_i_submit({payload: attrs})
    })

    then('the list contains a copy of the promo with \'(Copy)\' in the name', () => {
      const {list} = resultingState(store, reducer, state)
      const match = list.find(p => {
       return p.name.indexOf(thePromo.name) > -1 && 
              p.name.indexOf('(Copy)') > -1
      })
      expect(match).toBeTruthy()
      expect(match.position).toEqual(thePromo.position)
    });
  });
  
  
  test('Clone a Promo with Offset Duration', ({ given, when, then, pending }) => {
    given('there is a list of Promos', () => {
      given_there_is_a_list_of_promos()
    });
  
    when('I clone a promo with \'offset-duration=true\'', () => {
      when_i_clone_a_promo({offsetDuration:true})
    });
  
    when('I submit', () => {
      const p = Promo.fromAttributes(thePromo)
      const {startDate,endDate} = p.getOffsetDuration()

      attrs = {
        ...thePromo,
        'id'  : randomId(),
        'name': thePromo.name.replace(/\s\(Copy\)$/,'') + ' (Copy)',
        startDate,
        endDate
      }
      
      response = {
        payload: attrs
      }
      return when_i_submit(response)
    });
  
    then('the list contains a copy of the promo with \'(Copy)\' in the title and the offset duration', () => {
      const {list}    = resultingState(store, reducer, state)
      const duration  = Promo.fromAttributes(thePromo).duration()
      const startDate = (thePromo.startDate + duration)
      const endDate   = (thePromo.endDate   + duration)
      const expected  = {...response.payload, 
        startDate, 
        endDate
      }
      expect(list).toEqual(expect.arrayContaining([expected]))
    })
  })
})