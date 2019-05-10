import { 
  initialize, 
  blur, 
  focus,
  change, 
  setSubmitFailed,
  getFormValues
} from 'redux-form'

const BLUR                = blur().type //'@@redux-form/BLUR'
const FOCUS               = focus().type //'@@redux-form/FOCUS'
const CHANGE              = change().type //'@@redux-form/CHANGE'
const SET_SUBMIT_FAILED   = setSubmitFailed().type //'@@redux-form/SET_SUBMIT_FAILED'
const UPDATE_SYNC_ERRORS  = '@@redux-form/UPDATE_SYNC_ERRORS'
import {INPUTS_IN_HEAD} from '../components/PromoFormConfig'

import { 
  NEW_PROMO, 
  CREATE_PROMO,
  UPDATE_PROMO, 
  HIGHLIGHT_PROMO, 
  UNHIGHLIGHT_PROMO,
  UNSET_DATETIME,
} from '../redux/promos/types'

import { groupErrorUpdated }  from '../redux/promos/actions'
import { UNSET_FILTERS }      from '../redux/filters'
import { SET_CONFIG}          from '../redux/configs'

import { 
  setDefaults, 
  getKeyFromContentBlock,
  getTemplateForField,
  getTemplateWasApplied,
  applyTemplateToField,
  APPLY_TEMPLATE
} from '../redux/form-defaults'

const FormHooksMiddleware = store => next => action => {
  if(typeof action =='object'){  // not true of thunks, they'll be functions
    
    let 
      payload, 
      status, 
      id,
      form,
      promo,
      syncErrors,
      field,
      key,
      template,
      error,
      doDispatch
    ;
    
    switch(action.type){
      // need to listen to config events for the initial load of form defaults
      case SET_CONFIG:
        const {FORM_DEFAULTS}   = action.payload
        const {CONTENT_BLOCKS}  = FORM_DEFAULTS || {}
        // we only support defaults stored by name of content-block
        Object.keys(CONTENT_BLOCKS || {}).map((key) => {
          store.dispatch(setDefaults({
            key,
            'defaults' : CONTENT_BLOCKS[key]
          }))
        })
        break;
        
      // - if the user was editing a promotion, and then clicks 'add promo',
      // empty the form of the previously selected promo's attributes
      case NEW_PROMO:
        initialize('promo', {}, false)
        break;
        
      // if the user has reset the text filters,
      // we need to clear the form to empty the input
      // this looks like it might be clobbering startDate when resetting endDate and vice versa, but doesnt seem to matter
      case UNSET_FILTERS:
        action.payload.type == 'text' && store.dispatch(initialize('search'))
        break;
        
      case `${CREATE_PROMO}_FULFILLED`:
      case `${UPDATE_PROMO}_FULFILLED`:
        const payload = action.payload.payload || {};
        const id      = payload ? payload.id : undefined;

        if(payload && id){
          highlightRow({store, id})
        } else {
          return store.dispatch({
            type    : action.type.replace('_FULFILLED','_REJECTED'),
            payload : action.payload
          })
        }
        break;
        
      case BLUR:
      case CHANGE:
        
        field      = action.meta.field
        // we are conditionally dispatching on BLUR and CHANGE actions,
        // since they have the fieldname available as metadata,
        // but we impose a tiny delay so UPDATE_SYNC_ERRORS can propogate for the CHANGE case..
        INPUTS_IN_HEAD.includes(field) && setTimeout(function() {
          form       = store.getState().form
          syncErrors = form.promo.syncErrors
          
          // either there is an error, or it was cleared or no-op
          error = syncErrors ? syncErrors[field] : undefined
          doDispatch = (
            (action.type == BLUR   && !!error) ||
            (action.type == CHANGE && !error)
          )
          
          // const atype = action.type.replace('@@redux-form/','')
          // console.log(`|${atype}| ${field} ${doDispatch ? 'dispatch √' :'dispatch x'} "${error}"`)
          // for dates, only last touched input is dispatched.. ie startDate
          doDispatch && store.dispatch(groupErrorUpdated({
            field,
            error
          }))
          
          
        }, 0)
        break
    
      
      case FOCUS:
        const {contentBlock, formDefaults} = store.getState()
        field     = action.meta.field
        key       = getKeyFromContentBlock(contentBlock)
        template  = getTemplateForField(formDefaults, key, field)
        
        if(template && !getTemplateWasApplied(formDefaults, key, field)){
          store.dispatch(applyTemplateToField(template, key, field))
        }
        break
        
      case APPLY_TEMPLATE:
        field         = action.payload.field
        template      = action.payload.template
        const {input} = action.payload;
        const values  =  getFormValues('promo')(store.getState())
        
        if(values[input]){
          const transform = template.replace('{'+input+'}', values[input])

          store.dispatch(
            change('promo', field, transform)
          )
        }
        
  
        break;  
        
      case UNSET_DATETIME: 
        // if the user clicked on the little [x] in the datepicker, 
        // let's clear out the input and simulate a blur
        if(action.payload.field){
          store.dispatch(
            change('promo', action.payload.field, null)
          )
          
          setTimeout(store.dispatch, 0, 
            blur('promo', action.payload.field, null)
          )
        }
        break
        
      case SET_SUBMIT_FAILED:

        form       = store.getState().form
        syncErrors = form.promo.syncErrors || {}
        
        for(field in syncErrors){
          error = syncErrors[field]
          if(INPUTS_IN_HEAD.includes(field) && error){
            store.dispatch(groupErrorUpdated({
              field,
              error
            }))
          }
        }
        
        break
        
      case `${CREATE_PROMO}_REJECTED`:
      case `${UPDATE_PROMO}_REJECTED`:
        setTimeout(() => {
          const {promos} = store.getState()
          if(promos.detailsError){
            const {
              map,
              statusText
            } = promos.detailsError
            
            // the action-creator is unfortunately not available for this one 
            store.dispatch({
              type: UPDATE_SYNC_ERRORS,
              meta: { form: 'promo'},
              payload: {
                syncErrors: map,
                error: statusText
              }
            })
          }
        }, 0)
        break
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