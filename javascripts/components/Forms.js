import React, { Component } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import { Field } from 'redux-form'
import {
  camelize,
  hyphenize,
  humanize
} from '../utils/string'


const inputAttributes = ({name,className,size,meta={}}) => {
  const propertyName = camelize(name)
  const modifier     = `promo-form__input--${hyphenize(name)}`
    let classNames   = `promo-form__input ${modifier} ${className ? className : ''}`
        classNames   = meta.touched && meta.error ? `${classNames} promo-form__input--error` : classNames
  const opts  = size ?  {size} : {}

  return {
    propertyName,
    modifier,
    classNames,
    opts
  }
}

const renderDateTimeWidget = (props, openCalendar) => {
  const { attrs } = props;
  const { value, clearFilterField, resetValue, name } = attrs;
  
  return (
    <div className="date-time-wrapper">
      <input {...props} />
      <div className="date-time-addon"
        onClick={!!value ? 
          (clearFilterField ? 
            clearFilterField : (e) => {resetValue(e, name)}) 
          : openCalendar }
      >
        {!!value ?
          <div className='input-cancel'> x </div>
          : <span className="fa fa-calendar"/> 
        }
      </div>
    </div>
  )
}

export const DateTimeWidget = (attrs) => {
  const {value, clearFilterField, resetValue, name, ...props} = attrs
  const {inputProps} = props

  // removed open={false} config setting for TOOL-3829
  // changed tab indenting (also just wanted to result in a bigger git change) 
  return (
    <Datetime 
      renderInput={renderDateTimeWidget}
      {...props}
      value={!!value ? moment(value): undefined} 
      utc={false}
      inputProps={{
        ...inputProps,
        readOnly: true,
        attrs: attrs
      }}
    />
  )
}

export const DateTimeInput = ({name, className, ...props}) => {
   // inputAttributes is called twice because its needed in two different scopes:
   // 1. immediately, to extract the propertyName needed for the field
   // 2. in the closure, where the input's meta object is defined, to generate className and modifiers etc
  const {propertyName} = inputAttributes({name}) // 1            
  return (<Field name={propertyName} component={({input,meta}) => {
    const {modifier,classNames,opts} = inputAttributes({name,className,meta})  // 2
    return (
      <div className={classNames}>
        <DateTimeWidget {...props} {...input} />
      </div> 
    )}} /> 
  )
}

const renderTextInput = ({input,meta,inline,className,size,required}) => {
  const {name} = input
  const {propertyName,modifier,classNames,opts} = inputAttributes({name,className,size,meta})
  const {error, touched} = meta

  const placeholder = required ? 'Required' : undefined
  
  return (
    <div className={classNames}>
      {!inline && 
        <label htmlFor={name}>{humanize(name)}</label>
      }
      <input {...input} placeholder={placeholder} required={required} type='text' {...opts}/>
      {(error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}

export const TextInput = ({name,size,inline,className,required}) => {
  return (
    <Field 
      component={renderTextInput} 
      inline={inline} 
      className={className} 
      name={name} 
      size={size} 
      required={required}
    />
  )
}

export const CheckboxInput = ({name, label, isDraft}) => {
  return (
    <Field 
      component={renderCheckboxInput} 
      name={name} 
      type="checkbox"
      label={label}
      isDraft={isDraft}
    />
  )
}

const renderCheckboxInput = ({input, type, label, isDraft, meta}) => {
  const {value, name} = input
  const isChecked = isDraft && meta.dirty == false ? isDraft : value
  return (
    <label>
      <Field {...input} component="input" type={type} name={name} checked={isChecked}/>
      {label}
    </label>
  )
}

export const SelectInput = ({name,className,options}) => {
  const {propertyName,classNames} = inputAttributes({name,className})
  return (
    <div className={classNames}>
      <label htmlFor={name}>{name}</label>
      <Field 
        name={propertyName} 
        className={className} 
        component="select">
        <option>choose one</option>
      {options.map((value,idx) => <option key={idx} value={value}>
        {value}
      </option>)}
      </Field>
    </div>
  )
}