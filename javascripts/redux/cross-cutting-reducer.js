import {SET_ATTRIBUTES, NEW_PROMO} from './promos'

// crossCuttingReducer
// this is responsible for setting the contentBlockid on the promo details,
// by pulling the current value from the contentBlock reducer,
// any merging it into the promo details (unless a contentBlockid is alreay defined)

export default (state={}, action={}) => {
  if(action.type == SET_ATTRIBUTES || action.type == NEW_PROMO){
    const {contentBlock} = state
    const {promos}       = state
    const {details}      = (promos || {})

    return {
      ...state,
      'promos': {
        ...promos,
        'details': {
          ...details,
          'contentBlockId' : (
            details.contentBlockid || contentBlock.id || action.payload.contentBlockId
          )
        }
      }
    }
  }
  
  return {...state}
}