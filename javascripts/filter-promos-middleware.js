import {
  CREATE_PROMO,
  DELETE_PROMO
} from './redux/promos'

const FilterPromosMiddleware = store => next => action => {
  if(typeof action =='object'){  // not true of thunks, they'll be functions
    
    switch(action.type){
      // give the promos reducer access to the current filter set
      case `${CREATE_PROMO}_FULFILLED`:
      case `${DELETE_PROMO}_FULFILLED`:
        const {filters} = store.getState()
        return next({...action, filters})
        break;
    }
  }
  
  return next(action)
}

export default FilterPromosMiddleware