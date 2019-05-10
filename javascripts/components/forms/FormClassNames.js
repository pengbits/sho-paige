import {
  camelize,
  hyphenize,
  humanize
} from '../../utils/string'

const input_classname_base = 'promo-form__input'

export const getClassNames = (attrs) => {
  const {
    name,
    inputType,
    dataType,
    meta
  } = attrs
  
  let classNames = [input_classname_base]

  
  if(inputType) {
    addModifier(classNames, inputType)
  }
  
  if(dataType) {
    addModifier(classNames, dataType)
  }
  
  if(name){
    addModifier(classNames, name)
  }
  
  if(meta && meta.touched && meta.error) {
    addModifier(classNames, 'error')
  }
  
  return classNames.join(' ')
}


const addModifier = (classNames, key) => {
  const modifier = getModifier(key)
  if(classNames.includes(modifier)) {
    return
  } else {
    classNames.push(modifier)
  }
}

const getModifier = (key) => {
  return input_classname_base + '--' + hyphenize(humanize(key))
}
