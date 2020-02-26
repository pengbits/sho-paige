import { createAction } from 'redux-actions';
import AxiosWrapper from '../utils/axios'
 const axios = () => AxiosWrapper.instance()

import {SERIES_SITE_REGEX} from './promos/utils'
import {CREATE_PROMO} from './promos/types'

// todo - merge with single-content-block reducer as 
// {
//    selected: {...existing contentBlock reducer},
//       list: {this reducer}
// }
// or similar!

// constants
export const GET_CONTEXTS                   = 'content-blocks/GET_CONTEXTS'
export const GET_CONTENT_BLOCKS             = 'content-blocks/GET_CONTENT_BLOCKS'
export const SET_DESTINATION_CONTEXT        = 'content-blocks/SET_DESTINATION_CONTEXT'
export const SET_DESTINATION_CONTENT_BLOCK  = 'content-blocks/SET_DESTINATION_CONTENT_BLOCK'
export const REDIRECT_TO_CONTENT_BLOCK      = 'content-blocks/REDIRECT_TO_CONTENT_BLOCK'

// actions
export const getContexts = () => {
  return {
    type: GET_CONTEXTS,
    payload: axios().get(`/shomin/api/paige/contexts`) // todo pagination
      .then(xhr => {
        const {data} = xhr
        if(data && data.page && data.page.content){
          return data.page.content
        }
        else {
          throw new Error('bad response in GET_CONTEXTS')
        }
      })        
  }
}
export const setDestinationContext      = createAction(SET_DESTINATION_CONTEXT) 
export const setDestinationContentBlock = createAction(SET_DESTINATION_CONTENT_BLOCK)

export const redirectToContentBlock = ({id}) => {
  return function(dispatch, getState) {
    const {editorPath} = getState().contentBlocks.copyingTo || {};
    if(!editorPath) throw new Error('editorPath must be provided in redirectToContentBlock')
    
    return dispatch({
      type: REDIRECT_TO_CONTENT_BLOCK,
      id,
      payload: new Promise((resolve,reject) => {
        console.log(`window.location = '${editorPath}'`) 
        window.location = editorPath
      }) // this is actually never resolved - we just bounce to the new url!
    })
  }
}


// reducer
export const initialState = {
  loading:false,
  contexts: [],
  list: [],
  selectedContext: null,
  selectedList: [],
  copyingTo: null
}

export const sortByName = (list=[]) => {
  return list.sort(function(a,b){
    return a.name.localeCompare(b.name)
  })
}

export const contentBlocks = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;

  switch (action.type ){
    case `${GET_CONTEXTS}_PENDING`:
      return {
        ...state,
        loading: true,
        contexts: []
      }

    case `${GET_CONTEXTS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        contexts: sortByName(action.payload)
      }
    case SET_DESTINATION_CONTEXT:
      const selectedContext =  action.payload.id
      const selectedList    = (state.contexts.find(c => c.id == selectedContext) || {}).contentBlockList
      return {
        ...state,
        selectedContext,
        selectedList: sortByName(selectedList)
      }
      
    case SET_DESTINATION_CONTENT_BLOCK:
      const { id, editorPath } = action.payload
      return {
        ...state,
        loading:true,
        copyingTo:{id,editorPath}
      }
      
    case `${REDIRECT_TO_CONTENT_BLOCK}_PENDING`:
      return {
        ...state,
        copyingTo: undefined
      }
      
    // this state never occurs, promise is not resolved,
    // instead, the client is redirected to the destination context
    // case `${REDIRECT_TO_CONTENT_BLOCK}_FULFILLED`:
    //   return {
    //     ...state,
    //     loading:false,
    //   }
    //   
    default:
      return state
  }
}

export default contentBlocks