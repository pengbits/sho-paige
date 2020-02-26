// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import updatePromoMock from '../mocks/updatePromo'
import getContentBlock from '../mocks/getContentBlock'
const ContentBlockMock = getContentBlock.payload

// reducers
import reducer from '../redux/promos'
import rootReducer from '../redux'

import { 
  setAttributes,
  selectPromo,
  editPromo,
  updatePromo,
  toggleDetails,
  cancelEditing,
} from '../redux/promos/actions'
import * as types from '../redux/promos/types'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/edit-promo.feature'), test => {  
  let beforeState
  let afterState
  let store
  let thePromo
  let theEdit
  
  const initialState = rootReducer()
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });
  
  const given_there_is_a_list_of_promos = () => {
    store = mockStore({
      ...initialState,
      contentBlock: ContentBlockMock,
      promos: {
        ...initialState.promos,
        list: ContentBlockMock.promotionList
      }
    })
    
    beforeState = store.getState()
    expect(beforeState.promos.list.length).toBeGreaterThan(0)
  }

  const when_i_toggle_the_promo_details = () => {
    beforeState = {...afterState}
    store.dispatch(toggleDetails())
    afterState = resultingState(store, rootReducer, beforeState)
  }
  
  const when_i_select_a_promo = (expect) => {
    const {list}   = store.getState().promos
    const {length} = list
    const i        = Math.floor(Math.random() * length)
    thePromo       = list[i]
    const {id}     = thePromo
    store.dispatch(selectPromo({id}))
    
    afterState = resultingState(store, rootReducer, store.getState())
    expect(afterState.promos.selected).toEqual(id)
  }
  
  const when_i_select_edit_from_actions = (expect) => {
    const id = afterState.promos.selected;
    store.dispatch(editPromo({id}))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.promos.isEditing).toBe(true)
    expect(afterState.promos.details).toEqual(expect.objectContaining(thePromo))
  }
  
  test('Edit a Promo', ({ given, when, then, pending }) => {
    given('there is a list of promos', given_there_is_a_list_of_promos)

    given('the promo details are blank', () => {
      const {details,detailsVisible} = beforeState.promos
      expect(details).toEqual({})
      // visibility is a new concept, just need a place to stick it 
      // in the browser, we can only edit the promo after toggling the form open
      expect(detailsVisible).toBe(false)
    });
    
    when('I select a promo', () => when_i_select_a_promo(expect))
    
    when('I select \'edit\' from actions', () => when_i_select_edit_from_actions(expect))
    
    when('I toggle the promo details', when_i_toggle_the_promo_details)
    
    when('I make a change to one or more fields in the promo', () => {
      theEdit = {
        ...thePromo, 
        name          : thePromo.name +' _EDIT_',
        title         : thePromo.title+' _EDIT_',
        largeImageURL : '/path/to/image-1024x640.png',
        smallImageURL : '/path/to/image-300x300.png'
      }

      store.dispatch(setAttributes(theEdit))
      afterState = resultingState(store, rootReducer, store.getState())
    });

    then('the promo details are visible', () => {
      expect(afterState.promos.detailsVisible).toBe(true)
    });
    
    then('the promo details are updated', () => {
      expect(afterState.promos.details).toEqual(expect.objectContaining(theEdit))
    });
    
    when('I submit', () => {
      let response = updatePromoMock
      // this is a little silly.. since the static payload doesn't contain the new attributes,
      // we are just merging them into the mock response... so not really testing much other than reducer
      let {id,title,name,largeImageURL,smallImageURL} = theEdit
      Object.assign(response.payload, {id,title,name,largeImageURL,smallImageURL})
      respondWithMockResponse(moxios, response)
      
      store = mockStore(afterState)
      return store.dispatch(updatePromo(theEdit))
      .then(() => {
        expectActions(store, [
          `${types.UPDATE_PROMO}_PENDING`,
          `${types.UPDATE_PROMO}_FULFILLED` 
        ])
      })
    });
    
    then('the list contains a promo with my changes', () => {
      const {list} = resultingState(store, rootReducer, afterState).promos
      // the list of attrs to compare with, can't just equate whole object
      const attrs = ['id','name','title','largeImageURL','smallImageURL']; 
      // build a list of promos that meet the criteria...
      const valid = list.filter(p => {
        // the criteria being, the promo matched the edit for all relevant attributes 
        const matches = attrs.reduce((memo,k)=> {
          const isMatch = p[k] == theEdit[k]
          // console.log(`'${k}': '${p[k]}' ? ${isMatch ? 'match!' : ''}`)
          return isMatch ? memo.concat([k]) : memo
        }, [])
        return matches.length == attrs.length
      });
      expect(valid).toHaveLength(1)
    })
  });
  
  test('isEditing Flag', ({ given, when, then, pending }) => {
    given('there is a list of promos', given_there_is_a_list_of_promos)

    given('I am not editing', () => {
      expect(store.getActions()).toHaveLength(0)
    })

    then('isEditing will be false', () => {
      beforeState = store.getState()
      expect(beforeState.promos.isEditing).toEqual(false)
    })

    when('I select a promo', () => when_i_select_a_promo(expect))

    when('I select \'edit\' from actions', () => when_i_select_edit_from_actions(expect))

    then('isEditing will be true', () => {
      expect(afterState.promos.isEditing).toEqual(true)
    })
  })
})