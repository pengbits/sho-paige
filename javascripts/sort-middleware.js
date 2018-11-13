import { applySort, SET_SORT, TOGGLE_SORT_DIRECTION, DEFAULT_SORT  } from './redux/sort'
import { GET_PROMOS, CREATE_PROMO } from './redux/promos'

const SortMiddleWare = store => next => action => {
  if(typeof action =='object'){
    switch(action.type){
      
      case `${GET_PROMOS}_FULFILLED`:
      case `${CREATE_PROMO}_FULFILLED`:
        // pull current sort settings from the reducer
        const sort = store.getState().sort || DEFAULT_SORT
        // make sure API response is delivered to promos reducer 
        // before attempting to sort 
        next(action)
        // apply the sort
        return store.dispatch(applySort(sort))
    
      case TOGGLE_SORT_DIRECTION:
      case SET_SORT:
        next(action)
        return store.dispatch(applySort(action.payload))
      
      default:
        return next(action)
    } 
  } else {
    return next(action)
  }
}

export default SortMiddleWare