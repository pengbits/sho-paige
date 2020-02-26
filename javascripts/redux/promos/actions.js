import AxiosWrapper from '../../utils/axios'
const axiosWrapper = () => AxiosWrapper.instance()
import axios from 'axios'

import {createAction} from 'redux-actions'
import {CONTENT_BLOCK_CONTEXT,SEARCH_CONTEXT} from '../app'
import {setTotalResponsePages, setResponseSize, SET_CURRENT_SELECTED_PAGE_NUMBER, ITEMS_PER_PAGE_CLIENT, getCurrentVisiblePage} from '../pagination'
// internal
import {findMatchingNames,getHighestCopyNumber} from './utils'
import * as types from './types'
import Promo from '../../models/Promo'
import Cookies from 'js-cookie'

// simple action creators
export const unsetDatetime     = createAction(types.UNSET_DATETIME)
export const setAttributes     = createAction(types.SET_ATTRIBUTES)
export const selectPromo       = createAction(types.SELECT_PROMO)
export const toggleDetails     = createAction(types.TOGGLE_DETAILS)
export const showDetails       = createAction(types.SHOW_DETAILS)
export const hideDetails       = createAction(types.HIDE_DETAILS)
export const cancelEditing     = createAction(types.CANCEL_EDITING)
export const badApiResponse    = createAction(types.BAD_API_RESPONSE)
export const noSearchResults   = createAction(types.NO_SEARCH_RESULTS)
export const groupErrorUpdated = createAction(types.GROUP_ERROR_UPDATED)
export const setIsCopyingToContentBlock = createAction(types.SET_IS_COPYING_TO_CONTENT_BLOCK) 

// more complex action creators and thunks/sagas
export const getPromos = function(responsePageNumber) {
  return function(dispatch, getState){
    const {contentBlock,app,search,pagination} = getState()
    const {context} = app || {};
    const {currentResponsePage} = pagination || {} 
    
    if(!context) return new Promise((resolve,reject)=>{
      console.log(`no context found in getPromos`)
      reject()
    })
    
    if(context == CONTENT_BLOCK_CONTEXT) {
      return getPromosForContentBlock(dispatch, contentBlock)
    }
    
    if(context == SEARCH_CONTEXT){
      return getPromosForSearchQuery(dispatch, search, responsePageNumber)
    }
  }
}

