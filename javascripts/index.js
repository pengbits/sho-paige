// imports:react
import React from 'react'
import { render } from 'react-dom'

// imports:redux
import { connect, Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { reducer as formReducer } from 'redux-form'

// imports:redux-async
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware'
// import promiseMiddleware from 'redux-promise';

// imports:app
import {rootReducer as reducer} from './redux'
import FormHooksMiddleware from './middleware/form-hooks-middleware'
import FilterPromosMiddleware from './middleware/filter-promos-middleware'
import SortMiddleware from './middleware/sort-middleware'
import PaginationMiddleware from './middleware/pagination-middleware'
import CopyToContentBlockMiddleware from './middleware/copy-to-content-block-middleware'
import HunterAdapterMiddleware from './middleware/hunter-adapter-middleware';
import App from './containers/AppContainer'

// init dev tools & store
const initStore = (initialState={}) => {
  const k = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
  const opts = {'name':'Paige','actionsBlacklist' : ['@@router/LOCATION_CHANGE','@@redux-form']} // these get noisy
  const composeEnhancers = window[k] ? window[k](opts) : compose;

  return createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        FormHooksMiddleware,
        FilterPromosMiddleware,
        SortMiddleware,      
        PaginationMiddleware,
        CopyToContentBlockMiddleware,
        HunterAdapterMiddleware,
        promiseMiddleware(),
        thunk.withExtraArgument({'isRootReducer': true})
      )
    )
  )
}

export default class {
  constructor(el) {
    const {
      contentBlockId,
      contextId,
      contentBlockName,
      contentBlockKey,
      searchQuery
    } = this.getContainerAttributes(el)
    
    const store = initStore({
      'contentBlock': {
        'id'   : contentBlockId ? Number(contentBlockId) : undefined,
        'contextId' : contextId ? Number(contextId) : undefined,
        'name' : contentBlockName,
        'contentBlockKey': contentBlockKey
      },
      'search' : {
        'query' : searchQuery 
      }
    })

    render(
      <Provider store={store}>
        <div className="container container-tool paige-content-manager">
          <App />
        </div>
      </Provider>,
      el
    );
  } 
  
  getContainerAttributes(el){
    return [
      'contentBlockId',
      'contextId',
      'contentBlockName',
      'contentBlockKey',
      'searchQuery'
    ].reduce(function(obj,key){
      obj[key] = (el.dataset[key])
      return obj
    },{})
  }
}
