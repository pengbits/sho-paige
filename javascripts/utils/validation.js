import {FORM_SECTIONS} from '../components/forms/FormFactory'
import Promo  from '../models/Promo'
import {errorMessages} from '../../../utils/errors';
import {humanizeField} from '../../../utils/string';

const rules_default = {} // moved to config

export const rules_by_datatype = {
  'number' : {'isNumber':true, 'minValue':0, 'maxValue':1000},
  'text'   : {'maxLength':150}
}

export const getRules = (strategy='default') => {
  const key = typeof strategy == 'string' ? strategy : Object.keys(strategy)[0]
  switch(key){
    case 'datatype':
    case 'config':
      return getConfigRules(strategy.config)
    case 'dataType':
      return rules_by_datatype
    case 'default':
    default:
      return rules_default
  }
}

const getConfigRules = (config) => {
  return FORM_SECTIONS.reduce((allrules,section) => {
    (config[section].children || []).map(input => {
      if(input.validate) {
        allrules[input.name] = input.validate
      }
    })
    return allrules
  }, {})
}

const getAllRules = (strategies) => {
  return strategies.reduce(function(allrules,strategy){
    const ruleset = getRules(strategy)
    return {
      ...allrules,
      ...ruleset
    }
  }, {})
}

// validation#validateInput()
// called against a single field
export const validateInput = (input,field,rule,values) => {
  const errors = {};
  
  if(rule.required && !input){
    errors[field] = `${field} can't be blank`;
  }
  else if(input)
  {
    if(rule.maxLength && input.length > rule.maxLength){
      if(!rule.isNumber){
        errors[field] = `${field} can't be longer than ${rule.maxLength} characters, which includes invisible formatting characters.`;
      }
      else {
        errors[field] = `${field} can't be longer than ${rule.maxLength} digits`;
      }
    }
    if(rule.forbidden && rule.forbidden.test(input)){
      errors[field] = `${field} contains forbidden characters`
    }
    if(rule.isNumber){
      const inputNumber = Number(input)
      if(isNaN(inputNumber)) {
        errors[field] = `${field} must be a number`
      } else if(input.toString().indexOf('.') > -1){
        errors[field] = `${field} must be a whole number, decimals are not supported`
      }
      else {
        if(rule.maxValue !== undefined && inputNumber > rule.maxValue){
          errors[field] = `${field} can't be greater than ${rule.maxValue}`
        }
        if(rule.minValue !== undefined && inputNumber < rule.minValue){
          errors[field] = `${field} can't be less than ${rule.minValue}`
        }
      }
    }

    if(rule.enforceHttps){
      if(input.slice(0,8) !== 'https://') {
        errors[field] =  `${humanizeField(field)} ${errorMessages['https']}`
      }      
    }

    // this is ignoring startDate input but that's another way
    // to introduce or remove the error...
    
    if(field == 'startDate' && rule.validForEndDate){
      if(values['endDate'] == null) return
      const endDate   = Promo.toDate(values['endDate'])
      const startDate = Promo.toDate(values['startDate'])
      const isValid   = !(endDate.isSameOrBefore(startDate))
      if(!isValid) {
        errors[field] = 'the endDate must come after the startDate'
      }
    }
    
    if(field == 'endDate' && rule.validForStartDate){
      if(values['startDate'] == null) return
      const endDate   = Promo.toDate(values['endDate'])
      const startDate = Promo.toDate(values['startDate'])
      const isValid   = !(endDate.isSameOrBefore(startDate))
      if(!isValid) {
        errors[field] = 'the endDate must come after the startDate'
      }
    }
    
  }
  return errors;
}

export const getValidator = (strategy, custom) => {
  const strategies = ![null,undefined].includes(strategy) 
    ? 
      (strategy.join ? strategy : [strategy])
      :
      ['default']
    ;

  let rules = getAllRules(strategies)
  Object.assign(rules, (custom || {}))
  
  return values => {
    let errors = {};
    for(let field in rules){
      let input = values[field]
      {
        // merge in the error for the field if it exists
        // {'name': 'can\'t be blank'} or {}
        Object.assign(errors, validateInput(input, field, rules[field], values))
      }
    }
    return errors;
  }
}
