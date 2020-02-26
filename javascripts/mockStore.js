import promiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import FormHooksMiddleware from './middleware/form-hooks-middleware'
import FilterPromosMiddleware from './middleware/filter-promos-middleware'
import SortMiddleware from './middleware/sort-middleware'
import PaginationMiddleware from './middleware/pagination-middleware'
import CopyToContentBlockMiddleware from './middleware/copy-to-content-block-middleware'
import HunterAdapterMiddleware from './middleware/hunter-adapter-middleware'

const middlewares = [
  FormHooksMiddleware,
  FilterPromosMiddleware,
  SortMiddleware,
  PaginationMiddleware,
  CopyToContentBlockMiddleware,
  HunterAdapterMiddleware,
  promiseMiddleware(),
  thunk.withExtraArgument({'isRootReducer': false})
]

const mockStore = configureStore(middlewares)
export default mockStore

// helpers
export const expectActions = (store, expected) => {
  const actions = store.getActions();
  expect(actions).toHaveLength(expected.length)
  expect(actions.map(a => a.type)).toEqual(expected);  
}

// return state by running actions through the reducer
export const resultingState = (store, reducer, state) => {
  return store.getActions().reduce((state, action) => {
   return reducer(state, action)
 }, state || {})
}

export const respondWithMockResponse = (moxios, response) => {
  moxios.wait(() => {
    moxios.requests.mostRecent().respondWith({
      status: 200,
      response
    });
  });
}

export const respondWithMockFailure = (moxios, response) => {
  moxios.wait(() => {
    moxios.requests.mostRecent().respondWith({
      status: 404,
      response: { message: 'problem' },
    });
  });
}
