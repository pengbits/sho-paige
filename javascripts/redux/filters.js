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
      const filters = action.payload
      return filters.filter(f => ![undefined,''].includes(f.value))
      // if we passed [{type:'title',value:''}], 
      // it'll have the effect of removing the title filter

      
      
    default:
      return state
  }
}

export default filters