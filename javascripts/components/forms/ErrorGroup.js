import React, { Component } from 'react';
import cn from 'classnames'
import Datetime from 'react-datetime'

const HEADER_TOP = `There are issues with the fields below`
const HEADER_BOTTOM = `We were unable to save the promotion. 
  Please double check your input for errors and try again. 
  If you continue to see the error please contact us at tools@showtime.net.`

export default ({errors,position}) => {
  const isTop         = position == 'top'
  const headerText    = isTop ? HEADER_TOP : HEADER_BOTTOM
  const displayErrors = isTop ? errors : [] // intentionally omit the generic 405 Method not allowed
  if(!errors.length) return null
  
  return (
    <p className='promo-form__error-message'>
      {headerText}
      <br />
      {displayErrors.map((error,i) => <span key={i}>{error}<br /></span>)}
    </p>
  )
}