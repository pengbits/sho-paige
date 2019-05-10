import React, { Component } from 'react'
import cn from 'classnames'
import PromoListHead from '../containers/PromoListHeadContainer'
import PromoListItem from '../containers/PromoListItemContainer'
import PromoDetails from './PromoDetails'
import Pagination from "react-js-pagination";
import {ITEMS_PER_PAGE_CLIENT} from '../redux/pagination'
import {NO_SEARCH_RESULTS_MESSAGE, NO_FILTERED_SEARCH_RESULTS_MESSAGE} from '../redux/promos/constants'

class PromoList extends Component {
  componentWillMount() {
    this.onPageNumberClick = this.onPageNumberClick.bind(this)
    this.props.getPromos(this.props.currentResponsePage)
  }

  render(){
    return !this.props.error ?
      this.renderBody() :
      this.renderError()
  }
  
  renderBody() {
    const {
      loading,
      isSearchContext,
      displayList,
      shouldPaginate,
      hasFilters
    } = this.props
    
    if(!loading && isSearchContext && displayList.length == 0){
      return (
        <div className='promo-list promo-list--empty'>
          <p>{shouldPaginate && hasFilters ? NO_FILTERED_SEARCH_RESULTS_MESSAGE : NO_SEARCH_RESULTS_MESSAGE}</p>
          {shouldPaginate && this.renderPagination()}
        </div>
      )
    } else {
      return this.renderList()
    }
  }
  
  renderList(){
    const {
      loading,
      isSearchContext,
      isContentBlockContext,
      shouldPaginate
    } = this.props
    
    return (
      <div className={cn(
          'promo-list',
        { 'promo-list--search-context' : isSearchContext },
        { 'promo-list--content-block-context' : isContentBlockContext }
      )}>
        <div className='promo-list__items'>
          <PromoListHead  />        
          {loading && this.spinner()}
          {this.renderItems()}
        </div>
        {shouldPaginate && this.renderPagination()}
      </div >
    )
  }
  
  renderItems(){
    const {
      displayList,
      detailsId,
      highlighted
    } = this.props

    return displayList.map((p,i) => (
      p.isDetails ?
        <div className='promo-list__item promo-list__item--is-editing' key={i}>
          <PromoDetails detailsId={detailsId} />
        </div>
        :
        <PromoListItem key={i} {...p} highlighted={highlighted}/>
      )
    )
  }
  renderPagination(){
    const {
      currentSelectedPage,
      responseSize 
    } = this.props
    
    
    return (<Pagination
      activePage={currentSelectedPage}
      itemsCountPerPage={ITEMS_PER_PAGE_CLIENT}
      totalItemsCount={responseSize}
      pageRangeDisplayed={5}
      onChange={this.onPageNumberClick}
    />)
  }
  
  onPageNumberClick(n){
    const {
      setCurrentSelectedPageNumber, 
      isEditing
    } = this.props
    
    if(!isEditing || confirm('Are you sure you want to change pages? Your changes will not be saved')){
      setCurrentSelectedPageNumber(n)
    }
  }
  
  spinner(){
    return (<span className="promo-list__spinner fa fa-spinner fa-spin fa-fw"></span>)
  }

  renderError () {
    return (
      <div className='error'>
        <h2 className='error__header'>Error</h2>
        <p className='error__message'>{this.props.error.message}</p>
      </div>
    )
  }

}

export default PromoList