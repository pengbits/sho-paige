
import React, {Component } from 'react'
import {defineFeature, loadFeature} from 'jest-cucumber';
import moment from 'moment'
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount, render } from 'enzyme';
import reactElementToJSXString from 'react-element-to-jsx-string';
import {getFormFactory} from '../components/forms/FormFactory'
import {capitalize} from '../utils/string'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc utils
const toJSXString = (element) => reactElementToJSXString(element, {'filterProps':['onChange']})


// tests begin
let component
let element, Element
let wrapper
let expectedJSX
let props
let meta
let input
let field
let factory = getFormFactory({context:'wibble'})

const given_this_input = (json) => {
  props = JSON.parse(json)
  meta  = props.meta  || {}
  input = props.input || {}
}

const get_component_from_factory = () => {
  const {name,dataType,inputType} = props
  component = factory.getInput({name,dataType,inputType})
  return component
}

const render_the_component = (component) => {
  element = component({
    ...props,
    'meta'      : (meta  || {}),
    'input'     : ({
      'name'  : props.name, 
      'value' : input && input.value !== undefined ? input.value : ''
    })
  })

  return element
}

const when_i_render_it = () => {
  get_component_from_factory()
  render_the_component(component, {meta,input})
}

const then_it_has_this_this_jsx_structure = (jsx) => {
  if(!jsx) return
  // console.log(jsx)
  expect(toJSXString(element)).toEqual(jsx)
}

const then_it_has_these_classnames = (json) => {
  const classes = JSON.parse(json)
  classes.map(c => {
    expect(wrapper.hasClass(c)).toBe(true)
  })
}

// Text Input
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/text.feature`), test => {
  test("Render Position as Text", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
  
  test("Render LargeImageURL as Text", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
  
  test("Render Name as Text (Inline)", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})


// TextArea
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/textarea.feature`), test => {
  test("Render Description as TextArea", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})

// Number Input
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/number.feature`), test => {
  test("Render Position as Number", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})


// Select
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/select.feature`), test => {
  test("Render CtaType as Select", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})

// Checkbox
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/checkbox.feature`), test => {
  test("Render SetDraftMode as Checkbox", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})

// Datetime
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/datetime.feature`), test => {
  test("Render startDate as DateTimeInput", ({given, when, then }) => {
    given('this input', (json) => given_this_input(json))                    
    when('I render it', ()     => {
      Element = get_component_from_factory()
      wrapper = shallow(<Element input={input} />)
    })
              
    then('it has these classnames', then_it_has_these_classnames)
    then('it has this structure', () => {
      wrapper = mount(<Element input={input} />)
      const widget = wrapper.find('DateTimeWidget')
      expect(widget).toBeTruthy() // tbd
    })
  })
})


// Image with preview, hunter, and link-validator)
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/image-path.feature`), test => {
  test("Render Image as ImagePath", ({given, when, then }) => {
    given('this input', (json) => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))      
    then('it has this structure', (jsx)  =>  then_it_has_this_this_jsx_structure(jsx))
  })
})


// form-group
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/form-group.feature`), test => {
  test("Render Inline Form Group", ({given, when, then }) => {
    given('this input', (json) => given_this_input(json))            
    
    when('I render it', () => {
      element = factory.getFormGroupElement({...props,children:null})
      Element = function(){ return element }
      wrapper = shallow(<Element />)
    })
    
    then('it has these classnames', then_it_has_these_classnames)
  })
})

// images
defineFeature(loadFeature(`${PAIGE_ROOT}/features/forms/components/image-path.feature`), test => {
  test("Render Image as ImagePath", ({given, when, then }) => {
    given('this input', (json)           => given_this_input(json))                    
    when('I render it', (meta,input)     => when_i_render_it(meta,input))              
    then('it has this structure', (jsx)  => then_it_has_this_this_jsx_structure(jsx))  
  })
})