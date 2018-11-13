import {createAction} from 'redux-actions'

// constants
export const FILTER_TYPES = [
  'startDate',
  'endDate',
  'text'
]

// actions
export const SET_FILTERS    = 'filters/SET_FILTERS'
export const UNSET_FILTERS  = 'filters/UNSET_FILTERS'

export const setFilters     = createAction(SET_FILTERS)
export const unsetFilters   = createAction(UNSET_FILTERS)

// reducer
const initialState = []

export const filters = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  
  switch(action.type){

    case UNSET_FILTERS:
      const {type} = action.payload;
      console.log(`UNSET ${type}`)
      return state.filter(f => f.type !== type)
      
    case SET_FILTERS:
      const filters = action.payload
      const filtersTruthy = filters.filter(f => ![undefined,''].includes(f.value))
      // only keep filters in state that dont overlap with incoming
      // that is, that don't have the same type
      return state.filter(filter => {
        return filters.find(f => f.type == filter.type) == undefined
      }).concat(filtersTruthy) // if we passed [{type:'title',value:''}], 
                               // it'll have the effect of removing the title filter
    
    default:
      return state
  }
}

export default filters