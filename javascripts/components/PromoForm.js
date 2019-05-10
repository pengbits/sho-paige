import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Promo from '../models/Promo'
import FormFactory from './forms/FormFactory'
import FormConfig from './PromoFormConfig'
import Buttons from './forms/Buttons'

// get the element for wrapping inputs into sections
const FormGroup = FormFactory.getFormGroupElement.bind(FormFactory)
// parse the configuration for the form into a map where keys
// are fieldNames and values are components suitable for rendering into the view
// todo: should this be encapsulated in the Factory?
const InputMap  = FormFactory.getInputMap(FormConfig)

// get the validator function to pass to redux-form
const validator = FormFactory.getValidator(['default',{'config':FormConfig}])

class PromoForm extends Component {
  render(){
    const {
      id,
      isNew,
      name,
      ctaTypeOptions,
      isDraft,
      openPicker,
      closePicker,
      datetimes
    } = this.props

    const {
      handleSubmit, 
      pristine, 
      submitting,
      change
    } = this.props
    
    const {
      detailsError,
      detailsErrorMessages,
      groupError,
      groupErrorMessages
    } = this.props;
    
    return (
      <form className="promo-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        {detailsError && detailsErrorMessages.length ? 
          (<p className='promo-form__error-message'>
            We were unable to save the promotion. Please check double check your input for errors and try again. If you continue to see the error please contact us at tools@showtime.net.<br />
          </p>) : undefined
        }

        {groupError && groupErrorMessages.length ? 
          (<p className='promo-form__error-message'>
            There are issues with the fields below<br />
            {groupErrorMessages.map((e,i) => <span key={i}>{e}<br /></span>)}
          </p>) : undefined
        }
      
        <FormGroup name='head' inline='true'>
          <span className='promo-form__input promo-list__item__column--window' 
            data-promotional-window='disabled'>
          </span>
          {this.getGroupInputs('head', {
            'inline'       : true, 
            'resetValue'   : this.onCloseDateTimePicker.bind(this),
            openPicker,
            closePicker,
            datetimes
          })}
          <span className='promo-form__input promo-form__input--tools'></span>
        </FormGroup>
        <FormGroup name='body'>
          {this.getGroupInputs('body', {ctaTypeOptions})}
        </FormGroup>
       <FormGroup name='footer'>
         <div className="footer__left-buttons">
           <Buttons.Cancel onClick={this.onCancel.bind(this)} />
          </div>
          <Buttons.Save {...this.props} />
         <FormGroup name='draft-mode'>
           {this.getGroupInputs('footer', {isChecked: isDraft})}
         </FormGroup>
         {!isNew && <Buttons.Delete onClick={this.confirmDelete.bind(this)} />}
       </FormGroup>
     </form>
    )
  }
  
  getGroupInputs(name, opts){
    return (FormConfig[name].children || []).map(input => {
      return this.getInput(input,opts)
    })
  }
  
  getInput(input, opts={}){
    const Input = InputMap[input.name]
    const optionsForSelect = input.inputType !== 'select' ? 
      {} : {'options': (input.options || opts.ctaTypeOptions)}
    ;
    return <Input 
      key={`input-${input.name}`} 
      {...input} 
      {...opts}
      {...optionsForSelect}
    />
  }

  onSubmit(attrs){
    const {
      isNew,
      createPromo,
      updatePromo,
      id,
      isDraft
    } = this.props
    
    const {
      startDate, endDate, setDraftMode, ...input
    } = attrs
    
    // only convert non-null input to datetimes
    let json = {...input};
    if(startDate) json.startDate = Promo.toTimestamp(startDate)
    if(endDate)   json.endDate   = Promo.toTimestamp(endDate)

    // handle some weirdness w/ draft mode checkbox state
    json.isDraft                 = setDraftMode !== undefined ? setDraftMode : isDraft
    
    if(isNew){
      createPromo(json)
    } else {
      updatePromo(json)
    }    
  }
  
  onCancel(){
    this.props.cancelEditing()
  }

  confirmDelete(e){
    e.preventDefault()
    if(confirm("Are you sure you want to delete this Promotion? This cannot be undone.")) {
      const {deletePromo,id} = this.props
      deletePromo({id})
    } 
  }

  onCloseDateTimePicker(e, field){
    e.preventDefault()

    this.props.unsetDatetime({field})
    // this.props.change(field null) 
    // moved to form-hooks middleware
  }
}

export default reduxForm({
  form: 'promo',
  destroyOnUnmount: false,
  enableReinitialize: true,
  validate: validator
})(PromoForm)