import axios from 'axios'
import {createAction} from 'redux-actions'
import getPromosMock from '../mocks/getPromos'
import createPromoMock from '../mocks/createPromo'
import {FILTER_TYPES,SET_FILTERS,UNSET_FILTERS} from './filters'
import {APPLY_SORT} from './sort'
import {SET_CONTENT_BLOCK} from './content-block'
import {CONTENT_BLOCK_CONTEXT, SEARCH_CONTEXT } from './app'
import Promo from '../models/Promo'

// actions
export const GET_PROMOS       = 'promos/GET_PROMOS'
export const BAD_API_RESPONSE = 'promos/BAD_API_RESPONSE'
export const NO_SEARCH_RESULTS = 'promos/NO_SEARCH_RESULTS'
export const NEW_PROMO        = 'promos/NEW_PROMO'
export const CREATE_PROMO     = 'promos/CREATE_PROMO'
export const DELETE_PROMO     = 'promos/DELETE_PROMO'
export const CLONE_PROMO      = 'promos/CLONE_PROMO'
export const SET_ATTRIBUTES   = 'promos/SET_ATTRIBUTES'
export const SELECT_PROMO     = 'promos/SELECT_PROMO'
export const EDIT_PROMO       = 'promos/EDIT_PROMO'
export const TOGGLE_DETAILS   = 'promos/TOGGLE_DETAILS'
export const SHOW_DETAILS     = 'promos/SHOW_DETAILS'
export const HIDE_DETAILS     = 'promos/HIDE_DETAILS'
export const CANCEL_EDITING   = 'promos/CANCEL_EDITING'
export const UPDATE_PROMO     = 'promos/UPDATE_PROMO'
export const HIGHLIGHT_PROMO  = 'promos/HIGHLIGHT_PROMO'
export const UNHIGHLIGHT_PROMO= 'promos/UNHIGHLIGHT_PROMO'

// contextual options for PromoTools
const OPTIONS = [{
  icon: ['fa-pencil text-success'],
  name: 'edit'
},{
  icon: ['fa-clone'],
  name: 'clone'
},{
  icon: ['fa-clone','fa-clock-o','icon-copy-with-duration'],
  name: 'clone with duration'
},{
  icon: ['fa-trash text-danger'],
  name: 'delete'
}]

const is_clone_opt = /^clone/
export const OPTIONS_FOR_CONTEXT = {
  [CONTENT_BLOCK_CONTEXT] : OPTIONS.slice(0),
  [SEARCH_CONTEXT]        : OPTIONS.filter(o => !is_clone_opt.test(o.name))
}

//error handling
const badApiResponse = createAction(BAD_API_RESPONSE)
const noSearchResults = createAction(NO_SEARCH_RESULTS)

export const getPromos = function() {
  return function(dispatch, getState){
    const {contentBlock,app,search} = getState()
    const {context} = app || {};
    // console.log(getState())
    if(!context) return new Promise((resolve,reject)=>{
      console.log(`no context found in getPromos`)
      reject()
    })
    
    if(context == CONTENT_BLOCK_CONTEXT) {
      return getPromosForContentBlock(dispatch, contentBlock)
    }
    
    if(context == SEARCH_CONTEXT){
      return getPromosForSearchQuery(dispatch, search)
    }
    
  }
}

const getPromosForContentBlock = function(dispatch, {id}){
  if(!id) {
    throw new Error('|promos| can\'t get promos without content-block id')
  }
  
  return dispatch({
    type: GET_PROMOS,
    payload: axios.get(`/shomin/api/paige/content-block/${id}`)
      .then(xhr => {
        if(xhr.data && xhr.data.payload && xhr.data.payload.promotionList) {
          return xhr.data.payload.promotionList
        }
        else {
          dispatch(badApiResponse())
        }
      })        
  })
}

const getPromosForSearchQuery = function(dispatch, {query}){
  if(!query) {
    throw new Error('|promos| can\'t get promos without search query')
  }
  
  return dispatch({
    type: GET_PROMOS,
    payload: axios.get(`/shomin/api/paige/promotions?query=${query}`)
      .then(xhr => {
        if(xhr.data && xhr.data.page && xhr.data.page.content) {
          return xhr.data.page.content
        }
        else {
          dispatch(noSearchResults())
        }
      })        
  })
}


export const newPromo    = createAction(NEW_PROMO)
export const createPromo = function(attrs) {
  return {
    type: CREATE_PROMO,
    payload: axios.post(`/shomin/api/paige/promotion`, attrs)
      .then(xhr => xhr.data)
      .catch(e => e) // todo - add error handling
  }
}

