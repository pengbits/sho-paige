import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { TextInput, DateTimeInput, SelectInput, CheckboxInput } from './Forms'
import { getValidator } from '../utils/validation'
import Promo from '../models/Promo'

class PromoForm extends Component {

  render(){
    const {
      id,
      isNew,
      name,
      ctaTypeOptions,
      isDraft
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
          <TextInput name='position'        inline={true} size={4} />
          <TextInput name='name'            inline={true} required={true} />
          <DateTimeInput name='startDate'  inline={true} resetValue={this.clearSection.bind(this)} />
          <DateTimeInput name='endDate'    inline={true} resetValue={this.clearSection.bind(this)} />
          <span className='promo-form__input promo-form__input--tools'></span>
        </div>
        <div className='promo-form-group form-group'>
          <TextInput name='title'           required={true} />
          <TextInput name='topLine'        />
          <TextInput name='seriesId'       />
          <TextInput name='seasonNumber'   />
          <TextInput name='showId'         />          
          <TextInput name='largeImageUrl' />
          <TextInput name='smallImageUrl' />
          {(ctaTypeOptions || []).length
             ? <SelectInput name='ctaType' className='cta-type-dropdown' options={ctaTypeOptions}/> : 
               <TextInput name='ctaType' /> }
          <TextInput name='ctaLabel'       />
          <TextInput name='ctaLink'        />
        </div>
        <div className='promo-form-group form-group'>
          <a className='promo-form__button promo-form__button--cancel' href="#" onClick={this.onCancel.bind(this)}>
            Cancel
          </a>
          <button className='promo-form__button promo-form__button--submit btn btn-primary' type="submit" disabled={pristine || submitting}>
            Save
          </button>
          <div className='promo-form-group--is-draft'>
            <CheckboxInput name="setDraftMode" label="Draft Mode" isDraft={isDraft}/>
          </div>
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
    if(confirm("Are you sure you want to delete this Promo Detail? This cannot be undone.")) {
      const {deletePromo,id} = this.props
      deletePromo({id})
    } else {
      e.preventDefault()
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