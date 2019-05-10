import React, { Component } from 'react';
import cn from 'classnames'

import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
import ImagePathValidator from './ImagePathValidator'

export const ImagePathInput = ({input, inputType, dataType, meta, inline}) => {
  const {name,required}  = input
  const {error, touched} = meta
  const opts             = getAttrs({name,inputType,dataType})

  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{name}</label>
      }
      <input {...input} {...opts} type='text' />
      <ImagePathValidator isValid={true} />
      {(error && touched) &&
        <span className={"promo-form__input__help-block"}>{error}</span>
      }
    </div>
  )
}
