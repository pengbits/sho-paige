import { 
  initialize 
} from 'redux-form'

import { 
  NEW_PROMO, 
  CREATE_PROMO,
  UPDATE_PROMO, 
  HIGHLIGHT_PROMO, 
  UNHIGHLIGHT_PROMO 
} from './redux/promos'

import { 
  UNSET_FILTERS 
} from './redux/filters'

const FormHooksMiddleware = store => next => action => {
  if(typeof action =='object'){  // not true of thunks, they'll be functions
    
    switch(action.type){
      // if the user was editing a promotion, and then clicks 'add promo',
      // this empties the form of the previously selected promo's attributes
      // TODO: can we expose this in the testing context because it's kinda magical here
      case NEW_PROMO:
        const {contentBlock} = store.getState()
        store.dispatch(initialize('promo', {'contentBlockId' : contentBlock.id}, false))
        break;
        
      // if the user has cleared the FilterSearchBox (unset the title filter)
      // we need to empty the form input
      case UNSET_FILTERS:
        store.dispatch(initialize('search'))
        store.dispatch(initialize('datetime'))
        break;
        
      case `${CREATE_PROMO}_FULFILLED`:
        const {payload} = action.payload
        const {id} = payload
        highlightRow({store,id})
        break;
        
      case `${UPDATE_PROMO}_FULFILLED`:
        const state   = store.getState()
        const {promo} = state.form || {} // doesnt exist in testing context
        const {submitSucceeded,initial} = promo || {}

        submitSucceeded && initial && initial.id && highlightRow({store,id:initial.id})
        break;
    }
  }
  
  return(next(action))
}


const highlightRow = ({store,id}) => {
  setTimeout(store.dispatch, 0,   {type: HIGHLIGHT_PROMO, payload: {id}})
  setTimeout(store.dispatch, 500, {type: UNHIGHLIGHT_PROMO})
  // ^^^ timeout of 500ms to match transition-duration of 0.5s
  // in _list.scss near .promo-list__item {}...
}

export default FormHooksMiddleware