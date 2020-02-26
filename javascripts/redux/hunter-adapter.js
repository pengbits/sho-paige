// bridge code for any third-party integrations, limited to Hunter Image search at moment
import {createAction} from 'redux-actions'

// constants
const        NS                       = 'hunter/'
export const HUNTER_CONFIRM_DEPS      = 'hunter/HUNTER_CONFIRM_DEPS'
export const HUNTER_INIT_HUNTER       = 'hunter/HUNTER_INIT_HUNTER'
export const HUNTER_REQUEST_SEARCH    = 'hunter/HUNTER_REQUEST_SEARCH'
export const HUNTER_REQUEST_REJECTED  = 'hunter/HUNTER_REQUEST_REJECTED' // com.sho.app.app.hunter.events.EventType.HUNTER_CANCEL_REQUEST
export const HUNTER_REQUEST_FULFILLED = 'hunter/HUNTER_REQUEST_FULFILLED'   // com.sho.app.app.hunter.events.EventType.HUNTER_DONE_REQUEST
export const IMAGE_QUERY_REQUEST      = 'hunter/imageQueryRequest'   // com.sho.app.app.hunter.events.EventType.IMAGE_QUERY_REQUEST
export const HUNTER_QUIT_HUNTER       = 'hunter/HUNTER_QUIT_HUNTER'

// actions
export const hunterConfirmDeps = createAction(HUNTER_CONFIRM_DEPS)

export const hunterInitHunter = function(opts={origin:'https://tools.sho.com'}){
  let hunter

  const cfg = {
    mode: 'select', 
    write: true,
    remoteHost: getRemoteHost(opts.origin)
  };
  console.log(`|hunter-adapter| origin=${opts.origin} cfg.remoteHost=${cfg.remoteHost}`)
  
  if(!window._PAIGE_HUNTER_INSTANCE_) 
  // the hunter instance was previously stored right in state,
  // but I wasn't sure having the redux layer observe all the props of the living external component
  // was such a hot idea...
  {
    hunter = new com.sho.app.hunter.Hunter(cfg);
    hunter.launch();
    hunter.hide()
  } else {
    hunter = window._PAIGE_HUNTER_INSTANCE_
  }
  return {
    type: HUNTER_INIT_HUNTER,
    payload: hunter,
    meta: {
      cfg
    }
  }
}

export const hunterQuitHunter = createAction(HUNTER_QUIT_HUNTER)

export const hunterRequestSearch = function({seriesId},{name}){
  if(seriesId){
    var search = new com.sho.app.hunter.vo.ImageSearch();
    search.seriesId = seriesId
    search.type     = '01';
    search.pageSize = 12; // avoid a 500 error by passing a valid start-page 
    var evt = new goog.events.Event(com.sho.app.hunter.events.EventType.IMAGE_QUERY_REQUEST, {
      request: search
    });
    com.sho.app.hunter.Hunter.grandCentralDispatch.dispatchEvent(evt);
  }
  return {
    type: HUNTER_REQUEST_SEARCH,
    meta: {
      seriesId,
      field: name
    }
  }
}

// reducer
const initialState = {
  hunter: undefined,
  dependencies: false,
  initialized: false,
  loading: false,
  error: null,
  searching:false, 
  images: [],
  field: null,
  listenersSet:false,
  listeners: {}
}

export const hunter = (state={}, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  switch(action.type){
  
    case `${HUNTER_CONFIRM_DEPS}_FULFILLED`:
      return {
        ...state,
        dependencies: true
      }
      
    case `${HUNTER_CONFIRM_DEPS}_REJECTED`:
      return {
        ...state,
        dependencies:false,
        error: action.payload
      }
    
    case HUNTER_INIT_HUNTER:
      window._PAIGE_HUNTER_INSTANCE_ = action.payload
      return {
        ...state,
        initialized: true,
      }
      
    case HUNTER_REQUEST_SEARCH:
      window._PAIGE_HUNTER_INSTANCE_.show()
      const {field,seriesId}  = action.meta
      const {onDoneRequest,onCancelRequest} = action.payload
      return {
        ...state,
        searching:true,
        seriesId,
        field,
        listenersSet: true,
        listeners:{
          onDoneRequest,
          onCancelRequest
        }
      }
      
    case HUNTER_REQUEST_FULFILLED:
      const hunter = window._PAIGE_HUNTER_INSTANCE_
      const images = (hunter.getCollectedImages() || []).map(i => santizeUrl(i.url));
      hunter.hide();      
      hunter.reset()
      
      return {
        ...state,
        searching: false,
        images
      }
      
    case HUNTER_REQUEST_REJECTED:
      window._PAIGE_HUNTER_INSTANCE_.hide();      
      window._PAIGE_HUNTER_INSTANCE_.reset()
      
      return {
        ...state,
        searching:false
      }
    
    case HUNTER_QUIT_HUNTER:
      //window._PAIGE_HUNTER_INSTANCE_ = undefined // not sure its worth nulling out the instance,
      // rolling back state + unsetting listeners seems to do what we want
      return {
        ...initialState,
        dependencies: true
      }

    default:
     return state
  }
}

const santizeUrl    = (path)   => path.replace('http://','https://')
const getRemoteHost = (origin) => {
  switch(origin){
    case 'http://localhost:8080'    : return origin;
    case 'http://dev.tools.sho.com' : return 'http://dev.www.sho.com' ;
    case 'http://qa.tools.sho.com'  : return 'https://qa-www.sho.com' ;
    case 'https://qa.tools.sho.com' : return 'https://qa-www.sho.com' ;
    case 'https://tools.sho.com'    : return 'https://www.sho.com'    ;
    default:
      return origin
  }
}

export default hunter