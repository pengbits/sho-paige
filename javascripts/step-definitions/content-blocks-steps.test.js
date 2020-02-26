import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import createPromoMock from '../mocks/createPromo'
const  PromoMock = createPromoMock.payload
import getContentBlockMock from '../mocks/getContentBlock'
const  ContentBlockMock = getContentBlockMock.payload
import getContentBlocksMock from '../mocks/getContentBlocks'
// const  ContentBlocksMock = getContentBlocksMock

// reducers
import rootReducer from '../redux'

// TODO - consolidate plural + single contentBlock reducers
import contentBlockReducer, {
  setContentBlock, SET_CONTENT_BLOCK,
  renameContentBlock, RENAME_CONTENT_BLOCK,
  UPDATE_CONTENT_BLOCK
} from '../redux/content-block'

import contentBlocksReducer, {
  getContentBlocks, GET_CONTENT_BLOCKS
} from '../redux/content-blocks'

import promoReducer from '../redux/promos' 
import {
  setAttributes,
  editPromo,
  clonePromo
} from '../redux/promos/actions'
import * as types from '../redux/promos/types'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/content-blocks.feature'
), test => {
  
  let store
  let action
  let update
  let beforeState
  let afterState
  let state
  let list 
  
  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });
  
  const given_there_is_a_list_of_promos = () => {
    list = ContentBlockMock.promotionList
    const initialState = rootReducer()
    store = mockStore({
      ...initialState,
      promos: {
        ...initialState.promos,
        list
      }
    })
    
    beforeState = resultingState(store, rootReducer, store.getState())
    expect(beforeState.promos.list.length).toBeGreaterThan(0)
  }
  
  const given_there_is_a_content_block_selected = () => {
    store.dispatch(setContentBlock(ContentBlockMock))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.contentBlock.id).toBeTruthy()
  }
  
  test('Set Content Block on Initialize', ({ given, when, then, pending }) => {
    given('the application is initializing', () => {
      store = mockStore(rootReducer())
      expect(store.getActions()).toEqual([])
    });

    then('there is no Content Block selected', () => {
      beforeState = store.getState().contentBlock
      expect(Object.keys(beforeState)).toEqual(['id','name','contextId', 'contentBlockKey', 'isEditing'])
      expect(beforeState.id).toBe(undefined)
    });

    when('the application is ready', () => {
      // todo.. do we need a top-level App reducer with an INIT state?
    });
    
    when('I set the Content Block', () => {
      store.dispatch(setContentBlock(ContentBlockMock))
    });
    
    then('there will be a Content block selected', () => {
      expectActions(store, [SET_CONTENT_BLOCK])
      afterState = resultingState(store, contentBlockReducer, beforeState)
      expect(afterState.id).toBe(ContentBlockMock.id)
      expect(afterState.name).toBe(ContentBlockMock.name)
    });
  });

  
  test('Content Block ID Appears in Promotion Details', ({ given, when, then, pending }) => {
    given('there is a list of promos', () => given_there_is_a_list_of_promos());
    
    given('there is a Content Block selected', given_there_is_a_content_block_selected)

    when('I edit the Promo', () => {
      const {length} = list
      const index    = Math.floor(Math.random() * list.length)
      const {id}     = list[index]
      beforeState    = {...afterState}

      store.dispatch(editPromo({id}))
      afterState = resultingState(store, rootReducer, beforeState)
    });

    then('the Promo Details will include a Content Block Id', () => {  
      const actionList = store.getActions().map(a => a.type)
      expect(actionList).toContain(types.SET_ATTRIBUTES) // SET_ATTRIBUTES is dispatched as a side-effect of editPromo()
      expect(afterState.promos.details.contentBlockId).toEqual(ContentBlockMock.id)
    });
  });


  test('Rename Content Block', ({ given, when, then, pending }) => {
    given('there is a Content Block selected', given_there_is_a_content_block_selected)
    
    given(/^it has the name "(.*)"$/, (name) => {
      expect(beforeState.contentBlock.name).toEqual(name)
    });

    when(/^I set the name to "(.*)"$/, (name) => {
      store  = mockStore(rootReducer(beforeState))
      action = renameContentBlock({name})
      update = {name}
    });

    when('I submit', () => {
      const response = {
        ...getContentBlockMock,
        payload: {
          ...getContentBlockMock.payload, 
          name: update.name
        }
      }
      respondWithMockResponse(moxios, response)
      store = mockStore(beforeState)
      
      return store.dispatch(action)
        then(() => {
          expectActions(store, [
            `${UPDATE_CONTENT_BLOCK}_PENDING`,
            `${UPDATE_CONTENT_BLOCK}_FULFILLED`
          ])          
        })
    });

    then(/^the Content Block's name will be "(.*)"$/, (name) => {
      afterState = resultingState(store, rootReducer, store.getState())
      expect(afterState.contentBlock.name).toEqual(name)
    });
  })


  // this is a fairly useless test, we want to test that
  // contentBlockId is sent to the server with the payload,
  // but that's outside the scope of what we can do here,
  // problem seems to be in-between the two actions with the clone thunk
  test('Clone Promo', ({ given, when, then, pending }) => {
    given('there is a list of Promos', given_there_is_a_list_of_promos)
    given('there is a Content Block selected', given_there_is_a_content_block_selected)
    when('I clone a promo', () => {
      const beforeState = {...afterState}
      const {id} = list[0]
      const contentBlockId = beforeState.contentBlock.id
      // this is ugly, but the thunk implementation of clone promo makes it hard to access the contentBlockId
        store.dispatch(clonePromo({id,contentBlockId})) 
    });

    then('the cloned promo will include a Content Block Id', () => {
      beforeState = {...afterState}
      const contentBlockId = beforeState.contentBlock.id
      afterState = resultingState(store, rootReducer, beforeState)
      expect(afterState.promos.details.contentBlockId).toEqual(contentBlockId)
    });
  });
})