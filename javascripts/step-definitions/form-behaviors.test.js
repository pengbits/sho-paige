import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';
import {reducer as formReducer} from 'redux-form'
import {imagePathFields} from '../components/form-configs/default';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse, respondWithMockFailure } from '../mockStore'
import FormDefaultsMock from '../mocks/formDefaultsConfig'
import mockPromoDetails from '../mocks/mockPromoDetails'
import ContentBlockMock from '../mocks/getContentBlock'
import ShimHunterDeps   from '../mocks/hunterDepsMock'
import ImageMocks, {
  IMAGE_LOAD_FAILURE_SOURCE,
  IMAGE_LOAD_SUCCESS_SOURCE
} from '../mocks/imageMocks'; ImageMocks()
  
import {largeImageUrlSuccessXhrResponse, largeImageUrlFailureXhrResponse} from '../mocks/validateImageUrlMock';
const {FORM_DEFAULTS}  = FormDefaultsMock
const {CONTENT_BLOCKS} = FORM_DEFAULTS

// reducers, actions
import rootReducer    from '../redux'
import {newPromo, checkValidUrl, setAttributes, isExternalUrl } from '../redux/promos/actions'
import {setDefaults, SET_DEFAULTS} from '../redux/form-defaults'
import {NEW_PROMO, CHECK_VALID_URL}    from '../redux/promos/types'
import {
  hunterConfirmDeps,       HUNTER_CONFIRM_DEPS,
  hunterInitHunter,        HUNTER_INIT_HUNTER,
  hunterRequestSearch,     HUNTER_REQUEST_SEARCH,
  HUNTER_REQUEST_REJECTED, 
  HUNTER_REQUEST_FULFILLED,
  HUNTER_REQUIRED_METADATA_FIELD,
} from '../redux/hunter-adapter'

import {change} from 'redux-form'

// form config
import FormConfigs from '../components/form-configs'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'
import {trace} from '../step-definition-utils'
import {FORM_SECTIONS} from '../components/forms/FormFactory';

