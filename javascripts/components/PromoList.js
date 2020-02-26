import React, { Component } from 'react'
import $ from 'jquery'
import cn from 'classnames'
import PromoListHead from '../containers/PromoListHeadContainer'
import PromoListItem from '../containers/PromoListItemContainer'
import PromoListErrors from '../containers/PromoListErrorsContainer'
import PromoDetails from './PromoDetails'
import Pagination from "react-js-pagination";
import ContentBlockBrowser from '../containers/ContentBlockBrowserContainer'
import {ITEMS_PER_PAGE_CLIENT} from '../redux/pagination'

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
      displayList,
      shouldPaginate,
    } = this.props

    if(!loading && displayList.length == 0){
      return (
        <div className='promo-list promo-list--empty'>
          <PromoListErrors />
          {shouldPaginate && this.renderPagination()}
        </div> 
      )
    } 
    else {
      return this.renderList()
    }
  }
  
  renderList(){
    const {
      loading,
      isSearchContext,
      isContentBlockContext,
      shouldPaginate,
      isCopyingToContentBlock
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
        {shouldPaginate          ? this.renderPagination() : null}
        {isCopyingToContentBlock ? this.renderContentBlockBrowser() : this.pin(false)}
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
  
  renderContentBlockBrowser(){
    this.pin(true)  
    return <ContentBlockBrowser />
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
    return (
      <div className="loading-state">
        <span className="loading-state__spinner fa fa-spinner fa-spin fa-fw"></span>
      </div>
    )
  }

  renderError () {
    return (
      <div className='error'>
        <h2 className='error__header'>Error</h2>
        <p className='error__message'>{this.props.error.message}</p>
      </div>
    )
  }
  
  pin(onoff){
    $('html').toggleClass('has-modal', onoff)
  }
}

export default PromoList