export const getPromosForContentBlock = function(dispatch, {id}){
  if(!id) {
    throw new Error('|promos| can\'t get promos without content-block id')
  }
  
  return dispatch({
    type: types.GET_PROMOS,
    payload: axiosWrapper().get(`/shomin/api/paige/content-block/${id}`)
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

const getPromosForSearchQuery = function(dispatch, {query}, responsePageNumber){
  if(!query) {
    throw new Error('|promos| can\'t get promos without search query')
  }
  // responsePageNumber && console.log(`getPromosForSearchQuery ${responsePageNumber}`)
  return dispatch({
    type: types.GET_PROMOS,
    payload: axiosWrapper().get(`/shomin/api/paige/promotions/${responsePageNumber}?query=${query}`)
      .then(xhr => {
        //
        // i'm not sure these really need to be dispatched actions.
        // when the reducer could just respond to types.GET_PROMOS, extract the props we are interested in
        // and update the state accordingly..
        if(xhr.data && xhr.data.totalPages){
          dispatch(setTotalResponsePages(xhr.data))
        }
        if(xhr.data && xhr.data.size){
          dispatch(setResponseSize(xhr.data))
        }
        if(xhr.data && xhr.data.page && xhr.data.page.content) {
          return xhr.data.page.content
        }
        else {
          dispatch(noSearchResults())
        }
      })        
  })
}

export const newPromo    = createAction(types.NEW_PROMO)
export const createPromo = function(attrs) {
  return {
    type: types.CREATE_PROMO,
    payload: axiosWrapper().post(`/shomin/api/paige/promotion`, attrs)
      .then(xhr => xhr.data)
      .catch(e => e)
  }
}

export const deletePromo   = function({id}) { 
  return {
    type: types.DELETE_PROMO,
    meta: {id},   
    payload: axiosWrapper().delete(`/shomin/api/paige/promotion/${id}`)
      .then(xhr => xhr.data)
      .catch(e => e)
  }
}

export const editPromo = function({id}) {
  return function(dispatch, getState) {
    const state  = getState()
    const promos = state.promos ? state.promos : state
    
    const promo  = (promos.list || []).find(p => p.id == id)
    dispatch(setAttributes({...promo}))
    return dispatch({
      type: types.EDIT_PROMO
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
    const state          = getState();
    const {list}         = state.promos || state
    const match          = list.find(p => p.id == id); if(!match) throw new Error(`Bad id passed to clonePromo: ${id}`)
    const promo          = Promo.fromAttributes(match)
    const promoCopyRegex = Promo.promoCopyRegex()
    const promoName      = promo.attributes.name.replace(promoCopyRegex, "")

    //find all promos with the same name, excluding Copy #
    const matchingNames = findMatchingNames(list, promoName, promoCopyRegex)

    //extract Copy # (if any) and return the highest one
    const highestCopyNumber = getHighestCopyNumber(matchingNames, promoCopyRegex)

    //set next Copy # on the opts object and pass it into the promo's clone method 
    opts.copyNumber = highestCopyNumber + 1
    try {
      const clone = promo.clone(opts)

      // set attributes on the state to those of the cloned promo's, for good measure. attributes go into "details" section
      dispatch(setAttributes(clone.attributes)) 
      // the cross-cutting reducer will inject the correct contentBlock id,
      // but we unfortunately don't have access to that updated state in here,
      // so we're passing the id as a param to the action creator above
      // this creates the new promo via `createPromo`, line 161 
      return dispatch(createPromo({...clone.attributes, contentBlockId}))
    } catch (e) {
      console.log(e.message)
    }
  }
}

export const updatePromo   = function(attrs) {
  const {id} = attrs;  
  if(id == undefined) throw new Error('must provide an id to update promo')

  return {
    type: types.UPDATE_PROMO,
    payload: axiosWrapper().put(`/shomin/api/paige/promotion/${id}`, attrs)
      .then(xhr => xhr.data)
      .catch(e => e)
  }
}

export const copyPromoToContentBlock = function({id}) {
  return (dispatch, getState) => {
    const {selected} = getState().promos
    if(!selected) throw new Error(`can't call copyPromoToContentBlock without first selecting a promo`)
    
    // clone promo gives us what we need since it requires a content-block id as a param
    return dispatch(clonePromo({
      id: selected, 
      contentBlockId: id
    }))
  }
}


export const highlightPromoAfterRedirect = function({id}) {
  Cookies.set(types.HIGHLIGHT_PROMO_AFTER_REDIRECT_COOKIE_KEY, id)
  return { type: types.HIGHLIGHT_PROMO_AFTER_REDIRECT }
}

export const checkValidUrl = (url, field) => {
  return (dispatch, getState) => {
    if(!window.p_img || !window.p_img[field]){
      //console.log(`|promos| checkValidURL p_img[${field}] not found, creating now`)
      window.p_img = window.p_img || {}
      window.p_img[field] = document.createElement('img')
    }
    
    // have to reset these handlers every time it seems
    window.p_img[field].onload = function(){
      // console.log(`|promos| checkValidURL p_img[${field}].onload() `)
      dispatch({
        type: `${types.CHECK_VALID_URL}_FULFILLED`,
        payload: {field, status:200}
      })
    }
    window.p_img[field].onerror = function(){
      // console.log(`|promos| checkValidURL p_img[${field}].onerror()`)
      dispatch({
        type: `${types.CHECK_VALID_URL}_REJECTED`,
        payload: {field, status: 404}
      })
    }

    window.p_img[field].src = url;

    dispatch({
      type: `${types.CHECK_VALID_URL}_PENDING`,
      payload: {field, status: 'PENDING'}
    })
  }
}

export const isExternalUrl = (url) => {
  return !/^http(s*):\/\/((www|tools)\.)*sho\.com/.test(url)
}