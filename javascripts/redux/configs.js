import { createAction } from 'redux-actions';

export const SET_CONFIG = 'configs/SET_CONFIG'
export const setConfig  = createAction(SET_CONFIG) 
const initialState = {}
export const configs = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  
  switch (action.type ){
    case SET_CONFIG:
      const {payload} = action
      return Object.assign({}, state, payload)

    default:
      return state
  }
}

export default configs