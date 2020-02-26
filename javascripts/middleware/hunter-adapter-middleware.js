import {
  blur 
} from 'redux-form'

import { 
  HUNTER_CONFIRM_DEPS,
  HUNTER_INIT_HUNTER,
  HUNTER_REQUEST_SEARCH,
  HUNTER_REQUEST_REJECTED,
  HUNTER_REQUEST_FULFILLED,
  HUNTER_QUIT_HUNTER
} from '../redux/hunter-adapter'

const HunterAdapterMiddleware = store => next => action => {
  let 
    hub, 
    map,
    onCancelRequest,
    onDoneRequest,
    state
  ;
  
  if(typeof action =='object'){
    switch(action.type){
      case HUNTER_CONFIRM_DEPS:
        try {
          if(!!com.sho.app.hunter && !!goog.events.Event) {
              store.dispatch({
                type: `${HUNTER_CONFIRM_DEPS}_FULFILLED`
              })
            }
        }
        catch (e){
          store.dispatch({
            type: `${HUNTER_CONFIRM_DEPS}_REJECTED`,
            payload: e.message
          })
        }
        return next(action)

      case HUNTER_REQUEST_SEARCH:
        hub = com.sho.app.hunter.Hunter.grandCentralDispatch
        map = com.sho.app.hunter.events.EventType
        state = store.getState().hunter
        
        if(!state.listenersSet){
          onCancelRequest = (function(e){
            // console.log('|mddlwr| onCancelRequest() => {}')
            store.dispatch({
              type: HUNTER_REQUEST_REJECTED,
              payload: e
            })
          })
          goog.events.listen(hub, map.HUNTER_CANCEL_REQUEST, onCancelRequest)
          
          onDoneRequest = (function(e){
            // console.log('|mddlwr| onDoneRequest() => {}')
            store.dispatch({
              type: HUNTER_REQUEST_FULFILLED,
              payload: e,
            })
          })
          goog.events.listen(hub, map.HUNTER_DONE_REQUEST, onDoneRequest)
        }
        
        return next({
          ...action,
          payload: {
            onCancelRequest,
            onDoneRequest
          }
        })

      case HUNTER_REQUEST_FULFILLED:
        setTimeout(function(){
          state = store.getState().hunter
          const {images,field} = state
          store.dispatch(blur('promo', field, images[0] )) // should only ever be one
        },0)
        return next(action)
      
      case HUNTER_QUIT_HUNTER:
        hub             = com.sho.app.hunter.Hunter.grandCentralDispatch
        map             = com.sho.app.hunter.events.EventType
        state           = store.getState().hunter
        onCancelRequest = state.listeners.onCancelRequest
        onDoneRequest   = state.listeners.onDoneRequest
        
        if(state.initialized && onCancelRequest && onDoneRequest){
          goog.events.unlisten(hub, map.HUNTER_CANCEL_REQUEST, onCancelRequest)
          goog.events.unlisten(hub, map.HUNTER_DONE_REQUEST, onDoneRequest)
        }
        return next(action)
        
      default:
        return next(action)
    }
  } else {
    return next(action)
  }
}

export default HunterAdapterMiddleware
