import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import getContentBlockMock from '../mocks/getContentBlock'

// reducers
import rootReducer from '../redux'
import reducer, { getPromos, GET_PROMOS } from '../redux/promos'
import appReducer, { setContext, CONTENT_BLOCK_CONTEXT } from '../redux/app'
import {APPLY_SORT } from '../redux/sort'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/get-promos-in-content-block.feature'
), test => {
  
  beforeEach(function(){ moxios.install()  ; })
   afterEach(function(){ moxios.uninstall(); })
  
  let store
  let beforeState
  let afterState

  
  test('Populate PromoList', ({ given, when, then }) => {
    given('there are Promos in the db', () => {}); // nothing to do here

    given('there are no Promos in the PromoList', () => {
      store = mockStore(rootReducer({
        contentBlock: getContentBlockMock.payload
      }))
      beforeState = store.getState()
      expect(beforeState.promos.list).toHaveLength(0)
    });
    
    given('the app context has been set', () => {
      store.dispatch(setContext(CONTENT_BLOCK_CONTEXT))
      afterState = resultingState(store, rootReducer, beforeState)
      expect(afterState.app.context).toEqual(CONTENT_BLOCK_CONTEXT)
    })

    when('I load the promos endpoint', () => {
      respondWithMockResponse(moxios, getContentBlockMock)
      
      store = mockStore(afterState)
      return store.dispatch(getPromos())
      .then(() => {
        expectActions(store, [
         `${GET_PROMOS}_PENDING`,
         `${GET_PROMOS}_FULFILLED`,
         APPLY_SORT
        ])  
      })
    });

    then('the PromoList will contain some promos', () => {
      const {list} = resultingState(store, reducer, beforeState)
      expect(list.length).toBeGreaterThan(0)
      
      // promos have this shape:
      // {
      //   "name": "Dexter Promotion",
      //   "id": 229,
      //   "title": null,
      //   "position": 10,
      //   "description": null,
      //   "contentBlockId": 1,
      //   "ctaLabel": null,
      //   "ctaLink": null,
      //   "seasonNumber": null,
      //   "seriesId": null,
      //   "showId": null,
      //   "startDate": null,
      //   "endDate": null,
      //   "topLine": null,
      //   "panelLinkType": null,
      //   "panelLink": null,
      //   "subtitleType": null,
      //   "staticSubtitle": null,
      //   "smallImageUrl": null,
      //   "largeImageUrl": null,
      //   "ctaType": null,
      //   "createdDate": 1532715578000,
      //   "updatedDate": null
      //  },
      const expectedAttrs = {
        "id": 229,
        "name": "Dexter Promotion",
        "position" : 10  
      }
      // do a little sanity-checking of the attrs
      const valid = list.filter(p => {
        for(let k in expectedAttrs) {
          if(p[k] == undefined) return false
        }
        return true
      })
      
      expect(valid.length).toBeGreaterThan(0)
    });
  });
})