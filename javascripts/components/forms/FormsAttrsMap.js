
// put field-specific attributes for the input in here:
// the helper will map the attributes to the component with the following logic:
// 1) is there a match for the field name? (most specific)
// 2) is there a match for the inputType? (less specific)
// 3) is there a match for the dataType/primitive? (least specific)
// 4) is it required?

export const FormsAttrsMap = {
  'position' : {'size': '4'},
  // 'number'   : {'type': 'number'}, dont cast numbers to html5 number inputs yet
  'setDraftMode' : {'label':'Draft Mode'},
  'textArea' : {'rows': 5}
}

export const getAttrs = ({name,inputType,dataType,required}) => {
  // console.log('getAttrs' +JSON.stringify({name,inputType,dataType}))
  let attrs = {}
  
  if(dataType  && FormsAttrsMap[dataType]) {
    // console.log(`matching on dataType ${dataType}`)
    Object.assign(attrs, FormsAttrsMap[dataType])
  }
  
  if(inputType && FormsAttrsMap[inputType]) {
    // console.log(`matching on inputType ${inputType}`)
    Object.assign(attrs, FormsAttrsMap[inputType])
  }
  
  if(name && FormsAttrsMap[name]) {
    // console.log(`matching on name ${name}`)
    Object.assign(attrs, FormsAttrsMap[name])
  }
  
  if(required) {
    attrs.required = true
    attrs.placeholder = 'Required'
  }
  return attrs
}
