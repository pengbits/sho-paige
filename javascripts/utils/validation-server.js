import {camelize} from '../utils/string'

const BEGINS_WITH_FIELD_NAME = /^(.+)\s(field|can\sonly)/

export const fieldnamesContainedInErrorMessages = (list, attrs={}) => {
  return list.reduce((memo,e) => {
    if(BEGINS_WITH_FIELD_NAME.test(e.message)){
      // extract a field name from space-deliminated human english in response

      const fragment  = BEGINS_WITH_FIELD_NAME.exec(e.message)[1] || ''
      const fieldName = fragment[0].toLowerCase() + camelize(fragment.substr(1).replace(/ID$/,'Id'))
      // does the field name match any attributes we sent over

      //if(attrs[fieldName] !== undefined){
        // add it to the errors object
        memo[fieldName] = e.message
      //}
    }
    return memo
  }, {})
}