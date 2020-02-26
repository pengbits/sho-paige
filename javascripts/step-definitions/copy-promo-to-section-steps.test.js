import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';
// import Cookies from 'js-cookie'

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from '../mockStore'
import getContentBlock from '../mocks/getContentBlock'
const  ContentBlockMock = getContentBlockMock.payload
import {timestamp,status,payload} from '../mocks/createPromo'
import getContentBlockMock, {OnBecomingAGodSecondaryContentBlock, TheAffairSecondaryContentBlock} from '../mocks/getContentBlock'
const  OnBecomingAGodSecondaryMock  = OnBecomingAGodSecondaryContentBlock
const  TheAffairSecondaryMock       = TheAffairSecondaryContentBlock

import getContextsMock from '../mocks/getContexts'

// reducers
import rootReducer from '../redux'

import {
  setContext, 
  CONTENT_BLOCK_CONTEXT
} from '../redux/app'

import promoReducer from '../redux/promos'

import {
  selectPromo,
  createPromo,
  setIsCopyingToContentBlock,
  copyPromoToContentBlock,
  setAttributes,
  getPromos,
  showDetails,
  hideDetails
} from '../redux/promos/actions'

import {
  setContentBlock, SET_CONTENT_BLOCK
} from '../redux/content-block'

import {
  getContexts,                 GET_CONTEXTS,
  setDestinationContext,       SET_DESTINATION_CONTEXT,
  setDestinationContentBlock,  SET_DESTINATION_CONTENT_BLOCK,
  REDIRECT_TO_CONTENT_BLOCK   } from '../redux/content-blocks'

import {
  SET_ATTRIBUTES,
  SET_IS_COPYING_TO_CONTENT_BLOCK,
  CREATE_PROMO,
  HIGHLIGHT_PROMO_AFTER_REDIRECT
} from '../redux/promos/types'

import {
  APPLY_SORT 
} from '../redux/sort'


// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/copy-promo-to-section.feature'
), test => {
  
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });
  
  let store
  let beforeState
  let afterState
  let state
  let list 
  let contentBlocksList
  let destination
  let thePromo
  let theCopy
  let createPromoMock
  
  const initialState = rootReducer()
  
  //given('there is a list of Promos',                        () => given_there_is_a_list_of_promos())
  //  and('the app context has been set',                     () => given_the_app_context_has_been_set())
  //  and('there is a Content Block selected',                () => given_there_is_a_content_block_selected(TheAffairSecondaryMock.payload)) // # ie The Affair: Secondary aka '1031103-secondary'
  //  and('the promo details are blank',                      () => expect(afterState.promos.details).toEqual({}))
  // when('I select a promo',                                 () => when_i_select_a_promo(expect)) // ie Sample Showtime favorites for free 
  //  and('I select \'copy to section\' from actions',        () => when_i_select_copy_to_section_from_actions(expect))
  //  and('I submit',                                         () => {})
  // then('There will be a fetch of the contexts endpoint',   () => fetch_the_contexts())
  // when('It loads',                                         () => {})  
  // then('there is a list of contexts',                      () => expect(afterState.contentBlocks.context.length).toBeGreaterThan(0))
  // when('I select a context',                               () => when_i_select_a_context())
  //  and('It loads',                                         () => {})  
  // then('There will be a list of content-blocks',           () => {})
  // when('I select a content-block',                         () => ...)
  // then('the application state changes to reflect my selection', () => the_application_state_changes());
  //  and('the selected promo is saved to the destination',   () => the_selected_promo_is_saved_to_the_destination())
  //  and('it does not appear in the promo-list in the original context', () => it_does_not_appear_in_the_original_context())
  //  and('the browser is redirected to the destination',     () => {}) // these are not testable here
  // when('I visit the destination',                          () => {})
  // then('the list of promos will contain the new addition', () => {})
  //  and('it will be highlighted',                           () => {})
    
  const given_there_is_a_list_of_promos = () => {
    list = TheAffairSecondaryMock.payload.promotionList
    store = mockStore(rootReducer({
      ...initialState,
      promos: promoReducer({ // seems like a lot of work just to ensure initial state shape!
        ...initialState.promos,
        list 
      })
    }))

    beforeState = resultingState(store, rootReducer, store.getState())
    expect(beforeState.promos.list.length).toBeGreaterThan(0)
  }
  
  const given_the_app_context_has_been_set = () => {
    store.dispatch(setContext(CONTENT_BLOCK_CONTEXT))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.app.context).toEqual(CONTENT_BLOCK_CONTEXT)
  }

  const given_there_is_a_content_block_selected = (cb) => {
    store.dispatch(setContentBlock(cb))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.app.context).toBeTruthy()
    expect(afterState.contentBlock.id).toBeTruthy()
  }
  
  const when_i_select_a_promo = (expect) => {
    const {list}   = store.getState().promos
    const {length} = list
    const i        = Math.floor(Math.random() * length)
    thePromo       = list[i]
    const {id}     = thePromo
    store.dispatch(selectPromo({id}))
    
    afterState = resultingState(store, rootReducer, afterState)
    expect(afterState.promos.selected).toEqual(id)
  }
  
  const when_i_select_copy_to_section_from_actions = (expect) => {
    beforeState = {...afterState}
    
    const id = afterState.promos.selected;
    const {contentBlockKey} = afterState.contentBlock
    // dispatch the actual change to content-block state
    store.dispatch(setIsCopyingToContentBlock(true))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.promos.isCopyingToContentBlock).toBe(true)
  }
  
  const fetch_the_contexts = () =>  {
    beforeState = {...afterState}
    store = mockStore(beforeState) // this actually clears previous actions
    
    // ok cool, but where is this action called? in the ui? 
    // shouldn't it be abstracted away behind setIsCopyingToContentBlock() ie w/ middleware?
    respondWithMockResponse(moxios, getContextsMock)
    return store.dispatch(getContexts())
    .then(() => {
      expectActions(store, [
        `${GET_CONTEXTS}_PENDING`,
        `${GET_CONTEXTS}_FULFILLED` 
      ])
      afterState = resultingState(store, rootReducer, store.getState())
     })
  }
  
  const there_is_a_list_of_contexts = () => {
    expect(afterState.contentBlocks.contexts.length).toBeGreaterThan(0)
  }

  const when_i_select_a_context = () => {
    beforeState = {...afterState}
    const theAffairSeriesSite = beforeState.contentBlocks.contexts.find(c => c.id == 41)
    expect(theAffairSeriesSite).toBeTruthy()
    store.dispatch(setDestinationContext({id: theAffairSeriesSite.id}))
    afterState = resultingState(store, rootReducer, beforeState)
    expectActions(store, [
      `${GET_CONTEXTS}_PENDING`,
      `${GET_CONTEXTS}_FULFILLED`,
      SET_DESTINATION_CONTEXT
    ])
    expect(afterState.contentBlocks.selectedContext).toEqual(41)
  }
  
  const there_is_a_list_of_content_blocks = () => {
    const {selectedList} = afterState.contentBlocks
    expect(selectedList.length).toBeGreaterThan(0)
    expect(selectedList.filter(c => c.contextId == 41).length).toEqual(selectedList.length) // only The Affair content-blocks here
  }
  
  const when_i_select_a_content_block = () => {
    const {promotionList, ...copyTo} = OnBecomingAGodSecondaryMock.payload // ie On Becoming a God: Secondary aka '1035023-secondary-tiles'
    beforeState = {...afterState}
    store.dispatch(setDestinationContentBlock(copyTo))
    afterState  = resultingState(store, rootReducer, beforeState)
    destination = afterState.contentBlocks.copyingTo.id
  }
  
  const the_application_state_changes = () => {
    expect(afterState.promos.isCopyingToContentBlock)
    expect(afterState.promos.selected).toBeTruthy()
    expect(afterState.contentBlocks.copyingTo.id).toBeTruthy()
    expect(afterState.contentBlocks.copyingTo.editorPath).toBeTruthy()
    expect(afterState.contentBlocks.loading).toBeTruthy()
  }
  
  const the_selected_promo_is_saved_to_the_destination = () => {
    beforeState = {...afterState}

    createPromoMock = {
      timestamp,
      status,
      payload : Object.assign({},
        thePromo,
        { 
          id: 999999,
          contentBlockId: destination
        }
      )
    }
    
    respondWithMockResponse(moxios, createPromoMock)
    store = mockStore(beforeState)
    return store.dispatch(copyPromoToContentBlock({id: destination}))
     .then(() => {
       // console.log(store.getActions().map(a => a.type))
       expectActions(store, [
        SET_ATTRIBUTES,
        `${CREATE_PROMO}_PENDING`,
        `${CREATE_PROMO}_FULFILLED`,
        SET_IS_COPYING_TO_CONTENT_BLOCK,
        `${REDIRECT_TO_CONTENT_BLOCK}_PENDING`,
        HIGHLIGHT_PROMO_AFTER_REDIRECT, // set a cookie after successfully creating the promo so we can show feedback on other side
        APPLY_SORT
       ])
       afterState = resultingState(store, rootReducer, beforeState)
     })
  }
  
  const it_does_not_appear_in_the_original_context = () => {
    expect(afterState.promos.list.find(p => p.id == createPromoMock.payload.id)).toBe(undefined)
    expect(afterState.promos.isCopyingToContentBlock).toBe(false)
    expect(afterState.contentBlocks.copyingTo).toBe(undefined)
  }
  
  test('Copy Cross-Promotional Sampler Tile to a Different Series', ({ given, and, when, then }) => {
    given('there is a list of Promos',                        () => given_there_is_a_list_of_promos())
      and('the app context has been set',                     () => given_the_app_context_has_been_set())
     	and('there is a Content Block selected',                () => given_there_is_a_content_block_selected(TheAffairSecondaryMock.payload)) // # ie The Affair: Secondary aka '1031103-secondary'
     	and('the promo details are blank',                      () => expect(afterState.promos.details).toEqual({}))
  	 when('I select a promo',                                 () => when_i_select_a_promo(expect)) // ie Sample Showtime favorites for free 
     	and('I select \'copy to section\' from actions',        () => when_i_select_copy_to_section_from_actions(expect))
      and('I submit',                                         () => {})
     then('There will be a fetch of the contexts endpoint',   () => fetch_the_contexts())
     when('It loads',                                         () => {})  
  	 then('there is a list of contexts',                      () => there_is_a_list_of_contexts())
     when('I select a context',                               () => when_i_select_a_context())
      and('It loads',                                         () => {})  
  	 then('There will be a list of content-blocks',           () => there_is_a_list_of_content_blocks())
     when('I select a content-block',                         () => when_i_select_a_content_block())
     then('the application state changes to reflect my selection', () => the_application_state_changes());
      and('the selected promo is saved to the destination',   () => the_selected_promo_is_saved_to_the_destination())
      and('it does not appear in the promo-list in the original context', () => it_does_not_appear_in_the_original_context())
      and('the browser is redirected to the destination',     () => {}) // these are not testable here
     when('I visit the destination',                          () => {})
     then('the list of promos will contain the new addition', () => {})
     and('it will be highlighted', () => {
       // we can't assert that a cookie was set because that needs a browser environment..
       // console.log(Cookies.get(HIGHLIGHT_PROMO_AFTER_REDIRECT_COOKIE_KEY)) => 'SOME_PROMO_ID'
     })
  })
  
  
  test('Copy Promo to Section but cancel in the middle', ({ given, and, then }) => {
    given('I am copying a promo to a content-block', () => {
      given_there_is_a_list_of_promos()
      given_the_app_context_has_been_set()
      given_there_is_a_content_block_selected(TheAffairSecondaryMock.payload)
      when_i_select_a_promo(expect)
      when_i_select_copy_to_section_from_actions(expect)
      //fetch_the_content_blocks()

      expect(beforeState.promos.isCopyingToContentBlock)
    });

    and('I close the list of destinations without making a selection', () => {
      store = mockStore(afterState)
      store.dispatch(setIsCopyingToContentBlock(false))
    });

    then('the application will revert to the previous state', () => {
      afterState = resultingState(store, rootReducer, afterState)
      expect(afterState.promos.isCopyingToContentBlock).toBe(false)
    });
});

  
})