import Promo  from '../models/Promo'

export const rules = {
  'name'         : {'required':true, 'maxLength':200},
  'title'        : {'required':true, 'maxLength':200},
  'position'     : {'isNumber':true, 'minValue':0, 'maxValue':1000},
  'endDate'      : {'validForStartDate': true },
  'seriesId'     : {'isNumber':true },
  'showId'       : {'isNumber':true },
  'seasonNumber' : {'isNumber':true }
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
      errors[field] = `${field} can't be longer than ${rule.maxLength} characters, which includes invisible formatting characters.`;
    }
    if(rule.forbidden && rule.forbidden.test(input)){
      errors[field] = `${field} contains forbidden characters`
    }
    if(rule.isNumber){
      const inputNumber = Number(input)
      if(isNaN(inputNumber)) {
        errors[field] = `${field} must be a number`
      } else if(inputNumber.toFixed(0) !== input.toString()){
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
    if(field == 'endDate' && rule.validForStartDate){
      const endDate   = Promo.toDate(input)
      const startDate = Promo.toDate(values['startDate'])
      const isValid   = !(endDate.isSameOrBefore(startDate))
      if(!isValid) {
        errors[field] = 'the endDate must come after the startDate'
      }
    }
  }
  return errors;
}

export const getValidator = (type) => {
  return values => {
    let errors = {};
    for(let field in rules){
      let input = values[field]
      {
        // merge in {'name': 'can\'t be blank'} or {}
        Object.assign(errors, validateInput(input, field, rules[field], values))
      }
    }
    // if(Object.keys(errors).length){
    //   console.log(`|validation| found errors: ${JSON.stringify(errors)}`)
    // } else {
    //   console.log(`|validation| no errors`)
    // }
    return errors;
  }
}
