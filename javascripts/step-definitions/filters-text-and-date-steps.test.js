import moment from 'moment'
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState } from '../mockStore'
import getContentBlockMock from '../mocks/getContentBlock'

// reducers
import rootReducer from '../redux'
import {setFilters,unsetFilters} from '../redux/filters'
import {selectPromo,toggleDetails} from '../redux/promos/actions'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import Promo from '../models/Promo'
import {
  trace,
  diffstr,
  inWindowForEndDate,
  inWindowForStartDate,
  containsTextInSearchableProperty
} from '../step-definition-utils'


defineFeature(
  loadFeature(PAIGE_ROOT + '/features/filters-text-and-date.feature'
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
  
  test('Filter by Text and End Date', ({ given, when, then, pending }) => {
    given('there is a list of promos', given_there_is_a_list_of_promos)

    when(/^I set the filter to 'text:(.+),endDate:(.+)'$/, (textStr,endDateStr) => {
      // unset default filter of startDate:moment()
      store = mockStore(beforeState)
      // todo - SET_DEFAULT_FILTERS and UNSET_DEFAULT_FILTERS looking pretty good right about now
      store.dispatch(unsetFilters({type:'startDate'}))
      beforeState = resultingState(store, rootReducer, beforeState)
      when_i_set_the_filter_to(`text:${textStr},endDate:${endDateStr}`)
    })
    
    then('the list of promos will only contain promos that are in window for the endDate and that have the text in a searchable property', () => {
      const {list,filtered} = afterState.promos
      const {filters}       = afterState
      const endDate         = filters.find(f => f.type == 'endDate').value
      const text            = filters.find(f => f.type == 'text').value
      console.log('promos with a window containing '+Promo.toDateStr(Promo.toDate(endDate))+ ' or in the past of it AND matching `'+text.toLowerCase() +'`')
      // console.log('end-date')
      const endDateMatches = list.filter(promo => {
        return inWindowForEndDate(promo, endDate)
      })
      // console.log(endDateMatches.map(diffstr))
  
      const textMatches = list.filter(promo => {
        return containsTextInSearchableProperty(promo, text)
      })
      // console.log('text')
      // console.log(textMatches.map(diffstr))
      // 
      const matches = endDateMatches.filter(promo => containsTextInSearchableProperty(promo, text))
      // console.log('both')
      console.log(matches.map(diffstr))
      
      expect(matches.map(diffstr)).toEqual(filtered.map(diffstr))
    })

    then('the list of promos will not be empty', () => {
      expect(afterState.promos.filtered.length).toBeGreaterThan(0)
    })
  })

})