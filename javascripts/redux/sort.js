import {createAction} from 'redux-actions'

// constants
export const SET_SORT = 'sort/SET_SORT'
export const APPLY_SORT = 'sort/APPLY_SORT'
export const TOGGLE_SORT_DIRECTION = 'sort/TOGGLE_SORT_DIRECTION'

// actions
export const setSort   = createAction(SET_SORT)
export const applySort = createAction(APPLY_SORT)

export const toggleSortDirection = function(){
  return function(dispatch, getState){
    const state = getState().sort
    const {type} = state
    
    return dispatch(setSort({
      type,
      direction: (
        state.direction == SORT_DIRECTION_ASC ? 
          SORT_DIRECTION_DSC : 
          SORT_DIRECTION_ASC
        )
      })
    )
  }
}

export const SORT_DIRECTION_ASC = 'ascending'
export const SORT_DIRECTION_DSC = 'descending'
export const DEFAULT_SORT       = {'type': 'position', 'direction': SORT_DIRECTION_DSC}

// reducer
const initialState={...DEFAULT_SORT}
 
export const sort = (state=initialState, action={}) => {
  state = Object.keys(state).length == 0 ? DEFAULT_SORT : state;
  
  switch(action.type){
    case SET_SORT:
      const type      = action.payload.type      || DEFAULT_SORT.type
      const direction = action.payload.direction || DEFAULT_SORT.direction
      return { 
        type,
        direction
      }

    default:
      return state
  }
} 

export default sort