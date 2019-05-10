// some of these helper functions are not bona-fide selectors in the redux sense,
// but they do return state objects, often after peforming some calculations
import {ITEMS_PER_PAGE_CLIENT} from '../pagination'

// this assumes that pageNumber (client page) is NEVER 0
// since that would evaluate as false and we'd return the full list
export const promosForSelectedPage = (state, pageNumber) => {
  if([null,undefined].includes(pageNumber)) return state.slice(0)
  if(pageNumber == 0) throw new Error('promosForSelectedPage() pageNumber can never be zero')
  const rangeHigh = (pageNumber * ITEMS_PER_PAGE_CLIENT)-1
  const rangeLow  = ((pageNumber-1) * ITEMS_PER_PAGE_CLIENT)
  // console.log(`|promos| promosForSp [from ${state.length} items] page=${pageNumber} show range ${rangeLow},${rangeHigh}`)
  return state.slice(rangeLow,(rangeHigh+1))
}

export const sortedPromos = ({state, attr, direction, kind}) => {
  const sorted = state.sort((a,b) => {
    // if it's a number we have to cast it from string before comparing

    const alpha = kind == 'number' ? Number(a[attr]) : a[attr]
    const beta  = kind == 'number' ? Number(b[attr]) : b[attr]
    // peform the sort. if a is less than b, return -1; if b is greater than a, return 1; if equal, return 0
    const sort  = alpha == beta ? 0 : (
      alpha < beta ? -1 : 1
    )
    // console.log(`${alpha} <> ${beta} ${sort}`)
    return sort
  })
  
  // descending order can be achieved with array#reverse
  // console.log(`sortedPromos ${attr} dir=${direction}`)
  return (direction == 'descending') ? 
    sorted.slice(0).reverse() : sorted
  ;
}

export const updatePromoInList = (list, promo) => {
  return (list || []).map(p => {
    if(p.id == promo.id){
      // don't overwrite these phony properties
      const {displayContextName,displayContentBlockName} = p
      return {...promo, displayContextName, displayContentBlockName}
    } else {
      return p 
    }
  })
}