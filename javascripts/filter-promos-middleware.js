import {
  CREATE_PROMO,
  DELETE_PROMO
} from './redux/promos'
import {
  SET_FILTERS
} from './redux/filters'

const FilterPromosMiddleware = store => next => action => {
  if(typeof action =='object'){  // not true of thunks, they'll be functions
    
  const {filters} = store.getState()
    switch(action.type){
      // give the promos reducer access to the current filter set for cases where it's updating the list:
      case `${CREATE_PROMO}_FULFILLED`:
      case `${DELETE_PROMO}_FULFILLED`:
        return next({...action, filters})
        break;
        
      // and make sure the existing set of filters is preserved when the promos reducer generates its composite filter on change:
      case SET_FILTERS:
        return next({
          ...action,
          payload : action.payload.concat(filters)
        })
        break;
    }
  }
  
  return next(action)
}

export default FilterPromosMiddleware