import {
  SET_CURRENT_SELECTED_PAGE_NUMBER,
  setResponsePage, SET_RESPONSE_PAGE,
  ITEMS_PER_PAGE_CLIENT,
  ITEMS_PER_PAGE_SERVER
} from '../redux/pagination'

import {
  SET_FILTERS
} from '../redux/filters'

import {
  APPLY_SORT
} from '../redux/sort'

import {getPromos}  from '../redux/promos/actions'
import {GET_PROMOS} from '../redux/promos/types'

const PaginationMiddleware = store => next => action => {
  // console.log(action)
  if(typeof action =='object'){
    
    let meta
    let currentVisiblePage
    let currentSelectedPage
    const {type} = action
    
    switch(type){  
      case SET_CURRENT_SELECTED_PAGE_NUMBER:
        // console.log(`|middlwr| `+JSON.stringify(action))
      
        const {filters,pagination}  = store.getState()
        const {currentResponsePage} = (pagination || {})
        const pageNumber            = action.payload
        const desiredResponsePage   = Math.ceil((pageNumber * ITEMS_PER_PAGE_CLIENT) / ITEMS_PER_PAGE_SERVER)

        // if there are active filters, the list of promos for the page 
        // will need to be refreshed, pass the filter state along for providers reducer...
        meta = action.meta || {} 
        action.meta = {...meta, filters}
        
        if(desiredResponsePage !== currentResponsePage) {
          // console.log(`|middlwr| we need a fetch! ${currentResponsePage} => ${desiredResponsePage}`)
          next(action) && store.dispatch(setResponsePage({pageNumber: desiredResponsePage}))
          return store.dispatch(getPromos(desiredResponsePage))
        } else {
          // console.log(`|middlwr| clientside only just fwd the action`)
          return next(action)
        }
        
      case `${GET_PROMOS}_FULFILLED`:
      case SET_FILTERS:
      case APPLY_SORT:
        currentSelectedPage = (store.getState().pagination || {}).currentSelectedPage 
        currentVisiblePage  = getCurrentVisiblePage(currentSelectedPage)
        // console.log(`|middlwr| currentVisible state=${store.getState().pagination.currentVisiblePage} fn()=${currentVisiblePage}`)
        meta = action.meta || {}; action.meta = {...meta, currentVisiblePage}
        return next(action)
      
      default:
        if(action.type) {
          return next(action)
        } else {
          console.log(action)
        }  
    }
    
  } else {
    return next(action)
  }
}

const getCurrentVisiblePage = (currentSelectedPage) => {
  return ((currentSelectedPage-1) % ITEMS_PER_PAGE_CLIENT) + 1
  
}

export default PaginationMiddleware