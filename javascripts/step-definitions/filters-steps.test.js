import moment from 'moment'
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import getContentBlockMock from '../mocks/getContentBlock'

// reducers
import rootReducer from '../redux'
import {setFilter,setFilters} from '../redux/filters'
import {generateCompositeFilter} from '../redux/promos'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'
import {trace} from '../step-definition-utils'

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/filters.feature'
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
  
  // Helpers 
  // these functions are needed for anything that appears in multiple step defintions...
  const given_there_is_a_list_of_promos = () => {
    store = mockStore(initialState)
    beforeState = store.getState().promos
    const {list} = beforeState
    expect(list.length).toBeGreaterThan(0)
  }
  
  const when_i_set_the_filter_to = pairs => {    
    const filters = pairs.split(',').map(str => {
      const matches = /(.+):(.+)/.exec(str)
      const [type,value] = !!matches ? matches.slice(1) : []
      return {type,value}
    }, {});
    
    // iterate over filters to send in multiple dispatches, like our app
    afterState = filters.reduce((state,filter) => {
      store = mockStore(state)
      store.dispatch(setFilters([filter]))
      return resultingState(store, rootReducer, state)
    }, initialState)

    expect(afterState.filters).toEqual(expect.arrayContaining(filters))  
  }
  
  const then_the_list_of_promos_will_be_empty = () => {
    expect(afterState.promos.filtered).toHaveLength(0)
  }
  
  const then_the_list_of_promos_will_not_be_empty = () => {
    expect(afterState.promos.filtered.length).toBeGreaterThan(0)
  }
  
  const then_the_list_of_promos_will_only_contain_promos_that_start_on_or_after = (startDateStr) => {
    const startDate       = Number(startDateStr)
    const {list,filtered} = afterState.promos
    const matches         = list.filter(p => {
      return moment(p.startDate).isSameOrAfter(moment(Number(startDateStr)))
    })

    console.log(`|filters| start on or after ${Promo.toDateStr(startDate)}:`)
    trace('list',    list,  'startDate')
    trace('expects', matches,  'startDate')
    trace('results', filtered, 'startDate')
    expect(filtered).toEqual(matches)
  }
  
  const then_the_list_of_promos_will_only_contain_promos_that_start_on_or_after_and_end_on_or_before = (startDateStr,endDateStr) => {
    const startDate       = Number(startDateStr)
    const endDate         = Number(endDateStr)
    const {list,filtered} = afterState.promos
    const matches         = list.filter(p => {
      return (
        moment(p.startDate).isSameOrAfter(moment(startDate)) &&
        moment(p.endDate).isSameOrBefore(moment(endDate))
      )
    })

    console.log(`start on or after ${Promo.toDateStr(startDate)} AND end on or before ${Promo.toDateStr(endDate)}`)
    trace('list',    list,     'startDate','endDate')
    trace('expects', matches,  'startDate','endDate')  
    trace('results', filtered, 'startDate','endDate')
    expect(filtered).toEqual(matches)
  }
  
  const promos_that_end_on_or_before = (list,endDateStr) => {
    const endDate = Number(endDateStr)
    return list.filter(p => {
      return moment(p.endDate).isSameOrBefore(moment(endDate)) 
    })
  }
  
  const then_the_list_of_promos_will_only_contain_promos_that_end_on_or_before = (endDate) => {
    const {list,filtered} = afterState.promos
    expect(promos_that_end_on_or_before(list,endDate)).toHaveLength(filtered.length)
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
  // 01 Filter by Start Date
  // ---------------–-----------------------------------------------------------
  test('Filter by Start Date', ({ given, when, then }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  when_i_set_the_filter_to)
    
    then(/^the list of promos will only contain promos that start on or after '(.+)'$/, (startDate) => {
      then_the_list_of_promos_will_only_contain_promos_that_start_on_or_after(startDate)
    })
    then('the list of promos will not be empty', then_the_list_of_promos_will_not_be_empty)
  })
  
  
  //
  // 02 Filter by Start and End Date
  // ---------------–-----------------------------------------------------------
  test('Filter by Start and End Date', ({ given, when, then }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  when_i_set_the_filter_to)
    
    then(/^the list of promos will only contain promos that start on or after '(.+)' and end on or before '(.+)'$/, (startDate,endDate) => {
      then_the_list_of_promos_will_only_contain_promos_that_start_on_or_after_and_end_on_or_before(startDate,endDate)
    })
    then('the list of promos will not be empty', then_the_list_of_promos_will_not_be_empty)
  });
  
  
  //
  // 03 Filter by Invalid Date
  // ---------------–-----------------------------------------------------------
  let exception
  test('Filter by Invalid Date', ({ given, when, then }) => {
    given('there is a list of promos',       given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,     when_i_set_the_filter_to)
    then('the list of promos will be empty', then_the_list_of_promos_will_be_empty)
  })
  

  //
  // 04 Filter by Invalid Filter
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
  
  //
  // 04 Filter by Text
  // ---------------–-----------------------------------------------------------  
  test('Filter by Text', ({ given, when, then }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  when_i_set_the_filter_to)

    then(/^the list of promos will only contain promos that have \'(.+)\' in the title$/, (phrase) => {
      then_the_list_of_promos_will_only_contain_promos_that_have_this_phrase_in_this_property(phrase, 'title')
    })
    then('the list of promos will not be empty', then_the_list_of_promos_will_not_be_empty)
  })


  //
  // 04 Filter by Text and End Date
  // ---------------–-----------------------------------------------------------  
  test('Filter by Text and End Date', ({ given, when, then, pending }) => {
    given('there is a list of promos',     given_there_is_a_list_of_promos)  
    when(/^I set the filter to '(.+)'$/,   when_i_set_the_filter_to)

    then(/^the list of promos will only contain promos that have \'(.+)\' in the title and that end on or before '(.*)'$/, (phrase, endDate) => {
      const {list,filtered} = afterState.promos
      const list1 = promos_that_have_this_phrase_in_this_property(list,phrase,'title')
      const list2 = promos_that_end_on_or_before(list1, endDate)
      console.log(`|filters| promos with '${phrase}' in title, ending on ${Promo.toDateStr(Number(endDate))}`)

      trace('list',    list,     'endDate', 'title')
      trace('expects', list2,    'endDate', 'title')
      trace('results', filtered, 'endDate', 'title')
      expect(filtered).toEqual(list2)
    });
    
    then('the list of promos will not be empty', () => {
      then_the_list_of_promos_will_not_be_empty()
    })
  });
  
  test('Filter by Text and Find Nothing', ({ given, when, then, pending }) => {
    given('there is a list of promos',    given_there_is_a_list_of_promos)
    when(/^I set the filter to '(.+)'$/,  when_i_set_the_filter_to)

    then('the list of promos will be empty', () => {
      then_the_list_of_promos_will_be_empty()
    })
  })
})