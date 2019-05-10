import {createAction} from 'redux-actions'
import {combineReducers} from 'redux'

// actions
export const SET_DEFAULTS         = 'form-defaults/SET_DEFAULTS'
export const setDefaults          = createAction(SET_DEFAULTS)
export const APPLY_TEMPLATE       = 'form-defaults/APPLY_TEMPLATE'
export const applyTemplateToField = (template, key, field) => {
  return {
    type: APPLY_TEMPLATE,
    payload: {
      ...template,
      target: field
    },
    meta: {
      key
    }
  }
}

// selectors
export const getKeyFromContentBlock = (({name}) => (name || '').toLowerCase())
export const getValues    = ((state,key) => state[key] ? state[key].values : {})
export const getTemplates = ((state,key) => state[key] ? state[key].templates : {})

export const getTemplateWasApplied = ((state,key,field) => {
  return state[key] && state[key].applied.indexOf(field) > -1
})

export const getDefaults  = ((state,key) => {
  let defaults = {}
  const master = Object.assign({}, getValues(state, key), getTemplates(state, key))
  for(const k in master){
    defaults[k] = master[k].value || master[k].template
  }
  return defaults
})

export const getTemplateForField = ((state,key,field) => {
  return (getTemplates(state,key) || {})[field]
})


// reducers
const initialState = {}

const entriesWithProperty = (prop, data) => {
  let entry, store={}
  for(const k in data){
    entry = data[k]
    if(entry[prop]) {
      store[k] = {
        field: k,
        ...entry
      }
    }
  }
  return store 
}

export const formDefaults = (state=initialState, action={}) => {
  switch(action.type){
    case SET_DEFAULTS:
      const { 
        key, 
        defaults
      } = action.payload || {}
      
      if(key && defaults){
        return {
          ...state,
          [key] : Object.assign({}, state[key], {
            values:    entriesWithProperty('value',    defaults), 
            templates: entriesWithProperty('template', defaults),
            applied:   []
          })
        }
      }
      
    case APPLY_TEMPLATE:
      const {field} = action.payload
      const key_    = action.meta.key
      return {
        ...state,
        [key_] : Object.assign({}, state[key_], {
          applied: state[key_].applied.concat([field])
        })
      }
      
    default:
      return state
  }
}

export default formDefaults