export const deletePromo   = function({id}) { 
  return {
    type: DELETE_PROMO,
    meta: {id},   
    payload: axios.delete(`/shomin/api/paige/promotion/${id}`)
      .then(xhr => xhr.data)
      .catch(e => e) // todo - add error handling 
  }
}

export const editPromo = function({id}) {
  return function(dispatch, getState) {
    const state  = getState()
    const promos = state.promos ? state.promos : state
    
    const promo  = (promos.list || []).find(p => p.id == id)
    dispatch(setAttributes({...promo}))
    return dispatch({
     type: EDIT_PROMO
    })
  }
}

export const clonePromo    = function({id,contentBlockId}, opts={}) {
  return (dispatch, getState, {isRootReducer}) => {
    // isRootReducer is set via the thunk middleware,
    // using it as a flag so we can normalize the discrepancy between
    // what getState returns in the testing context (the state of the promos slice)
    // and what it returns in the browser, (seemingly the entire tree)
    
    // update: this has less to do with the test vs browser context then we thought
    // for example, what about the case where a test inits the store 
    // with the rootReducer, for example when testing cross-cutting concerns
    // the assignment below handles this case, less explicitly, and would cause mayhem
    // if there were ever a top-level 'list' reducer, but otherwise resolves the issue
    const state  = getState();
    const {list} = state.promos || state
    const match  = list.find(p => p.id == id); if(!match) throw new Error(`Bad id passed to clonePromo: ${id}`)
    const promo  = Promo.fromAttributes(match)
    const clone  = promo.clone(opts)
    // set attributes on the state to those of the cloned promo's, for good measure
    dispatch(setAttributes(clone.attributes)) 
    // the cross-cutting reducer will inject the correct contentBlock id,
    // but we unfortunately don't have access to that updated state in here,
    // so we're passing the id as a param to the action creator above
    return dispatch(createPromo({...clone.attributes, contentBlockId}))
  }
}

export const setAttributes = createAction(SET_ATTRIBUTES)
export const selectPromo   = createAction(SELECT_PROMO)
export const toggleDetails = createAction(TOGGLE_DETAILS)
export const showDetails   = createAction(SHOW_DETAILS)
export const hideDetails   = createAction(HIDE_DETAILS)
export const cancelEditing = createAction(CANCEL_EDITING)

export const updatePromo   = function(attrs) {
  const {id} = attrs;  
  if(id == undefined) throw new Error('must provide an id to update promo')
  
  //console.log(`UPDATE ${JSON.stringify(attrs)}`)
  return {
    type: UPDATE_PROMO,
    payload: axios.put(`/shomin/api/paige/promotion/${id}`, attrs)
      .then(xhr => xhr.data)
      .catch(e => e)
  }
}

// helpers
const sortedPromos = ({state, attr, direction, kind='number'}) => {
  const sorted = state.sort((a,b) => {
    // if it's a number we have to cast it from string before comparing
    const alpha = kind == 'number' ? Number(a[attr]) : a[attr]
    const beta  = kind == 'number' ? Number(b[attr]) : b[attr]
    // peform the sort. if a is less than b, return -1; if b is greater than a, return 1; if equal, return 0
    const sort  = alpha == beta ? 0 : (
      alpha < beta ? -1 : 1
    )
    // console.log(`${alpha} <> ${beta} ${sort}`)
    return sort
  })
  
  // descending order can be achieved with array#reverse
  return (direction == 'descending') ? 
    sorted.slice(0).reverse() : sorted
  ;
}

const updatePromoInList = (list, promo) => {
  return (list || []).map(p => {
    if(p.id == promo.id){
      return {...promo}
    } else {
      return p 
    }
  })
}

// reducer  
const initialState = {
  selected  : [],
  list      : [],
  filtered  : [],
  details   : {},
  detailsVisible : false,
  isEditing : false,
  error     : undefined,
  loading   : false,
  highlighted : undefined
};




