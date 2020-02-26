import React, { Component } from 'react';
import cn from 'classnames'

import {getAttrs} from './FormsAttrsMap'
import {getClassNames} from './FormClassNames'
import ImagePathValidator from './ImagePathValidator'
import ImagePreview from './ImagePreview'
import ImageHunter from '../../containers/forms/ImageHunter'

export const ImagePathInput = ({input, inputType, dataType, meta, inline, imagePathStatuses}) => {
  const {name,required, value}  = input
  const {error, touched} = meta
  const opts             = getAttrs({name,inputType,dataType})
  const imagePathStatus = imagePathStatuses ? imagePathStatuses[name] : null;

  return (
    <div className={getClassNames({name,inputType,dataType,meta})}>
      {!inline && 
        <label htmlFor={name}>{name}</label>
      }
      <input {...input} {...opts} type='text' />
      <span className='promo-form__image-actions'>
        <ImageHunter name={name} />
        <ImagePreview src={value} imagePathStatus={imagePathStatus} error={error}/>
        {value && <ImagePathValidator imagePathStatus={imagePathStatus} error={error}/>}
        {(error && touched) &&
          <span className={"promo-form__input__help-block"}>{error}</span>
        }
      </span>
    </div>
  )
}
