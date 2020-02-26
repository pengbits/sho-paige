import { connect, bindActionCreators } from 'react-redux';
import {getPromos} from '../redux/promos/actions'
import {setCurrentSelectedPageNumber} from '../redux/pagination'
import PromoList from '../components/PromoList';

const mapStateToProps = (state) => {
  
  const {
    filters,
    app
  } = state
  
  const {
    isSearchContext,
    isContentBlockContext
  } = app
  
  const {
    loading,
    error,
    list,
    filtered,
    filteredPaginated,
    paginatedList,
    isEditing,
    detailsVisible,
    details,
    highlighted,
    selected,
    isCopyingToContentBlock // in the middle of copying a promo to content-block
  } = state.promos || {}
  
  const {
    query
  } = state.search
  
  const {
    currentSelectedPage, 
    currentResponsePage, 
    responseSize,
    shouldPaginate
  } = state.pagination

  const DETAILS_PLACEHOLDER = {isDetails:true}
  const isTheEditedPromo = (p => {
    // console.log(`isEdited? ${p.id} ${selected} ${selected == p.id ? '√' : ''}`)
    return detailsVisible && (selected == p.id)
  })
  const isNew  = details.id == undefined
  const length = isNew? 0 : 1
  
  let index=0
  let displayList = []
  let filteredSource
  let listSource

  if(!filters.length) {
    // console.log(`filters x ${shouldPaginate ? 'paginated √':''}`)
    
    displayList = (shouldPaginate ? 
      paginatedList : list
    ).slice(0)
    
    if(detailsVisible){
      displayList.map((p,i) => {
        if(p.id == details.id) index = i
      })
      displayList.splice(index, length, DETAILS_PLACEHOLDER)
    }
  } else {
    // console.log(`filters √ ${shouldPaginate ? 'paginated √':''}`);
    filteredSource = (shouldPaginate ? filteredPaginated : filtered)
    listSource     = (shouldPaginate ? paginatedList : list)
    
    // always insert form to top of list if we are adding
    if(detailsVisible && isNew){
      displayList.push(DETAILS_PLACEHOLDER)
    }
    
    listSource.map((p,i) => {
      let isEditedPromo = isTheEditedPromo(p)
      if(filteredSource.find(promo => promo.id == p.id)){
        // iterating over master list to preserve order,
        // but only items that match filters or are being edited should be added to display list
        // console.log(`${p.id} is a match for filters ${isEditedPromo ? 'DETAILS':''}`)
        displayList.push(isEditedPromo ? DETAILS_PLACEHOLDER : p)
      } 
      else {
        if(isEditedPromo){
          // promo is not a match for filters, but force-add to list if being edited
          // console.log(`${p.id} is not a match, isEdited, force-add to list`)
          displayList.push(DETAILS_PLACEHOLDER)
        } else {
          // console.log(`${p.id} is not a match`)
        }
      }
    })
    
    // console.log('')
  }
  
  
  return {
    loading,
    error,
    displayList,
    hasFilters: filters.length,
    isEditing,
    detailsVisible,
    detailsId: details.id,
    highlighted,
    query,
    currentSelectedPage,
    shouldPaginate,
    paginatedList,
    currentResponsePage,
    responseSize,
    isSearchContext,
    isContentBlockContext,
    isCopyingToContentBlock
  }
}

const mapDispatchToProps = {
  getPromos,
  setCurrentSelectedPageNumber
}

const PromoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoList)

export default PromoListContainer