export const promos = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  
  let promo
  let list
  let filterBy
  
  switch(action.type){
    case HIGHLIGHT_PROMO:
      return {
        ...state,
        highlighted: action.payload.id
      }
      
    case UNHIGHLIGHT_PROMO:
      return {
        ...state,
        highlighted: undefined
      }
      
    case SET_ATTRIBUTES:
      const details = {...action.payload}

      return {
        ...state,
        details
      }
    
    case   `${GET_PROMOS}_PENDING`:
    case `${CREATE_PROMO}_PENDING`:
    case `${UPDATE_PROMO}_PENDING`:
    case `${DELETE_PROMO}_PENDING`:
      return {
        ...state,
        loading: true
      }
      
    case `${GET_PROMOS}_FULFILLED`:
      return {
        ...state,
        loading: false,
        details: {},
        detailsVisible: false,
        list: (action.payload && action.payload.length ? action.payload : [])
      }

    case `${GET_PROMOS}_REJECTED`: 
      const {payload}  = action
      const {response} = payload
      const {status,statusText} = response

      return {
        ...state,
        error: {
          status,
          statusText,
          message: `an error has occured. ${status} ${statusText}`
        }
      }
      
    case BAD_API_RESPONSE: 
      return {
        ...state,
        list : [],
        error: {
          message: 'the server returned JSON in an unexpected format'
        }
      } 

    case NO_SEARCH_RESULTS: 
    return {
      ...state,
      list : [],
      error: {
        errorType: 'Warning',
        message: 'Sorry, but the server could not find any promos that matched your query',
      }
    } 

    case NEW_PROMO: 
      return {
        ...state,
        details: {}, 
        detailsVisible: true
      }
      
    case EDIT_PROMO:
      return {
        ...state,
        isEditing: true
      }
      
    case `${CREATE_PROMO}_FULFILLED`:
      // the nested payload.payload is because
      // 1) outer payload is the redux convention
      // 2) inner payload is what api is bundling some responses with
      promo    = action.payload.payload 
      list     = (state.list || []).concat([promo])
      filterBy = generateCompositeFilter(action.filters || []) 
      
      return {
        ...state,
        loading: false,
        isEditing: false,
        detailsVisible: false,
        details: {},  
        filtered: list.filter(filterBy),
        list 
      }
    
    case SHOW_DETAILS: return {...state, detailsVisible: true}
    case HIDE_DETAILS: return {...state, detailsVisible: false}
    case TOGGLE_DETAILS:
      const {detailsVisible} = state
      return {
        ...state,
        detailsVisible : !detailsVisible  
      }

    case `${DELETE_PROMO}_FULFILLED`:
      const deleteID = action.meta.id
      return {
         ...state, 
         loading: false,
         detailsVisible: false,
         filtered: (state.filtered || []).filter(p => p.id !== deleteID),
         list:     (state.list || []).filter(p => p.id !== deleteID)
      }   
      

    case `${UPDATE_PROMO}_FULFILLED`:
      promo = action.payload.payload
      return {
        ...state,
        loading: false,
        detailsVisible: false,
        isEditing: false,
        filtered: updatePromoInList(state.filtered, promo),
        list: updatePromoInList(state.list, promo)
      }
      
    case `${CREATE_PROMO}_CANCELLED`:
      return {
        ...state,
        details: {},
        detailsVisible: false
      }
      
    case CANCEL_EDITING:
      return {
        ...state,
        isEditing: false,
        details: {},
        detailsVisible: false
      }
      
    // not sure we need this...  
    case SELECT_PROMO:
      return {
        ...state,
        selected: action.payload.id
      }
    
    case APPLY_SORT:
      const {type,direction} = action.payload
      const kind = (type == 'name' ? 'string' : 'number')
      
      if(!Promo.sortableProperty(type)) {
        throw new Error(`|promos| unsupported sort type in APPLY_SORT: '${type}'`)
      }
      
      return {
        ...state,
        list: sortedPromos({
          state: state.list,
          attr: type,
          direction,
          kind
        })
      }  

    // filters  
    case SET_FILTERS:    
      // generate the resulting filter to apply to list 
      filterBy = generateCompositeFilter(action.payload || [])
      const filtered = (state.list || []).filter(filterBy)
      
      return {
        ...state,
        detailsVisible : false,
        filtered
      }

    default:
      return state
    }  
  }

  // create a new function that we can use to apply the filter to the list of promos
  // we'll generate it by iterating over the list of filters, so the resulting function applies them all
  const generateCompositeFilter = (filterSet) => {
    
    // by default the filter does nothing, just passing the promo through
    const noFilter  = (promo => promo)
    
    return filterSet.reduce((otherFilters, filterObj) => {
      
      const {type,value} = filterObj;
      
      // keep things tight for now...
      if(!FILTER_TYPES.includes(type)) {
        throw new Error(`Unsupported filter type passed to SET_FILTERS: '${type}'`)
      }

      // begin function definition
      return (promo) => {
        let newFilter;
        const p = Promo.fromAttributes(promo)
        
        switch(type){
          case 'startDate':
            newFilter = (promo => p.startsOnOrBefore(value));  break;

          case 'endDate':
            newFilter = (promo => p.endsOnOrBefore(value)); break;
          
          case 'text':
            newFilter = (promo => p.textContains(value)); break;
            
          default:
            newFilter = noFilter
        }
        
        // apply the new filter, in addition to any others in state..
        return otherFilters(promo) && newFilter(promo)
        // END function
      }
    }, noFilter)
  }
  
export default promos