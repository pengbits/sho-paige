import moxios from 'moxios'
import "babel-polyfill"
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse } from '../mockStore'
import getContentBlock from '../mocks/getContentBlock'

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
  
  const initialState = reducer({
    list: getContentBlock.payload.promotionList
  })
  
  let store
  let state
  let thePromo
  let theClone
  let attrs
  let response
  let action
  let error
  
  
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
  }

  const create_promo_copy = (startDate,endDate) => {
    const {list} = resultingState(store, reducer, state)
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
    if(endDate) attrs.endDate = endDate 
  }

  const randomId = () => (Math.floor(Math.random() * 100))
  
  test('Clone a Promo', ({ given, when, then }) => {
    given('there is a list of Promos', () => {
      given_there_is_a_list_of_promos()
    });
    
    when('I clone a promo', () => {
      when_i_clone_a_promo({offsetDuration:false})
      create_promo_copy()
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
        })
    })

    then('the list contains a copy of the promo with \'(Copy 1)\' in the name', () => {
      const {list} = resultingState(store, reducer, state)
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
      state.list = state.list.map(p => {
        if(p.id == thePromo.id){
          const {startDate,endDate,...attrs} = p
          thePromo = attrs
          return attrs
        } else {
          return p
        }
      })

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
      create_promo_copy()
    });

    when('I submit once', () =>  when_i_submit({payload: attrs}))

    when('I clone a promo twice', () => create_promo_copy());

    when('I submit twice', () =>  when_i_submit({payload: attrs}))

    when('I clone a promo three times', () => create_promo_copy());

    when('I submit three times', () => when_i_submit({payload: attrs}))
    
    then('the list contains a copy of the promo with \'(Copy 3)\' in the name', () => {
      const {list} = resultingState(store, reducer, state)
      const match = list.find(p => {
        return p.name.indexOf(thePromo.name) > -1 && 
              p.name.indexOf('(Copy 3)') > -1
      })
      expect(match).toBeTruthy()
      expect(match.position).toEqual(thePromo.position)
    });
  })
})