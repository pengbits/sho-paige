import { createAction } from 'redux-actions';
import AxiosWrapper from '../utils/axios'
 const axios = () => AxiosWrapper.instance()

// constants
export const SET_CONTENT_BLOCK      = 'content-block/SET_CONTENT_BLOCK'
export const RENAME_CONTENT_BLOCK   = 'content-block/RENAME_CONTENT_BLOCK'
export const UPDATE_CONTENT_BLOCK   = 'content-block/UPDATE_CONTENT_BLOCK'
export const EDIT_CONTENT_BLOCK     = 'content-block/EDIT_CONTENT_BLOCK'
export const CANCEL_EDITING_CONTENT_BLOCK = 'content-block/CANCEL_EDITING_CONTENT_BLOCK'

// action creators
export const cancelEditingContentBlock = createAction(CANCEL_EDITING_CONTENT_BLOCK)
export const setContentBlock = createAction(SET_CONTENT_BLOCK)
export const editContentBlock = createAction(EDIT_CONTENT_BLOCK)
export const renameContentBlock = ({name}) => {
  return (dispatch, getState, opts) => {
    const attrs = getState().contentBlock;
    if(!attrs.id || !attrs.contextId) throw new Error('can\'t rename contentBlock without providing a contentBlockId and contextId')

    return dispatch(updateContentBlock({
      id: attrs.id,
      name: name,
      contextId: attrs.contextId,
      contentBlockKey: attrs.contentBlockKey,
    }))
  }
}

export const updateContentBlock = (data) => {
  const {id} = data
  const url  = `/shomin/api/paige/content-block/${id}`
  
  return {
    type: UPDATE_CONTENT_BLOCK,
    payload: axios().put(url, data)
    .then(xhr => xhr.data)
    .catch(e => e)
  }
}


// selectors/utils
// this is used as a store for the form defaults...
// but it's not great since there is an existing property with this name,
// the difference being it contains a database id as part of the value, and is therefor not predictable,
// so can't be used for configured defaults (where we want the same rules to apply across every instance of 'recaps', not just 'billions recaps', for example)
export const getKeyFromContentBlock = (state=initialState) => {
   return (state.name || '').toLowerCase().replace(' ','-')
}

// reducer
export const initialState = {
  id: undefined,
  name: undefined,
  contextId: undefined,
  contentBlockKey: undefined,
  isEditing: false
};

export const contentBlock = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  
  switch (action.type ){
    case EDIT_CONTENT_BLOCK:
      return {
        ...state,
        isEditing: true        
      }

    case CANCEL_EDITING_CONTENT_BLOCK:
      return {
        ...state,
        isEditing: false        
      }
      
    case SET_CONTENT_BLOCK:
      const {
        id,
        name,
        contextId,
        contentBlockKey
      } = action.payload
      return {
        ...state,
        id,
        name,
        contextId,
        contentBlockKey,
        isEditing: false
      }
      
    case `${UPDATE_CONTENT_BLOCK}_FULFILLED`:
      const renamed = action.payload.payload.name;
      return {
        ...state,
        name: renamed,
        isEditing: false       
      }  

    default:
      return state
  }
}

export default contentBlock