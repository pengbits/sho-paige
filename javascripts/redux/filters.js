import {createAction} from 'redux-actions'
import Promo from '../models/Promo'

// constants
export const FILTER_TYPES = [
  'id', // debugging only
  'startDate',
  'endDate',
  'startDateAndEndDate',
  'text'
]

// actions
export const SET_FILTERS    = 'filters/SET_FILTERS'
export const UNSET_FILTERS  = 'filters/UNSET_FILTERS'
export const INIT_FILTERS   = 'filters/INIT_FILTERS'

export const setFilters     = createAction(SET_FILTERS)
export const unsetFilters   = createAction(UNSET_FILTERS)

// reducer
const initialState = [{
  type: 'startDate',
  value: Promo.now()
}]

export const filters = (state=initialState, action={}) => {
  switch(action.type){
    case UNSET_FILTERS:
      const {type} = action.payload;
      return state.filter(f => f.type !== type)
      
    case SET_FILTERS:
      return sanitizePayload(action.payload)
      
    default:
      return state
  }
}

// helpers
// filters.sanitizePayload(array)
// if we dispatched {type:'SET_FILTERS, payload:[{type:'title',value:''}]}, 
// this'll have the effect of removing the title filter from state
// this was already implemented inline in filters reducer above,
// but exporting as helper function so we can apply the logic in other contexts, ie middleware
export const sanitizePayload = (filters=[]) => {
  return filters.filter(f => ![undefined,''].includes(f.value))
}

export default filters

