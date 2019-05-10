import {
  SET_ATTRIBUTES,
  NEW_PROMO
} from './promos/types'

import {
  getKeyFromContentBlock,
  getValues,
  getTemplates,
  getDefaults
} from './form-defaults'

// crossCuttingReducer
// this is responsible for setting the contentBlockid on the promo details,
// by pulling the current value from the contentBlock reducer,
// any merging it into the promo details (unless a contentBlockId is alreay defined)

const getContentBlockId = (state={}, action) => {
  const {details} = (state.promos || {})
  return details.contentBlockid || state.contentBlock.id || action.payload.contentBlockId
}

export default (state={}, action={}) => {
  const {
    contentBlock,
    promos,
    formDefaults
  } = state
  
  const {
    details,
  } = (promos || {})
  
  // for new promos, look for sensible defaults and mix them into the form if needed,
  // in all cases, ensure contentBlockId is populated
  const isNew    = action.type == NEW_PROMO
  const defaults = !isNew ? {} : getDefaults(formDefaults, getKeyFromContentBlock(contentBlock)) 

  switch(action.type){
    case SET_ATTRIBUTES:
    case NEW_PROMO:
      return {
        ...state,
        'promos': {
          ...promos,
          'details': {
            ...details,
            'contentBlockId' : getContentBlockId(state, action),
            ...defaults
          }
        }
      }
        
    default: 
      return {...state}
  }
}