import React, { Component } from 'react';
import cn from 'classnames'
import { Field } from 'redux-form'
import {getAttrs} from './FormsAttrsMap'

// no refs to Field or reduxForm in here - these are just the unconnected
// 'dumb' components, which makes for easier unit testing
import {capitalize} from '../../utils/string'

export const Checkbox = ({isChecked, inputType, dataType, input, meta}) => {
  const {name, value }   = input
  const {error, touched} = meta
  const {label}          = getAttrs({name})
  return (
  <label>
    <Field
      name={name}
      component='input'
      type="checkbox"
      defaultChecked={isChecked}
      checked={value}
    />
    {label}
  </label>
  )
}