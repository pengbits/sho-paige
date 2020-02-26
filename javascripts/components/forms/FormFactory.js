import cn from 'classnames'
import React, {Component} from 'react'
import { Field } from 'redux-form'
import { TextInput } from './TextInput'
import { TextArea } from './TextArea'
import { ImagePathInput } from './ImagePathInput'
import { Select } from './Select'
import { Checkbox } from './Checkbox'
import { DateTimeInput } from './DateTimeInput'
import { humanize } from '../../utils/string'
import { getValidator } from '../../utils/validation'
import FormConfigs from '../form-configs'

// this is our list of input types.. the types are the keys and the values are the component classes
// it's ok to re-use the input types, as the disntinction might just be around attributes + classNames
const INPUT_MAP = {
  'imagePath' : ImagePathInput,
  'number'    : TextInput,
  'select'    : Select,
  'text'      : TextInput,
  'textArea'  : TextArea,
  'checkbox'  : Checkbox,
  'datetime'  : DateTimeInput,
  'readOnlyText' : TextInput
}

export const FORM_SECTIONS = ['head','body','footer']

let fieldMap;

class FormFactory {
  constructor(cfg){
    // console.log(`hello from FormFactory context:'${cfg.context}'`)
  }
  
  getInput({name,dataType,inputType,required}){
    if(!INPUT_MAP[inputType]) {
      throw new Error(`unknown inputType: '${inputType}'`)
    } else {
      const component = INPUT_MAP[inputType]
      return (attrs) => {
        // decorate the constructor so we can pass in the following:
        // 1. name ie 'position' (although this is also passed in as a property of 'input')
        // 2. dataType ie 'text'
        // 3. inputType ie 'text','number','radio'
        return component({name, dataType, inputType, ...attrs})
      }
    }
  }
  
  // take above component and wrap in a <Field> for use w/ redux-form
  getReduxFormInput(config,i){
    const renderComponent = this.getInput(config)
    return (entry) => {
      // strip out problematic `validate` prop so it's not sent to renderer,
      // but extract the `required` prop that is inside before discarding
      const {validate, ...attrs} = entry
      const {required} = (validate || {})
      return (<Field
        component={renderComponent}
        key={i} 
        required={required} 
        name={attrs.name}
        {...attrs}
      />)
    }
  }
  
  getFormGroupClassNames({name,inline}){
    return cn(
        'promo-form-group',
        'promo-form-group--'+ humanize(name),
      { 'promo-form-group--inline' : inline },
      { 'form-group' : !inline }
    )
  }
  
  getFormGroupElement({name,inline,children}){
    return (<div className={this.getFormGroupClassNames({name,inline})}>
      {children}
    </div>)
  }
  
  // parse the config and return a map where keys are fieldnames
  // and values are Field components suitable for rendering..
  getInputMap(config){
    let Input, map = {};
    FORM_SECTIONS.map(sectionName => {
      if(config[sectionName] && config[sectionName].children){
        const {children} = config[sectionName]
        children.map(entry => {
          Input = this.getReduxFormInput(entry)
          map[entry.name] = Input
        })
      }
    })
    return map
  }
  
  getConfig({context}){
    if(context && FormConfigs[context]) {
      // console.log(`FormFactory#getConfig found custom context: '${context}'`)
      return FormConfigs[context]
    } else {
      // console.log(`FormFactory#getConfig using default for '${context}'`)
      return FormConfigs.default
    }
  }
  
  getValidator(opts){
    return getValidator(opts)
  }
}

// this should be cached ie a true singleton
export const getFormFactory = (cfg => {
  return new FormFactory(cfg)
})

export default FormFactory