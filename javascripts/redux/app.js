import {createAction} from 'redux-actions'

// constants
export const SET_CONTEXT           = 'app/SET_CONTEXT'
export const CONTENT_BLOCK_CONTEXT = 'app/CONTENT_BLOCK_CONTEXT'
export const SEARCH_CONTEXT        = 'app/SEARCH_CONTEXT'

// actions
export const setContext = createAction(SET_CONTEXT)

const initialState = {
  context: undefined
}

export const app = (state={}, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  switch(action.type){
    
    case SET_CONTEXT:
      const context = action.payload
      if(![SEARCH_CONTEXT,CONTENT_BLOCK_CONTEXT].includes(context)){
        throw new Error(`unsupported context ${context}`)
      }
      return {
        ...state,
        context
      }
      
    default:
     return state
  }
}

export default app