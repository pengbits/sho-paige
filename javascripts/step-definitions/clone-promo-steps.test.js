import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from '../mockStore'
import getContentBlock from '../mocks/getContentBlock'
const ContentBlockMock = getContentBlock.payload
// reducers
import rootReducer from '../redux'
import reducer from '../redux/promos'

import {
  clonePromo, 
  createPromo,
  setAttributes
} from '../redux/promos/actions'

import {
  SET_ATTRIBUTES,
  CREATE_PROMO
} from '../redux/promos/types'

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
  
  const initialState = rootReducer({})
  
  let store
  let state
  let beforeState
  let afterState
  let thePromo
  let theClone
  let attrs
  let response
  let action
  let error
  
  
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
  
  const when_i_clone_a_promo = (opts={}) => {
    const {list} = beforeState.promos
    const i  = Math.floor(Math.random() * list.length)
    thePromo = list[i]
    action   = clonePromo({id: thePromo.id}, opts)
  }
  
  const when_i_submit = (response) => {
    respondWithMockResponse(moxios, response);
    
    return store.dispatch(action)
  }

  const get_expected_clone_attrs = (startDate,endDate) => {
    const {list} = beforeState.promos
    const promoCopyRegex = Promo.promoCopyRegex()
    const promoName = thePromo.name

    const matchingNames = list.filter(p => {
      let nameFromList = p.name.replace(promoCopyRegex, "")
      return nameFromList === promoName
    })

    const highestCopyNumber = matchingNames.map(p => {
      let match = p.name.match(promoCopyRegex)
      return match ? Number(match[1]) : 0
    }).reduce((prev, cur) => prev > cur ? prev : cur)

    const copyNumber = highestCopyNumber + 1

    attrs = {
      ...thePromo,
      'id'  : randomId(),
      'name': thePromo.name.replace(promoCopyRegex, "") + " (Copy " + copyNumber + ")"
    }
    if(startDate) attrs.startDate = startDate 
    if(endDate)   attrs.endDate   = endDate 
    
    return attrs
  }

  const randomId = () => (Math.floor(Math.random() * 100))
  
  test('Clone a Promo', ({ given, when, then }) => {
    given('there is a list of Promos', () => {
      given_there_is_a_list_of_promos()
    });
    
    when('I clone a promo', () => {
      when_i_clone_a_promo({offsetDuration:false})
      get_expected_clone_attrs()
    });
    
    when('I submit', () => {
      return when_i_submit({payload: attrs})
        .then(()=>{
          expectActions(store, [
            SET_ATTRIBUTES,
            `${CREATE_PROMO}_PENDING`,
            `${CREATE_PROMO}_FULFILLED`,
            APPLY_SORT
          ])
          afterState = resultingState(store, rootReducer, beforeState)
        })
    })

    then('the list contains a copy of the promo with \'(Copy 1)\' in the name', () => {
      const {list} = afterState.promos
      const match = list.find(p => {
       return p.name.indexOf(thePromo.name) > -1 && 
              p.name.indexOf('(Copy 1)') > -1
      })
      expect(match).toBeTruthy()
      expect(match.position).toEqual(thePromo.position)
    });
  });
  
  const serializeDates = (json) => {
    return ['startDate','endDate'].reduce((data,key) => {
        data[key] = Promo.toTimestamp(Promo.parseDate(json[key]))
      return data
    },{})
  }
  
  test('Clone a Promo with Offset Duration Ray Next-Ons', ({ given, when, then,  }) => {
    given('there is a promo with these attributes', (json) => {
      attrs = serializeDates(JSON.parse(json))
      thePromo = Promo.fromAttributes(attrs)
    })

    when('I clone it with \'offset-duration=true\'', () => {
      theClone = thePromo.clone({'offsetDuration':true})
    })

    then('the clone will have these attributes', (json) => {
      attrs = JSON.parse(json)
      expect(attrs.startDate).toEqual(Promo.toDateStr(theClone.getStartDate()))
      expect(attrs.endDate).toEqual(Promo.toDateStr(theClone.getEndDate()))
    })
  });

  test('Cloning a Promo with Offset Duration is not allowed without Start and End Dates', ({ given, when, then, pending }) => {
    given('there is a list of Promos', () => {
      given_there_is_a_list_of_promos()
    });

    when('I clone a promo with \'offset-duration=true\'', () => {
      when_i_clone_a_promo({offsetDuration:true})
    });
    
  	given('the promo does not have a start and end date', () => {
      const match = beforeState.promos.list.find(p => p.id == thePromo.id)
      const {startDate,endDate, ...attrs} = match
      thePromo = attrs
    })
    
  	when('I submit', () => {
      try {
        const promo = Promo.fromAttributes(thePromo)
        const {startDate,endDate} = promo.getOffsetDuration() 
      } catch(e) {
        error = e
      }
    })

  	then('there will be an error', () => {
      expect(error.message).toEqual('startDate and endDate are required for clone with offset duration')
    });

  })

  test('Clone a Promo Multiple Times', ({ given, when, then, pending }) => {
    given('there is a list of Promos', () => given_there_is_a_list_of_promos());

    when('I clone a promo once', () => {
      when_i_clone_a_promo()
      get_expected_clone_attrs()
      expect(attrs.name).toMatch(/\(Copy 1\)$/)
    });

    when('I submit once', () =>  {
      return when_i_submit({payload: attrs})
        .then(() => afterState = resultingState(store, rootReducer, beforeState))
    })

    when('I clone a promo twice', () => {
      beforeState = {...afterState}
      action = clonePromo({id: thePromo.id})
      get_expected_clone_attrs()
      expect(attrs.name).toMatch(/\(Copy 2\)$/)
    })
    
    when('I submit twice', () =>  {
      return when_i_submit({payload: attrs})
        .then(() => afterState = resultingState(store, rootReducer, beforeState))
    })
    
    when('I clone a promo three times', () => {
      beforeState = {...afterState}
      action = clonePromo({id: thePromo.id})
      get_expected_clone_attrs()
      expect(attrs.name).toMatch(/\(Copy 3\)$/)
    })

    when('I submit three times', () =>  {
      return when_i_submit({payload: attrs})
        .then(() => {
          afterState = resultingState(store, rootReducer, beforeState)
        })
    })

    
    then('the list contains a copy of the promo with \'(Copy 3)\' in the name', () => {
      const {list} = afterState.promos
      const match = afterState.promos.list.find(p => p.name == attrs.name && p.id == attrs.id)
      expect(match).toBeTruthy()
    });
  })
})