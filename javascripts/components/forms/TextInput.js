import React, { Component } from 'react';
import cn from 'classnames'

import {humanize} from '../../utils/string'
import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
// no refs to Field or reduxForm in here - these are just the unconnected
// 'dumb' components, which makes for easier unit testing

export const TextInput = ({input, inputType, dataType, required, meta, inline}) => {
  const {name} = input
  const {error, touched}  = meta
  const attrs = getAttrs({name,inputType,dataType,required})
  
  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{humanize(name)}</label>
      }
      <input {...input} {...attrs} type={attrs.type || 'text'} />
      {(!inline && error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}