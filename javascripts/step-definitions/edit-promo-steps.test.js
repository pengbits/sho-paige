// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import updatePromoMock from '../mocks/updatePromo'
import getPromosMock from '../mocks/getPromos'

// reducers
import reducer, { 
  setAttributes, SET_ATTRIBUTES,
  selectPromo,   SELECT_PROMO,
  editPromo,     EDIT_PROMO,
  updatePromo,   UPDATE_PROMO,
  toggleDetails, TOGGLE_DETAILS,
  cancelEditing, CANCEL_EDITING
} from '../redux/promos'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/edit-promo.feature'), test => {  
  let beforeState
  let afterState
  let store
  let thePromo
  let theEdit
  
  const initialState = reducer()
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });
  
  const given_there_is_a_list_of_promos = () => {
    store = mockStore({...initialState, list:getPromosMock.page.content})
    const {list} = store.getState()
    expect(list.length).toBeGreaterThan(0)
  }

  const when_i_toggle_the_promo_details = () => {
    beforeState = {...afterState}
    store.dispatch(toggleDetails())
    afterState = resultingState(store, reducer, beforeState)
  }
  
  const when_i_select_a_promo = (expect) => {
    const {list}   = store.getState()
    const {length} = list
    const i        = Math.floor(Math.random() * length)
    thePromo       = list[i]
    const {id}     = thePromo
    store.dispatch(selectPromo({id}))
    
    afterState = resultingState(store, reducer, store.getState())
    expect(afterState.selected).toEqual(id)
  }
  
  const when_i_select_edit_from_actions = (expect) => {
    const id = afterState.selected;
    store.dispatch(editPromo({id}))
    afterState = resultingState(store, reducer, beforeState)
    expect(afterState.details).toEqual(thePromo)
  }
  
  test('Edit a Promo', ({ given, when, then, pending }) => {
    given('there is a list of promos', given_there_is_a_list_of_promos)

    given('the promo details are blank', () => {
      const {details,detailsVisible} = store.getState()
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
      afterState = resultingState(store, reducer, store.getState())
    });

    then('the promo details are visible', () => {
      expect(afterState.detailsVisible).toBe(true)
    });
    
    then('the promo details are updated', () => {
      expect(afterState.details).toEqual(theEdit)
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
          `${UPDATE_PROMO}_PENDING`,
          `${UPDATE_PROMO}_FULFILLED` 
        ])
      })
    });
    
    then('the list contains a promo with my changes', () => {
      const {list} = resultingState(store, reducer, afterState)
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
      expect(beforeState.isEditing).toEqual(false)
    })

    when('I select a promo', () => when_i_select_a_promo(expect))

    when('I select \'edit\' from actions', () => when_i_select_edit_from_actions(expect))

    then('isEditing will be true', () => {
      const {isEditing} = afterState
      expect(isEditing).toEqual(true)
    })
  })
})