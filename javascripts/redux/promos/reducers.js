import * as types from './types'
import {APPLY_SORT} from '../sort'
import {getCurrentVisiblePage} from '../pagination'
import {SET_FILTERS,UNSET_FILTERS} from '../filters'
import {SET_CURRENT_SELECTED_PAGE_NUMBER} from '../pagination'

import Promo from '../../models/Promo'

import {
  sortedPromos,
  promosForSelectedPage,
  updatePromoInList
} from './selectors'

import {
  generateCompositeFilter,
  sanitizePromos,
  extractServerError
} from './utils'

// reducer  
const initialState = {
  selected          : [],
  list              : [],
  paginatedList     : [],
  filtered          : [],
  filteredPaginated : [],
  details           : {},
  detailsVisible    : false,
  isEditing         : false,
  listError         : undefined,
  detailsError      : undefined,
  groupError        : undefined,
  loading           : false,
  highlighted       : undefined
};

export const promos = (state=initialState, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  
  let promo
  let list
  let filtered
  let filterBy
  let paginatedList
  let filteredPaginated

  switch(action.type){
    case types.HIGHLIGHT_PROMO:
      return {
        ...state,
        highlighted: action.payload.id
      }
      
    case types.UNHIGHLIGHT_PROMO:
      return {
        ...state,
        highlighted: undefined
      }
      
    case types.SET_ATTRIBUTES:
      const details = {...action.payload}

      return {
        ...state,
        details
      }
    
    case `${types.CREATE_PROMO}_PENDING`:
    case `${types.UPDATE_PROMO}_PENDING`:
    case `${types.DELETE_PROMO}_PENDING`:
      return {
        ...state,  
        loading: true 
      }
      
    case `${types.GET_PROMOS}_PENDING`:
      return {
        ...state,
        loading: true,
        paginatedList: []
      }
      
    case `${types.GET_PROMOS}_FULFILLED`:
      list              = action.payload && action.payload.length ? sanitizePromos(action.payload) : []
      paginatedList     = promosForSelectedPage(list, action.meta.currentVisiblePage)
      filterBy          = generateCompositeFilter(action.meta.filters || []) 
      filtered          = list.filter(filterBy)
      filteredPaginated = paginatedList.filter(filterBy)
      
      return {
        ...state,
        loading: false,
        listError: false,
        details: {},
        detailsVisible: false,
        list,
        filtered,
        filteredPaginated,
        paginatedList
      }

    case `${types.GET_PROMOS}_REJECTED`: 
      return {
        ...state,
        listError: extractServerError(action)
      }
      
    // todo: consolidate/normalize different approaches to error/warning handling
    case types.BAD_API_RESPONSE: 
      return {
        ...state,
        list : [],
        error: {
          message: types.BAD_API_RESPONSE_MESSAGE
        }
      } 

    case types.NO_SEARCH_RESULTS: 
    return {
      ...state, // no longer treated as an error see TOOL-4143	
      list : []
    } 

    case types.NEW_PROMO: 
      return {
        ...state,
        selected: [],
        details: {}, 
        detailsVisible: true,
        detailsError: false,
        groupError: false
      }
      
    case types.EDIT_PROMO:
      return {
        ...state,
        groupError: false,
        isEditing: true
      }
      
    case `${types.CREATE_PROMO}_FULFILLED`:
      // the nested payload.payload is because
      // 1) outer payload is the redux convention
      // 2) inner payload is what api is bundling some responses with)
      promo    = action.payload.payload 
      list     = (state.list || []).concat([promo])
      filterBy = generateCompositeFilter(action.filters || []) 
      filtered = list.filter(filterBy)
      
      return {
        ...state,
        loading: false,
        isEditing: false,
        detailsError: false,
        detailsVisible: false,
        details: {},  
        filtered,
        list 
      }
      
    case `${types.CREATE_PROMO}_REJECTED`:
    case `${types.UPDATE_PROMO}_REJECTED`:
      return {
        ...state,
        loading: false,
        detailsError: extractServerError(action)
      }
      
    case types.SHOW_DETAILS:    return {...state, detailsVisible : true}
    case types.HIDE_DETAILS:    return {...state, detailsVisible : false}
    case types.TOGGLE_DETAILS:  return {...state, detailsVisible : !state.detailsVisible }

    case `${types.DELETE_PROMO}_FULFILLED`:
      const deleteID = action.meta.id
      return {
         ...state, 
         loading: false,
         isEditing: false,
         detailsVisible: false,
         paginatedList: (state.paginatedList || []).filter(p => p.id !== deleteID),
         filtered: (state.filtered || []).filter(p => p.id !== deleteID),
         list:     (state.list || []).filter(p => p.id !== deleteID)
      }   
      

    case `${types.UPDATE_PROMO}_FULFILLED`:
      promo = action.payload.payload
      return {
        ...state,
        loading: false,
        detailsError: false,
        detailsVisible: false,
        isEditing: false,
        paginatedList: updatePromoInList(state.paginatedList, promo),
        filtered: updatePromoInList(state.filtered, promo),
        list: updatePromoInList(state.list, promo)
      }
      
    case types.GROUP_ERROR_UPDATED: 
      // reconcile incoming state changes with last state
      const {error,field} = action.payload
      const groupErrorOld = state.groupError || {}
      const mergedKeys    = Object.keys(groupErrorOld).filter(f => f !== field).concat([field])
      
      // if there is an entry in the payload, assign it to new state [1]
      // if there isn't, reject the previous entry, removing it from state [2]
      // but also deal with cases where the incoming field change requires us
      // to clear an error from a different, but related field (start/endDate quirks) [3,4]
      const newState      = mergedKeys.reduce((obj,key) => {
        if(key == field){
          if(error){ // 1
            obj[key] = error
            // console.log(`${field} is an error, write to state`)
          }
          else {
            if(key == 'startDate' && groupErrorOld.endDate){ // 3
              // console.log('clear related error in endDate')
              obj.endDate = '_DELETE_'
            }
            else if(key == 'endDate' && groupErrorOld.startDate){ // 4
              // console.log('clear related error in startDate')
              obj.startDate = '_DELETE_'
            }
            else { // 2
              // console.log(`${field} is a non-error, omit from state`)
            }
          }  
        } 
        else {
          obj[key] = groupErrorOld[key]
          // console.log(`${field} is persisted from state`)
        }
        return obj
      }, {});
      
      const groupErrorClean = Object.keys(newState || {}).reduce((clean,key) => {
        if(newState[key] && newState[key] !== '_DELETE_'){
          clean[key] = newState[key]; 
        } return clean
      }, {})
      
      if(Object.keys(groupErrorClean) == 0){
        const {groupError, ...oldState} = state
        return oldState
      } else {
        return {
          ...state, 
          'groupError': groupErrorClean
        }
      }
      
    case `${types.CREATE_PROMO}_CANCELLED`:
      return {
        ...state,
        details: {},
        detailsError: false,
        detailsVisible: false
      }
      
    case types.CANCEL_EDITING:
      return {
        ...state,
        isEditing: false,
        details: {},
        groupError: false,
        detailsError: false,
        detailsVisible: false
      }
      
    // not sure we need this...  
    case types.SELECT_PROMO:
      return {
        ...state,
        selected: action.payload.id
      }
    
    case APPLY_SORT:
      let {type,direction} = action.payload
      let kind = ['name','context'].includes(type) ? 'string' : 'number';

      if(!Promo.sortableProperty(type)) {
        throw new Error(`|promos| unsupported sort type in APPLY_SORT: '${type}'`)
      }
      
      const sortedList = sortedPromos({
        state: state.list,
        attr: type, 
        direction: direction || state.direction,
        kind
      })
      
      const {currentVisiblePage} = action.meta || {}      
      paginatedList     = promosForSelectedPage(sortedList, currentVisiblePage)
      filterBy          = generateCompositeFilter(action.meta.filters || []) 
      filteredPaginated = paginatedList.filter(filterBy)

      return {
        ...state,
        list: sortedList,
        paginatedList,
        filteredPaginated
      }  

    // filters  
    case SET_FILTERS:
    case UNSET_FILTERS:    
      // grab the list of filters needed to generate the function:
      // (because of some handling in filter-promos-middleware, this list is always comprehensive,
      // taking both the previous state and the incoming changes from the action into account):
      const filterState = action.type == SET_FILTERS ? action.payload : action.meta.persistedFilters
      
      // generate the resulting filter to apply to the list 
      list     = (state.list || [])
      filterBy = generateCompositeFilter(filterState || []) 
      filtered = list.filter(filterBy)
      filteredPaginated = promosForSelectedPage(list, action.meta.currentVisiblePage).filter(filterBy)

      return {
        ...state,
        filtered,
        filteredPaginated
      }
  
      
    // pagination
    case SET_CURRENT_SELECTED_PAGE_NUMBER:
      const {filters} = action.meta
      filterBy = generateCompositeFilter(filters || [])
      paginatedList = promosForSelectedPage(state.list, getCurrentVisiblePage(action.payload))
      
      return {
        ...state,
        selected: [],
        isEditing: false,
        detailsVisible: false,
        paginatedList,
        filteredPaginated: paginatedList.filter(filterBy)
      }
      
    default:
      return state
    }  
  }
  
  export default promos