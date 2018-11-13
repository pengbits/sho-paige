import {createAction} from 'redux-actions'

// constants


// actions
// reducer
const initialState = {
  query: undefined
}

export const search = (state=initialState, action={}) => {
  // // use initialState if empty object is passed as first argument
  // state = Object.keys(state).length == 0 ? initialState : state;
  return state
}

export default search