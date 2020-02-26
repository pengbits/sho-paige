import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import Promo from '../models/Promo'
import ErrorGroup from './forms/ErrorGroup'
import FormFactory, {getFormFactory} from './forms/FormFactory'
import FormConfigs from './form-configs'
import Buttons from './forms/Buttons'

let FormGroup, FormConfig, InputMap, Validator, factory;



class PromoForm extends Component {
  componentWillMount() {
    
    // get the contentBlock-derived key ie 'recaps'
    const context = this.props.contentBlockKey
    
    // get the factory
    factory   = getFormFactory({context})
    
    // get the element for wrapping inputs into sections
    FormGroup  = factory.getFormGroupElement.bind(factory)
    
    // parse the configuration for the form into a map where keys
    // are fieldNames and values are components suitable for rendering into the view
    FormConfig = factory.getConfig({context})
    InputMap   = factory.getInputMap(FormConfig)
  }
  
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
      groupErrorMessages,
      smallImageUrlStatus,
      largeImageUrlStatus
    } = this.props;
    
    return (
      <form className="promo-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <ErrorGroup position='top' 
          errors={groupErrorMessages} 
        />
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
          <ErrorGroup position='bottom' 
            errors={detailsErrorMessages} 
          />
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
    return (FormConfig[name].children || []).filter(input => {
      return !input.renderConditions || this.conditionallyRenderInput(input.renderConditions)
    }).map(input => {
      return this.getInput(input,opts)
    })
  }
  
  getInput(input, opts={}){
    const Input = InputMap[input.name]
    const optionsForSelect = input.inputType !== 'select' ? 
      {} : {'options': (input.options || opts.ctaTypeOptions)};
          
    const imagePathStatuses = input.inputType !== 'imagePath' ? 
      {} : {[input.name] : this.props[input.name + 'Status']};

      return <Input 
      key={`input-${input.name}`} 
      imagePathStatuses={imagePathStatuses}
      {...input} 
      {...opts}
      {...optionsForSelect}
    />
  }
  
  // see if the inputs should be conditionally omitted from the output based on prop state
  conditionallyRenderInput(conditions){
    for(const key in conditions){
      if(this.props[key] !== conditions[key]) return false
    }
    return true
  }

  onSubmit(attrs){
    const {
      isNew,
      createPromo,
      updatePromo,
      id,
      isDraft
    } = this.props
    
    // pull these fussy properties out of the object with a spread,
    // some need extra processing, and some (displayContext) are just discarded outright
    const {
      startDate, endDate, displayContext, setDraftMode, ...input
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
const wrappedForm = reduxForm({
  form: 'promo',
  destroyOnUnmount: false,
  enableReinitialize: true,
})(PromoForm)

export default wrappedForm