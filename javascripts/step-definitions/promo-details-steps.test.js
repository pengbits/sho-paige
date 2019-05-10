import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
// import getPromosMock from '../mocks/getPromos'

// reducers
import rootReducer from '../redux'
import reducer from '../redux/promos'
import {
  toggleDetails,
  showDetails,
  hideDetails
} from '../redux/promos/actions'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

defineFeature(
  loadFeature(PAIGE_ROOT + '/features/promo-details.feature'
), test => {
  
  const initialState = reducer()
  let store

  const the_promo_details_are_hidden =  () => {
    store = mockStore({...initialState, detailsVisible: false})
  }
  
  const the_promo_details_are_visible = () => {
    store = mockStore({...initialState, detailsVisible: true})
  }
  
  const the_promo_details_will_be_hidden =  () => {
    expect(resultingState(store, reducer).detailsVisible).toBe(false)
  }

  const the_promo_details_will_be_visible = () => {
    expect(resultingState(store, reducer).detailsVisible).toBe(true)
  }
  
  test('Toggle Details Visibility', ({ given, when, then }) => {
    given('the promo details are hidden', the_promo_details_are_hidden)
     when('I toggle the promo details visibility', () => store.dispatch(toggleDetails()));
     then('the promo details will be visible', the_promo_details_will_be_visible)
  });
  
  test('Show Details', ({ given, when, then }) => {
    given('the promo details are hidden', the_promo_details_are_hidden)
     when('I show the details', () => store.dispatch(showDetails()));
     then('the promo details will be visible', the_promo_details_will_be_visible)
  });
  
  test('Hide Details', ({ given, when, then }) => {
    given('the promo details are visible', the_promo_details_are_visible)
     when('I hide the details', () => store.dispatch(hideDetails()));
     then('the promo details will be hidden', the_promo_details_will_be_hidden)
  });

})