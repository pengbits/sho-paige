import React, { Component } from 'react';
import {humanize,hyphenize} from '../../utils/string';

const getClassNames = ({name}) => {
  let cn  = 'promo-form__button '
      cn += `promo-form__button--${hyphenize(humanize(name))} `
  
  if(name == 'delete') {
      cn += 'btn btn-danger '
  }
  if(name == 'save') {
      cn += 'btn btn-primary ' 
  }
  return cn
}
export const CancelButton = ({onClick}) => {
  return (
    <a className={getClassNames({name:'cancel'})} href="#" onClick={onClick}>
      Cancel
    </a>
  )
}
export const DeleteButton = ({onClick}) => {
  return (
    <div className='promo-form__delete'>
      <button className={getClassNames({name:'delete'})} onClick={onClick}>
        Delete
      </button> 
    </div>
  )
}

export const SaveButton = ({pristine,submitting}) => {
  return (
    <button className={getClassNames({name:'save'})} type="submit" disabled={pristine || submitting}>
      Save
    </button>
  )
}

export const Submit = SaveButton

export default {
  Save: SaveButton,
  Submit: Submit,
  Cancel: CancelButton,
  Delete: DeleteButton
}