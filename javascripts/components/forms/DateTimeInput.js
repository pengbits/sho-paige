import React, { Component } from 'react';
import cn from 'classnames'
import Datetime from 'react-datetime'
import moment from 'moment'
import {humanize} from '../../utils/string'
import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
// no refs to Field or reduxForm in here - these are just the unconnected
// 'dumb' components, which makes for easier unit testing


// this will wrap the react-datetime widget in out custom ui,
// and apply either clearFilterField or resetValue callback, whichever is passed in,
// resetValue is for the promo-form, and clearFilterField is for filters,
// but these could probably both just use one generic property name, ie `onClose`
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
          <div className='input-cancel'>&#215;</div>
          : <span className="fa fa-calendar"/> 
        }
      </div>
    </div>
  )
}

export const DateTimeWidget = (attrs) => {
  const {value, name, datetimes, ...props} = attrs
  const {inputProps} = props
  return (
    <Datetime 
      renderInput={renderDateTimeWidget}
      {...props}
      value={!!value ?
        moment(value):name && datetimes ? 
          getDefaultValue(datetimes[name]) : undefined} 
      utc={false}
      inputProps={{
        ...inputProps,
        readOnly: true,
        attrs: attrs
      }}
    />
  )
}

export const DateTimeInput = ({input, meta, value, inline, resetValue, ...attrs}) => {
  const {name, required}      = input || {}
  const {error, touched}      = meta  || {}
  const {inputType, dataType} = attrs
  const { openPicker, closePicker, datetimes } = attrs
  // not needed at moment, but this is how we would hook up the same 
  // 'cascading attribute mapping' as other inputs to mixin behavior by datatype OR name OR inputType etc
  // const configurableAttrs = getAttrs({name,inputType,dataType})
  
  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{humanize(name)}</label>
      }
      <DateTimeWidget 
        name={name} 
        value={value}
        resetValue={resetValue}
        datetimes={datetimes}
        {...input} 
        onFocus={(e)=>{openPicker({name})}}
        onBlur={()=>{closePicker({name})}}
      />
      {(!inline && error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}

const getDefaultValue = (picker) => {
  //We only want to set the default value if the picker is open and no value has already been chosen
  //Check to see if the picker isOpen, then grab the corresponding default value from redux state
  if(picker.isOpen) {
    return picker.defaultDateTime
  }
  return undefined;
}





