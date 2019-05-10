import {CONTENT_BLOCK_CONTEXT, SEARCH_CONTEXT } from '../app'
import {FILTER_TYPES} from '../filters'
import Promo from '../../models/Promo'

// provide the contextual options to include for PromoTools
export const OPTIONS = [{
  icon: ['fa-pencil text-success'],
  name: 'edit'
},{
  icon: ['fa-clone'],
  name: 'clone'
},{
  icon: ['icon-copy-with-duration'],
  name: 'clone with duration'
},{
  icon: ['fa-trash text-danger'],
  name: 'delete'
}]

const is_clone_opt = /^clone/
export const OPTIONS_FOR_CONTEXT = {
  [CONTENT_BLOCK_CONTEXT] : OPTIONS.slice(0),
  [SEARCH_CONTEXT]        : OPTIONS.filter(o => !is_clone_opt.test(o.name))
}

// PromoTools component will render a disabled icon for any option
// that matches an entry below and that doesn't return truthy props for each item in list
export const OPTIONS_DISABLED_UNLESS = {
  'clone with duration' : ['startDate','endDate']
}

// generating new names when cloning
export const findMatchingNames = (list, promoName, regex) => {
  return  list.filter(p => {
    let nameFromList = p.name.replace(regex, "")
    return nameFromList === promoName
  })
}
export const getHighestCopyNumber = (matchingNames, regex) => {
  return matchingNames.map(p => {
    let match = p.name.match(regex)
    return match ? Number(match[1]) : 0
  }).reduce((prev, cur) => prev > cur ? prev : cur)
}


// add extra display properties for rendering the 'context' column
const sanitizePromo = (promo) => {
  const {contentBlock} = (promo || {})
  const {context}      = (contentBlock || {})
  return {
    ...promo, 
    'displayContentBlockName' : (contentBlock || {}).name,
    'displayContextName'      : (context || {}).name 
  } 
}

export const sanitizePromos = (json) => {
  return json.map(promo => sanitizePromo(promo))
} 

export const extractServerError = (action) => {
  const {payload}            = action
  const {response}           = payload
  const {status, statusText} = response
  const {fieldStatus}        = (response && response.data ? response.data : {})
  const {fieldErrorMap}      = (fieldStatus || {})
  
  const map = Object.keys(fieldErrorMap || {}).reduce((store,key)=>{
    if(fieldErrorMap[key]){ 
      // server response has capitalized fieldNames, deal w that
      const keyLowerCase  = key[0].toLowerCase() + key.substr(1)
      // errors are resturned as an array of objects like {code:xxx, message:'bad input'}
      // even though in most cases there is only one error.
      // we are just flattening the errors into a single html string in that case
      store[keyLowerCase] = fieldErrorMap[key].map(e => e.message).join('<br />')
    }
    return store
  }, {})

  return {
    status,
    statusText,
    message: status ? `${status} ${statusText}` : 'Unknown Error',
    map
  }  
}

// misc helper
const IS_DATE_FILTER_REGEX = /startDate|endDate/
const isDateFilter         = (filter) => IS_DATE_FILTER_REGEX.test(filter.type)

// generateCompositeFilter
// note - can see argunent for moving this to redux/filters
// create a new function that we can use to apply the filter to the list of promos
// we'll generate it by iterating over the list of filters, so the resulting function applies them all
export const generateCompositeFilter = (filterSetDirty) => {
    // by default the filter does nothing, just passing the promo through
  const noFilter  = (promo => promo)

  // collapse startDate + endDate into single filter if both are present
  const dateFilters        = filterSetDirty.filter(isDateFilter)
  const useStartAndEndDate = dateFilters.length == 2
  const filterSetClean     = !useStartAndEndDate ? 
    filterSetDirty.slice(0) : 
    filterSetDirty.filter(f => !isDateFilter(f)).concat({
      type:'startDateAndEndDate',
      value: (dateFilters.reduce((store,f) => {
        return {...store, [f.type]:f.value}
      },{}))
    })

  return filterSetClean.reduce((otherFilters, filterObj) => {
    
    const {type,value} = filterObj;
    
    // keep things tight for now...
    if(!FILTER_TYPES.includes(type)) {
      throw new Error(`Unsupported filter type passed to SET_FILTERS: '${type}'`)
    }

    // begin function definition
    return (promo) => {
      let newFilter;
      const p = Promo.fromAttributes(promo)
      
      switch(type){
        case 'startDate':
          newFilter = (promo => p.inWindowForStartDate(value));  break;

        case 'endDate':
          newFilter = (promo => p.inWindowForEndDate(value)); break;
      
        case 'startDateAndEndDate':
          newFilter = (promo => p.inWindowForStartAndEndDates(value)); break;
        
        case 'text':
          newFilter = (promo => p.textContains(value)); break;

        case 'id': // the only use-case for id filtering is debugging pagination x filters
          newFilter = (promo => `${promo.id}` == `${value}`); break;

        default:
          newFilter = noFilter
      }
      
      // apply the new filter, in addition to any others in state..
      return otherFilters(promo) && newFilter(promo)
      // END function
    }
  }, noFilter)
}