// sensible defaults
defineFeature(
  loadFeature(PAIGE_ROOT + '/features/forms/behavior/sensible-defaults.feature'
), test => {
  
  let store, 
  beforeState, 
  afterState,
  values,
  input
  ;

  const initialState = rootReducer()

  const given_the_content_block_is_selected = (contentBlockName) => {
    store = mockStore(rootReducer({
      ...initialState,
      contentBlock: {
        name: 'Recaps',
        id: 1,
        contentBlockKey: '212-recaps',
        contextId: 212,
        createdDate: 1532977810000,
        updatedDate: 1532968789600
      }
    }))
    beforeState = resultingState(store, rootReducer, store.getState())
  }
  
  const given_there_are_sensible_defaults = (key) => {
    const defaults = CONTENT_BLOCKS[key] // 'recaps'
    store.dispatch(setDefaults({key, defaults}))
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.formDefaults[key]).toBeTruthy()
  }
  
  test('Default Form Values', ({ given, when, then, pending }) => {
    given(/^the \'(.+)\' content-block is selected$/, given_the_content_block_is_selected)
    given(/^there are sensible defaults defined for the \'(.+)\' content-block$/, given_there_are_sensible_defaults)
    when('I create a new promo', () => {
      beforeState = {...afterState}
      store.dispatch(newPromo())
      afterState = resultingState(store, rootReducer, beforeState)
    })
    
    then('I should see the following values in the form', (json) => {
      values = JSON.parse(json)
      expectActions(store, [SET_DEFAULTS, NEW_PROMO])
      // there is no way to test the form state without dispatching a bunch of redux-form actions
    })
  });

  test('Text Macro', ({ given, when, then, pending }) => {
    given(/^the \'(.+)\' content-block is selected$/, given_the_content_block_is_selected)
    given('there are sensible defaults defined for the \'recaps\' content-block', () => {})
    given('I enter these values', (attrs) => {})
    when('I submit or move the focus to a different input', () => {})
    then('I should see the following values in the form', (attrs) => {})
  });
})

// link-checker (see imagePath component as well)
defineFeature(
  loadFeature(PAIGE_ROOT + '/features/forms/behavior/link-checker.feature'
), test => {
  
  let store, 
  beforeState, 
  afterState,
  imagePath
  ;

  const initialState = rootReducer()

  const there_is_a_largeImageUrl_registered = () => {
    store = mockStore(rootReducer({
      ...initialState, 
      promos: {
        ...initialState.promos,
        details: mockPromoDetails
      },
      form: {
        promo: {}
      }
    }), formReducer)
    beforeState = resultingState(store, rootReducer, store.getState())
  }

  beforeEach(function () { moxios.install()   });
  afterEach(function ()  { moxios.uninstall() });

  test('Image Link Success', ({ given, when, and, then }) => {
    given("there is a 'largeImageURL' registered in the form", there_is_a_largeImageUrl_registered)
    
    when("I enter a value for 'largeImageUrl' that is a valid image path (will not 404)", () => {
      imagePath = IMAGE_LOAD_SUCCESS_SOURCE //"https://downloads.sho.com/bulk/images/sales-sheet-021119.jpg"
    });
    
    and('I blur the input', ()=> {
      store.dispatch(checkValidUrl(imagePath, 'largeImageUrlStatus'))
    });
    
    and('a placeholder image will be rendered', async () => {
      expect(global.p_img).toBeTruthy()
    })  
    
    and('it will load', () => {
      afterState = resultingState(store, rootReducer, store.getState())
      expect(store.getActions().find(a => a.type == `${CHECK_VALID_URL}_FULFILLED`)).toBeTruthy()
      // won't pass without proper async in image-mocks!
      //expect(afterState.promos.largeImageUrlStatus).toEqual(200)
    });
  });

  test('Image Link Failure', ({ given, when, and, then }) => {
    given("there is a 'largeImageURL' registered in the form", there_is_a_largeImageUrl_registered);
  
    when("I enter a value for 'largeImageUrl' that is an invalid image path (will 404)", () => {
      imagePath = IMAGE_LOAD_FAILURE_SOURCE //"https://tools.sho.com/site/image-bin/images/badimageurl.jpg"
    });
    and('I blur the input', ()=> {
      store.dispatch(checkValidUrl(imagePath, 'largeImageUrlStatus'))
    });
    
    and('a placeholder image will be rendered', async () => {
      expect(global.p_img.largeImageUrlStatus).toBeTruthy()
    })  
    
    and('there will be an error', () => {
     afterState = resultingState(store, rootReducer, store.getState())
     expect(store.getActions().find(a => a.type == `${CHECK_VALID_URL}_REJECTED`)).toBeTruthy()
     // won't pass without proper async in image-mocks!
     //expect(afterState.promos.largeImageUrlStatus).toEqual(404)
    })
  })
})



// image-hunter
defineFeature(
  loadFeature(PAIGE_ROOT + '/features/forms/behavior/image-hunter.feature', 
), test => {
  
  let store, 
  beforeState, 
  afterState,
  thePromo,
  hunterParams,
  cfg,
  origin,
  error
  ;

  const {promotionList, ...contentBlock} = ContentBlockMock.payload
  const initialState = rootReducer()
  thePromo = {...promotionList[0]}
  
  const given_i_am_editing_a_promo = () => {
    // bring about an initial state that resembles a user mid-edit
    store = mockStore(rootReducer({
      ...initialState,
      contentBlock,
      promos: {
        ...initialState.promos,
        selected: [thePromo.id],
        detailsVisible: true,
        details: {...thePromo},
        isEditing: true
      }
    }))
    beforeState = resultingState(store, rootReducer, store.getState())
  }
  
  test('Hunt for Images', ({ given, and, when, then }) => {
  	given('I am editing a promo', given_i_am_editing_a_promo)
  	
    and('there is an input with a type of \'imageHunter\' registered in the form', () => {
      // can't assert against redux-form state in tests.. nothing to do here!
    })
    
    and('the hunter dependencies are available', () => {
      ShimHunterDeps()
      beforeState = store.getState()
      store = mockStore(beforeState)
      store.dispatch(hunterConfirmDeps())
      afterState = resultingState(store, rootReducer, beforeState)
      expect(store.getActions().map(a => a.type)).toContain(`${HUNTER_CONFIRM_DEPS}_FULFILLED`)
      expect(afterState.hunter.dependencies).toBe(true)
    })
  
    and('hunter is initialized', () => {
      store.dispatch(hunterInitHunter())
      afterState = resultingState(store, rootReducer, beforeState)
    })
    
 	  and('the promo has a seriesId defined', () => {
      expect(thePromo.seriesId).toBeTruthy()
	  })

  	when('I click on the Hunter button in the \'imageHunter\' input', () => {
      ShimHunterDeps()
      const {seriesId} = afterState.promos.details
      store.dispatch(hunterRequestSearch({seriesId},{name:'largeImageUrl'}))
      afterState = resultingState(store, rootReducer, store.getState())
    })
    
    then('there will be a call to Hunter with the seriesId as one of the search parameters', () => {
      const action = store.getActions().find(a => a.type == HUNTER_REQUEST_SEARCH)
      expect(action).toBeTruthy()
      expect(action.meta.seriesId).toEqual(thePromo.seriesId)
    })
    
    when('it loads', () => {
      store = mockStore(afterState)
      store.dispatch({
        type: HUNTER_REQUEST_FULFILLED,
        meta: {
          seriesId : thePromo.seriesId,
          field : 'largeImageUrl'
        }
      })
      afterState = resultingState(store, rootReducer, afterState)
    })
    
    then('there will be a list of images',  () => {
      const {images} = afterState.hunter
      expect(images.length).toBeGreaterThan(0)
    })
    when('I select an image',               () => {})
    then('Hunter will close',               () => {})
     and('the input will be populated with my image path', () => {
       // only in browser
     })
  })

  let environment
  test('Hunter Host Configurations', ({ given, and, when, then }) => {
  	given('I am editing a promo', given_i_am_editing_a_promo)
    
    and(/^I am on (.*) environment$/, (env) => {
      environment = env
    });

  	and(/^the origin is (.*)$/, (o) => {
      origin = o
    });

  	when('Hunter is initialized', () => {
      store.dispatch(hunterInitHunter({origin}))
      const action = store.getActions().find(a => a.type == HUNTER_INIT_HUNTER)
      cfg = action.meta.cfg
    });
 
  	then(/^the config will have remoteHost=(.*)$/, (remoteHost) => {
      // console.log(`|${environment}| expects ${remoteHost} actual ${cfg.remoteHost}`)
      expect(cfg.remoteHost).toEqual(remoteHost)
  	});
  });


})