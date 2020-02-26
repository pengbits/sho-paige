import React, { Component } from 'react';
import { Field } from 'redux-form'
import cn from 'classnames'

import {humanize} from '../../utils/string'
import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
// no refs to Field or reduxForm in here - these are just the unconnected
// 'dumb' components, which makes for easier unit testing

export const Select = ({input, inputType, dataType, meta, inline, options}) => {
  const {name,required}  = input
  const {error, touched} = meta

  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{humanize(name)}</label>
      }
      <Field 
        name={name}  
        component="select">
        <option>choose one</option>
      {options.map((value,idx) => <option key={idx} value={value}>
        {value}
      </option>)}
      </Field>
      {(error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}


