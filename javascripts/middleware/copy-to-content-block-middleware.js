import Cookies from 'js-cookie'
import { setIsCopyingToContentBlock, highlightPromoAfterRedirect } from '../redux/promos/actions'
import { CREATE_PROMO } from '../redux/promos/types'
import { REDIRECT_TO_CONTENT_BLOCK, redirectToContentBlock } from '../redux/content-blocks'
import { GET_PROMOS,UNHIGHLIGHT_PROMO,HIGHLIGHT_PROMO_AFTER_REDIRECT_COOKIE_KEY } from '../redux/promos/types'
import { highlightRow } from './form-hooks-middleware'

const CopyToContentBlockMiddleware = store => next => action => {
  // console.log(action)
  if(typeof action =='object'){
    switch(action.type){
      case `${CREATE_PROMO}_FULFILLED`:
        // feels like this shld only be needed if we are in fact copying..
        if(store.getState().promos.isCopyingToContentBlock){
          next(action)
          store.dispatch(setIsCopyingToContentBlock(false))
          return store.dispatch(redirectToContentBlock({id: action.payload.payload.id}))
        } else {
          return next(action)
        }
        
      case REDIRECT_TO_CONTENT_BLOCK:
        next(action)
        return store.dispatch(highlightPromoAfterRedirect({id: action.id}))
      
      case `${GET_PROMOS}_FULFILLED`:
        next(action)
        const id = Cookies.get(HIGHLIGHT_PROMO_AFTER_REDIRECT_COOKIE_KEY)
        if(id !== undefined) highlightRow({store, id})
        break
        
      case UNHIGHLIGHT_PROMO:
        next(action)
        Cookies.remove(HIGHLIGHT_PROMO_AFTER_REDIRECT_COOKIE_KEY)
        break
        
    default:
      return next(action)
    }
  } else {
    return next(action)
  }
}

export default CopyToContentBlockMiddleware
