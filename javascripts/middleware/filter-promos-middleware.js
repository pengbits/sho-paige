import {
  CREATE_PROMO,
  DELETE_PROMO,
  GET_PROMOS
} from '../redux/promos/types'

import {
  SET_FILTERS,
  UNSET_FILTERS
} from '../redux/filters'

import {
  APPLY_SORT 
} from '../redux/sort'

const FilterPromosMiddleware = store => next => action => {
  if(typeof action =='object'){  // not true of thunks, they'll be functions
  
  let incomingFilters, persistedFilters, meta;
  const stateFilters = store.getState().filters || []

    switch(action.type){
      // give the promos reducer access to the current filter set for cases where it's updating the list
      case `${CREATE_PROMO}_FULFILLED`:
      case `${DELETE_PROMO}_FULFILLED`:
        return next({...action, 'filters':stateFilters })
        break;
        
      // make sure the existing set of filters is preserved when the promos reducer generates its composite filter on change
      // (but only persist filters from state that don't overlap with the incoming filter from the action,
      // that is, that are of a different type)
      case SET_FILTERS:
        incomingFilters  = action.payload
        persistedFilters = stateFilters.filter(filter => {
          return incomingFilters.find(f => f.type == filter.type) == undefined // no overlap
        })
        
        return next({
          ...action,
          payload : incomingFilters.concat(persistedFilters)
        })
        break;
        
      case UNSET_FILTERS:
        const {type}  = action.payload
        meta          = action.meta || {}
        persistedFilters  = stateFilters.filter(f => f.type !== type)

        return next({
          ...action,
          meta: {
            ...action.meta,
            persistedFilters
          }
        })
        return next(action)
      
      case `${GET_PROMOS}_FULFILLED`:
      case APPLY_SORT:
        meta = action.meta || {}
               action.meta = {...meta, filters: stateFilters }
        return next(action)
    }
  }
  
  return next(action)
}

export default FilterPromosMiddleware