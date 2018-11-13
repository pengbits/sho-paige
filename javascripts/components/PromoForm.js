import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { TextInput, DateTimeInput, SelectInput } from './Forms'
import { getValidator } from '../utils/validation'
import Promo from '../models/Promo'

class PromoForm extends Component {

  render(){
    const {
      id,
      isNew,
      name,
      ctaTypeOptions
    } = this.props
    const {
      handleSubmit, 
      pristine, 
      submitting,
      change
    } = this.props;
    
    return (
      <form className="promo-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className='promo-form-group promo-form-group--inline'>
          <span className='promo-form__input promo-list__item__column--window' 
            data-promotional-window='disabled'
          >
          </span>
          <TextInput name='position'       inline={true} size={4} />
          <TextInput name='name'           inline={true} required={true} />
          <DateTimeInput name='start date' inline={true} resetValue={this.clearSection.bind(this)} />
          <DateTimeInput name='end date'   inline={true} resetValue={this.clearSection.bind(this)} />
          <span className='promo-form__input promo-form__input--tools'></span>
        </div>
        <div className='promo-form-group form-group'>
          <TextInput name='title'          required={true} />
          <TextInput name='top line'        />
          <TextInput name='series id'       />
          <TextInput name='season number'   />
          <TextInput name='show id'         />          
          <TextInput name='large image Url' />
          <TextInput name='small image Url' />
          {(ctaTypeOptions || []).length
             ? <SelectInput name='cta type' className='cta-type-dropdown' options={ctaTypeOptions}/> : 
               <TextInput name='cta type' /> }
          <TextInput name='cta label'       />
          <TextInput name='cta link'        />
        </div>
        <div className='promo-form-group form-group'>
          <a className='promo-form__button promo-form__button--cancel' href="#" onClick={this.onCancel.bind(this)}>
            Cancel
          </a>
          <button className='promo-form__button promo-form__button--submit btn btn-primary' type="submit" disabled={pristine || submitting}>
            Save
          </button>
        </div>        
        {!isNew &&
        <div className='promo-form__delete'>
          <button className='promo-form__button promo-form__button--delete btn btn-danger' onClick={this.confirmDelete.bind(this)}>Delete</button>
        </div>}
      </form>
    )
  }

  onSubmit(attrs){
    const {
      isNew,
      createPromo,
      updatePromo,
      id
    } = this.props
    
    const {
      startDate, endDate, ...input
    } = attrs
    
    // only convert non-null input to datetimes
    let json = {...input};
    if(startDate) json.startDate = Promo.toTimestamp(startDate)
    if(endDate)   json.endDate   = Promo.toTimestamp(endDate)

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
    if(confirm("Are you sure you want to delete this Promo Detail? This cannot be undone.")) {
      const {deletePromo,id} = this.props
      deletePromo({id})
    } 
  }

  clearSection(e, section){
    e.preventDefault()
    this.props.change(section, null)
  }
}

export default reduxForm({
  form: 'promo',
  destroyOnUnmount: false,
  enableReinitialize: true,
  validate: getValidator()
})(PromoForm)