import moment from 'moment'
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import getContentBlockMock from '../mocks/getContentBlock'

// reducers
import rootReducer from '../redux'
import {setFilters,unsetFilters} from '../redux/filters'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'
import {trace} from '../step-definition-utils'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/filters-text.feature'
), test => {
  const contentBlock = getContentBlockMock.payload
  const initialState = rootReducer({
    contentBlock: {
      id: contentBlock.id
    },
    promos: {
      list: contentBlock.promotionList.slice(0)
    }
  })
  
  let store
  let beforeState
  let afterState
  let filter_sequence
  let exception
  
  // Helpers 
  // these functions are needed for anything that appears in multiple step defintions...
  const given_there_is_a_list_of_promos = () => {
    store = mockStore(initialState)
    beforeState = store.getState()
    const {list} = beforeState.promos
    expect(list.length).toBeGreaterThan(0)
  }
  
  const when_i_set_the_filter_to = pairs => {    
    const filters = pairs.split(',').map(str => {
      const matches = /(.+):(.+)/.exec(str)
      const [type,value] = !!matches ? matches.slice(1) : []
      const isDate   = ['startDate','endDate'].includes(type) 
      const isPretty = /\d{2}-\d{2}-\d{4}/.test(value)
      return {
        type,
        value: (!isDate ? value : (
          isPretty ? Promo.toTimestamp(Promo.parseDate(value)) : Number(value)
        ))
      }
    }, {});
    
    // iterate over filters to send in multiple dispatches, like our app
    afterState = filters.reduce((state,filter) => {
      store = mockStore(state)
      store.dispatch(setFilters([filter]))
      return resultingState(store, rootReducer, state)
    }, beforeState)

    expect(afterState.filters).toEqual(expect.arrayContaining(filters))  
  }
  
  const then_the_list_of_promos_will_be_empty = () => {
    expect(afterState.promos.filtered).toHaveLength(0)
  }
  
  const then_the_list_of_promos_will_not_be_empty = () => {
    expect(afterState.promos.filtered.length).toBeGreaterThan(0)
  }

  
  const promos_that_have_this_phrase_in_this_property = (list,phrase,propertyName) => {
    return list.filter(p => { // downcase the property and the search string, the same way our helper will
      return !!p[propertyName] ?  p[propertyName].toLowerCase().indexOf(phrase.toLowerCase()) > -1 : false 
    })
  }
  
  const then_the_list_of_promos_will_only_contain_promos_that_have_this_phrase_in_this_property = (phrase,propertyName) => {
    const {list,filtered} = afterState.promos
    expect(promos_that_have_this_phrase_in_this_property(list,phrase,propertyName)).toHaveLength(filtered.length)
  }
  

  //
  // Filter by Invalid Filter
  // ---------------–-----------------------------------------------------------
  test('Filter by Invalid Filter', ({ given, when, then }) => {
    given('there is a list of promos', given_there_is_a_list_of_promos)
    
    when('I set the filter to something that is not in the list of filter types', () => {
      try { when_i_set_the_filter_to('wibble:true') } 
      catch (e) { exception = e }
    })

    then('an exception is thrown', () => {
      expect(exception.message).toMatch(/Unsupported filter/)
    })
  })
  

  test('Filter by Text', ({ given, when, then }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  (filterStr) => {
      store = mockStore(initialState)
      store.dispatch(unsetFilters({type:'startDate'}))
      beforeState = resultingState(store, rootReducer, beforeState)
      when_i_set_the_filter_to(filterStr)
    })

    then(/^the list of promos will only contain promos that have \'(.+)\' in the title$/, (phrase) => {
      then_the_list_of_promos_will_only_contain_promos_that_have_this_phrase_in_this_property(phrase, 'title')
    })
    then('the list of promos will not be empty', then_the_list_of_promos_will_not_be_empty)
  })
  
  test('Filter by Text and Find Nothing', ({ given, when, then, pending }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  when_i_set_the_filter_to)

    then('the list of promos will be empty', () => {
      then_the_list_of_promos_will_be_empty()
    })
  })
})