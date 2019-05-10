import {createAction} from 'redux-actions'

// constants
export const ITEMS_PER_PAGE_CLIENT = 10
export const ITEMS_PER_PAGE_SERVER = 100
// export const CLIENT_TO_SERVER_PAGE_RATIO = (ITEMS_PER_PAGE_CLIENT/ITEMS_PER_PAGE_SERVER)

// glossary:
const glossary = {
  'currentSelectedPage' : 'client page aka sub-page 1-10 of the server page',
  'responsePage'        : 'server page'
}

// actions
export const SET_CURRENT_SELECTED_PAGE_NUMBER = 'pagination/SET_CURRENT_SELECTED_PAGE_NUMBER'
export const SET_RESPONSE_PAGE                = 'pagination/SET_RESPONSE_PAGE'
export const SET_VISIBLE_PROMOS               = 'pagination/SET_VISIBLE_PROMOS'
export const SET_TOTAL_RESPONSE_PAGES         = 'pagination/SET_TOTAL_RESPONSE_PAGES'
export const SET_RESPONSE_SIZE                = 'pagination/SET_RESPONSE_SIZE'
export const SET_SHOULD_PAGINATE              = 'pagination/SET_SHOULD_PAGINATE'

// helpers
export const getCurrentVisiblePage = (currentSelectedPage) => {
  return ((currentSelectedPage-1) % ITEMS_PER_PAGE_CLIENT) + 1  
}

export const setCurrentSelectedPageNumber = (currentSelectedPage) => {
  return {
    type: SET_CURRENT_SELECTED_PAGE_NUMBER,
    payload: currentSelectedPage
  }
}

// todo:
// pass simple number instead of object as param, like above
export const setResponsePage = ({pageNumber}) => {
  return {
    type: SET_RESPONSE_PAGE,
    payload: pageNumber
  }
}

export const setTotalResponsePages = (data) => {
  const {totalPages} = data
  return {
    type: SET_TOTAL_RESPONSE_PAGES,
    payload: totalPages
  }
}

export const setResponseSize = (data) => {
  const {size} = data
  return {
    type: SET_RESPONSE_SIZE,
    payload: size
  }
}

// reducer
const initialState = {
  currentSelectedPage: 1,
  currentVisiblePage: 1,
  visiblePromoList: [],
  currentResponsePage: 1,
  totalResponsePages: 1,
  responseSize: 0,
  shouldPaginate: undefined
}

export const pagination = (state=initialState, action={}) => {
  // // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;

  switch(action.type){
    case SET_CURRENT_SELECTED_PAGE_NUMBER:
      return {
        ...state,
        currentSelectedPage : action.payload, 
        currentVisiblePage  : getCurrentVisiblePage(action.payload)
      }

    case SET_TOTAL_RESPONSE_PAGES:
      return {
        ...state,
        totalResponsePages: action.payload
      }

    case SET_RESPONSE_SIZE:
      return {
        ...state,
        responseSize: action.payload,
        shouldPaginate: action.payload > ITEMS_PER_PAGE_CLIENT
      }
      
    case SET_RESPONSE_PAGE:
      return {
        ...state,
        currentResponsePage: action.payload
      }
    
    case SET_SHOULD_PAGINATE:
      return {
        ...state,
        shouldPaginate: action.payload
      }

    default:
      return state

  }

}

export default pagination