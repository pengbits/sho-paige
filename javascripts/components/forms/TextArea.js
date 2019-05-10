import React, { Component } from 'react';
import cn from 'classnames'

import {humanize} from '../../utils/string'
import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
// no refs to Field or reduxForm in here - these are just the unconnected
// 'dumb' components, which makes for easier unit testing

export const TextArea = ({input, inputType, dataType, meta, inline}) => {
  const {name, value}  = input
  const {error, touched} = meta
  const attrs            = getAttrs({name,inputType,dataType})

  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{humanize(name)}</label>
      }
      <textarea {...input} {...attrs} value={value} />
      {(error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}