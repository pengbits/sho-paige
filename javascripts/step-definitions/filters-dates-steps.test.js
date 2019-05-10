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
import {trace,diffstr,dateShort,inWindowForEndDate,inWindowForStartDate} from '../step-definition-utils'


defineFeature(
  loadFeature(PAIGE_ROOT + '/features/filters-dates.feature'
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
  let filterStartDate
  let filterEndDate
  let currentDate
  


  // ("promos that start before or on the end-date" AND "don't end before the start-date")
  // "OR"
  // ("promos that end after or on the start-date" AND "don't start after the end-date")

  const inWindowForStartAndEndDates = (p, startDate, endDate) => {
    const promo = Promo.fromAttributes(p)
    return (
      ((!promo.getStartDate() || promo.getStartDate().isSameOrBefore(endDate)) && (!promo.getEndDate()   || promo.getEndDate().isSameOrAfter(startDate))) ||
      ((!promo.getEndDate()   || promo.getEndDate().isSameOrAfter(startDate))  && (!promo.getStartDate() || promo.getStartDate().isSameOrBefore(endDate)))
    )
  }

  const given_these_promos = (attrs) => {
    const {promos} = initialState
    const loadedState = {
      ...initialState,
      'promos': {
        ...promos,
        'list' : attrs.map((promo,i) =>{
          const id = promo.id || i+1;
          const startDate = Promo.toTimestamp(Promo.parseDate(promo.startDate))
          const   endDate = Promo.toTimestamp(Promo.parseDate(promo.endDate))
          return {...promo, startDate,endDate, id}
        })
      }
    }
    
    store = mockStore(loadedState)
    beforeState = store.getState()
    expect(beforeState.promos.list).toHaveLength(attrs.length)
  }
  
  const when_i_set_the_filter_to = pairs => {    
    const filters = pairs.split(',').map(str => {
      const matches = /(.+):(.+)/.exec(str)
      const [type,value] = !!matches ? matches.slice(1) : []
      const isDate   = ['startDate','endDate'].includes(type) 
      const isPretty = /\d{2}-\d{2}-\d{4}/.test(value)
      return {
        type,
        value: (value == !isDate ? value : (
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
  
  test('Filter by Start Date', ({ given, when, then, pending }) => {
    given('these promos', given_these_promos)

    when(/^I set the filter to 'startDate:(.+)'$/, (startDateStr) => {
      when_i_set_the_filter_to(`startDate:${startDateStr}`)
    })

    then('the list of promos will only contain promos with a window that contain the startDate or with a window in the future of it', () => {
      const {promos,filters} = afterState
      const {list}   = promos
      const filter    = filters.find(f => f.type == 'startDate')
      const startDate = Promo.toDate(filter.value)
      const matches   = list.filter((p) => inWindowForStartDate(p, startDate))

      expect(afterState.promos.filtered.map(diffstr)).toEqual(matches.map(diffstr))
    })

    then('the list of promos will not be empty', () => {
      expect(afterState.promos.filtered.length).toBeGreaterThan(0)
    })
  })

  
  test('Filter by End Date', ({ given, when, then, pending }) => {
    given('these promos', given_these_promos)

    when(/^I set the filter to 'endDate:(.+)'$/, (endDateStr) => {
      // have to remove the default filter of startDate=moment()
      store = mockStore(beforeState)
      store.dispatch(unsetFilters({type:'startDate'}))
      beforeState = resultingState(store, rootReducer, beforeState)
      when_i_set_the_filter_to(`endDate:${endDateStr}`)
    })

    then('the list of promos will only contain promos with a window that contain the endDate or with a window in the past of it', () => {
      const {promos,filters} = afterState
      const {list}  = promos
      const filter  = filters.find(f => f.type == 'endDate')
      const endDate = Promo.toDate(filter.value)
      const matches = list.filter((p) => inWindowForEndDate(p, endDate))
      expect(afterState.promos.filtered.map(diffstr)).toEqual(matches.map(diffstr))
    })

    then('the list of promos will not be empty', () => {
      expect(afterState.promos.filtered.length).toBeGreaterThan(0)
    })
  })
  
  test('Filter by Start and End Date', ({ given, when, then, pending }) => {
    given('these promos', given_these_promos)

    when(/^I set the filter to 'startDate:(.+),endDate:(.+)'$/, (startDateStr,endDateStr) => {
      when_i_set_the_filter_to(`startDate:${startDateStr},endDate:${endDateStr}`)

    })

    then('the list of promos will only contain promos matching this criteria', (criteria) => {
      const {promos,filters} = afterState
      const {list,filtered}  = promos
      const filter1   = filters.find(f => f.type == 'startDate')
      const filter2   = filters.find(f => f.type == 'endDate')
      const startDate = Promo.toDate(filter1.value)
      const endDate   = Promo.toDate(filter2.value)
      const matches   = list.filter((p) => inWindowForStartAndEndDates(p, startDate, endDate))
      
      //console.log(`filter by ${Promo.toDateStr(startDate)} ${Promo.toDateStr(endDate)}`)
      //console.log(criteria)
      //console.log(list.map(diffstr))
      //console.log(matches.map(diffstr))
      expect(matches.map(diffstr)).toEqual(filtered.map(diffstr))
    })

    then('the list of promos will not be empty', () => {
      expect(afterState.promos.filtered.length).toBeGreaterThan(0)
    })
  })
  
  test('Default Filter', ({ given, when, then, pending }) => {
    given('these promos', given_these_promos)

    given('the filter type has not been set', () => {
      store = mockStore(initialState)
      expect(store.getActions().length).toEqual(0)
    });

    given(/^the date is (.+)$/, (date) => {
      currentDate = Promo.parseDate(date)
    })

    when('the promo-list renders', () => {
      // no-op
    });

    then('the default filter is used \'startDate:moment(new Date())\'', () => {
      const {filters} = beforeState
      const defaultFilter = filters.find(f => f.type == 'startDate')
      expect(defaultFilter).toBeTruthy()
      
      // since our mocks are out of date, let's override the default behavior
      store = mockStore(beforeState)
      store.dispatch(setFilters([{
        type: defaultFilter.type,
        value: Promo.toTimestamp(currentDate)
      }]))
      afterState = resultingState(store, rootReducer, beforeState)
    });
    
    then('the list of promos will only contain promos that are in window for \'startDate:moment(new Date())\'', () => {
      const {promos,filters} = afterState
      const {list,filtered}  = promos
      const matches = list.filter(p => inWindowForStartDate(p, currentDate))
      expect(matches).toEqual(filtered)
    });

    then('the list of promos will not be empty', () => {
      expect(afterState.promos.filtered.length).toBeGreaterThan(0)
    })
  })
})