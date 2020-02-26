import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'

// replace with search query mock!
import getContentBlockMock from '../mocks/getContentBlock'
import mockQueryResponseGenerator from '../mocks/mockQueryResponseGenerator'

// reducers
import rootReducer from '../redux'
import {setFilters} from '../redux/filters'
import reducer from '../redux/promos/reducers'
import { getPromos } from '../redux/promos/actions'
import * as types from '../redux/promos/types'
import appReducer, { setContext, SEARCH_CONTEXT } from '../redux/app'
import {setSort, APPLY_SORT } from '../redux/sort'
import {
  setCurrentSelectedPageNumber, 
  SET_TOTAL_RESPONSE_PAGES, 
  SET_CURRENT_SELECTED_PAGE_NUMBER, 
  SET_RESPONSE_SIZE,
  SET_RESPONSE_PAGE
} from '../redux/pagination'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// utils
import {SEARCHABLE_PROPERTIES} from '../models/Promo'


defineFeature(
  loadFeature(PAIGE_ROOT + '/features/paginate-promos-in-search.feature'
), test => {

  //config
  let store
  let beforeState
  let afterState
  const items_per_page_client = 10
  const items_per_page_server = 100
  const total_num_promos = 250
  
  //user input
  let query
  let selectedPage
  let nextPageToFetch

  //response stuff
	let mockResponse
	let currentResponsePage
  let totalPages
  let nextPage
  let responseSize



  // put the app in the state it would be in if a user was searching for 'affair'
  // this is run before each test
  const i_am_conducting_a_search = () => {
    query = 'affair' 
    store = mockStore(rootReducer({search:{query}}))
    beforeState = resultingState(store, rootReducer, store.getState())

    store.dispatch(setContext(SEARCH_CONTEXT))
    // this is not neccesarry, but helps with debugging how list is being sliced + diced
    store.dispatch(setSort({'type':'id', direction:'ascending'}))
    afterState = resultingState(store, rootReducer, beforeState)
  }
  	
	const there_are_promos_in_the_promo_list = () => {		
    currentResponsePage = 1
		mockResponse = mockQueryResponseGenerator(total_num_promos, currentResponsePage)
    respondWithMockResponse(moxios, mockResponse)
    expect(mockResponse.page.content).toHaveLength(100)
    expect(mockResponse.page.content[0].id).toEqual(1)
    
    beforeState = {...afterState}
		store = mockStore(beforeState)
		return store.dispatch(getPromos())
			.then(() => {
        afterState = resultingState(store, rootReducer, beforeState)
        // console.log('promos.list '+ afterState.promos.list.map(p => p.id).join(', '))
    })
	}
  
  const the_current_page_is = (p) => {
    if(!!p || p == 0){
      store.dispatch(setCurrentSelectedPageNumber(Number(p)))
    } else {
      // pageNumber defaults to 1
      p = 1
    }
    
    beforeState = {...afterState}
    afterState = resultingState(store, rootReducer, beforeState)
    expect(afterState.pagination.currentSelectedPage).toEqual(Number(p))
  }
  
  const promos_for_the_range_will_be_visible = (r) => {
    afterState = resultingState(store, rootReducer, beforeState)
    const {list,paginatedList}   = afterState.promos
    const {currentVisiblePage} = afterState.pagination
    const range = r.split('...').map(r => Number(r))
    
    // console.log(`range: ${range}`)
    // console.log('visible: ' +paginatedList.map(p => p.id).join(', '))
    // console.log('list: ' +list.slice(range[0],range[1]+1).map(p => p.id).join(', '))
    expect(paginatedList.map(p => p.id)).toEqual(list.slice(range[0],range[1]+1).map(p => p.id))
  }

  const when_i_set_a_text_filter = (phrase) => {
    store = mockStore(afterState)
    // update: remove default start-date filter, it interferes with our tests
    store.dispatch(setFilters([{type:'text',value:phrase},{type:'startDate',value:undefined}])) 
    afterState = resultingState(store, rootReducer, afterState)
  }
  
  const only_promos_for_range_with_text_will_be_visible = (range,phrase) => {
    const r = range.split('...').map(n => Number(n))
    const {promos} = afterState
    const {
      list,
      filtered,
      filteredPaginated,
      paginatedList
    } = promos
    // confirm page is what it should be
    expect(paginatedList).toEqual(list.slice(r[0],(r[1]+1)))
    // peform a filter 'by hand' to get expected items
    const matchesForPage = paginatedList.filter(p => (p.name.toLowerCase()).indexOf(phrase) > -1)
    // compare with results
    expect(filteredPaginated.map(p => p.id)).toEqual(matchesForPage.map(p => p.id))
  }
  
  //
  // BEGIN TESTS
  // ---------------------------------------------------------------------------
  beforeEach(function(){ moxios.install();
    i_am_conducting_a_search();
  })
  
  afterEach(function(){ moxios.uninstall() })
  
  test('The PromoList displays the correct promos for the first page', ({ given, when, then, pending }) => {
    given('there are promos in the PromoList', there_are_promos_in_the_promo_list)
    when(/^the currentSelectedPage is not set and default value is used$/, the_current_page_is)
    then(/^promos for the range (\d+...\d+) will be visible$/, promos_for_the_range_will_be_visible)
  });
  
  test('The PromoList displays the correct promos for the second page', ({ given, when, then, pending }) => {
    given('there are promos in the PromoList', there_are_promos_in_the_promo_list)
    when(/^the currentSelectedPage is set to (\d)+$/, the_current_page_is)
    then(/^promos for the range (\d+...\d+) will be visible$/, promos_for_the_range_will_be_visible)
  });

  test('The number of pagination pages will be set based on the size of the response', ({ given, when, then, pending }) => {
    given('there are promos in the PromoList', there_are_promos_in_the_promo_list)
    
    given('the search response has a size property greater than 0', () => {
      expect(mockResponse.size).toBeGreaterThan(0)
    })
    
    then('a corresponding number of pagination pages (totalResponsePages) will be set', () => {
			expect(mockResponse.totalPages).toBeGreaterThan(0)
			const totalExpectedPages   = Math.ceil(total_num_promos / items_per_page_server)
			expect(afterState.pagination.totalResponsePages).toEqual(totalExpectedPages)
    });
  });

  test('The paginatedList displays promos that correspond to the currentSelectedPage', ({ given, when, then, pending }) => {
    given('the PromoList contains more than 10 promos', there_are_promos_in_the_promo_list)

    given('the currentSelectedPage is set', () => {
      expect(afterState.pagination.currentSelectedPage).toEqual(1)
      expect(afterState.pagination.shouldPaginate).toEqual(true)
    });

    when('a new currentSelectedPage is selected', () => {
      the_current_page_is(3)
      
      // EXPECT THESE ACTIONS WITH APPLY_SORT DISABLED
      // expectActions(store, [
      //   `${types.GET_PROMOS}_PENDING`,
      //   SET_TOTAL_RESPONSE_PAGES,
      //   SET_RESPONSE_SIZE,
      //   `${types.GET_PROMOS}_FULFILLED`,
      //   SET_CURRENT_SELECTED_PAGE_NUMBER
      // ])  
      // EXPECT THESE ACTIONS WITH APPLY_SORT ENABLED
      expectActions(store, [
        `${types.GET_PROMOS}_PENDING`,
        SET_TOTAL_RESPONSE_PAGES,
        SET_RESPONSE_SIZE,
        `${types.GET_PROMOS}_FULFILLED`,
        APPLY_SORT,
        SET_CURRENT_SELECTED_PAGE_NUMBER
      ])  
    });

    then('the paginatedList will display up to 10 promos that correspond to the new currentSelectedPage', () => {
      promos_for_the_range_will_be_visible('20...29')
    })
  });

  test('There are more pages of results than are initially visible', ({ given, when, then, pending }) => {
    let currentSelectedPage, expectedNextPage;
    
    given('there is a full page of promos in the PromoList', there_are_promos_in_the_promo_list);
 
    given('the currentSelectedPage is set', () => {
      currentSelectedPage = afterState.pagination.currentSelectedPage
      currentResponsePage = afterState.pagination.currentResponsePage
      expect(currentSelectedPage).toEqual(1)
      expect(currentResponsePage).toEqual(1)
    });
    
    given('the search response points to a nextPage of promos', () => {
      expectedNextPage = currentSelectedPage+1
      expect(mockResponse.nextPage).toContain(`/paige/promotions/${expectedNextPage}`) 
    });
    
    when('I select a currentSelectedPage outside the visible range', () => {
      currentSelectedPage = (items_per_page_client + 1)
      mockResponse = mockQueryResponseGenerator(total_num_promos, (currentResponsePage+1))
      respondWithMockResponse(moxios, mockResponse)

      return store.dispatch(setCurrentSelectedPageNumber(currentSelectedPage))
        .then(xhr => afterState = resultingState(store, rootReducer, beforeState))
    });

    when('the next page number to fetch will be different from the last page number that was returned from the server', () => {
      nextPageToFetch = Math.ceil((currentSelectedPage * items_per_page_client)/items_per_page_server)
      // console.log(`currentSelectedPage:${currentSelectedPage} nextPageToFetch:${nextPageToFetch}`)
      expect(currentResponsePage).not.toEqual(afterState.pagination.currentResponsePage)
      expect(nextPageToFetch).toEqual(afterState.pagination.currentResponsePage)      
    });

    then('the search api will be called to fetch the next page', () => {
      const actionList = store.getActions().map(a => a.type)
      expect(actionList).toContain(SET_RESPONSE_PAGE)
      expect(actionList.filter(type => type == `${types.GET_PROMOS}_FULFILLED`)).toHaveLength(2)      
    })
  })

  test('Paginated search results with filter applied page 1', ({ given, when, then }) => {
    given('there are promos in the PromoList',    there_are_promos_in_the_promo_list)
    when(/^the currentSelectedPage is set to (\d+)$/, the_current_page_is)
    when(/^I set the filter to 'text:(.+)'$/,     when_i_set_a_text_filter)
    then(/^only promos from the range (\d+...\d+) that have '(.+)' in the title will be visible$/, only_promos_for_range_with_text_will_be_visible)
  })
  
  test('Paginated search results with filter applied page 2', ({ given, when, then }) => {
    given('there are promos in the PromoList',    there_are_promos_in_the_promo_list)
    when(/^the currentSelectedPage is set to (\d+)$/, the_current_page_is)
    when(/^I set the filter to 'text:(.+)'$/,     when_i_set_a_text_filter)
    then(/^only promos from the range (\d+...\d+) that have '(.+)' in the title will be visible$/, only_promos_for_range_with_text_will_be_visible)
  })
  
  test('Pagination is not needed when there are less than ten results', ({ given, when, then  }) => {
    given('there are ten items or less in the PromoList', () => {
  		mockResponse = mockQueryResponseGenerator(10, 1)
      respondWithMockResponse(moxios, mockResponse)
  
      beforeState = {...afterState}
  		store = mockStore(beforeState)
  		return store.dispatch(getPromos()).then(() => afterState = resultingState(store, rootReducer, beforeState))
    })
  
    given('the currentSelectedPage is set', the_current_page_is)
  
    then('shouldPaginate will be false', () => {
      const {pagination} = afterState
      expect(pagination.shouldPaginate).toEqual(false)
    })
  })
  
  test('Filters are reset when page changes', ({ given, when, then }) => {
    let filteredResultsPage2
    given('there are promos in the PromoList', there_are_promos_in_the_promo_list)
  
    given('the filter and currentSelectedPage are set', () => {
      the_current_page_is(2)
      when_i_set_a_text_filter('bacon')
      expect(afterState.pagination.currentSelectedPage).toEqual(2)
      filteredResultsPage2 = afterState.promos.filteredPaginated.slice(0)
      expect(filteredResultsPage2.length).toBeGreaterThan(0)
      // console.log(`p2 ${filteredResultsPage2.map(p => p.id).join(', ')}`)
    })
  
    when('I change the currentSelectedPage', () => {
      store = mockStore(afterState)
      the_current_page_is(3)
    })
  
    then('the filtered paginated list is refreshed', () => {
      // console.log(`p3 ${afterState.promos.filteredPaginated.map(p => p.id).join(', ')}`)
      expect(afterState.promos.filteredPaginated).not.toEqual(filteredResultsPage2)
    })
  })

})

