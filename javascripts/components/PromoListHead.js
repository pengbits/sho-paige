import React, { Component } from 'react';
import {hyphenize,camelize} from '../utils/string'
import cn from 'classnames'
import $ from 'jquery'

const COLUMNS_FOR_SEARCH        = ['window','position','context','name', 'start-date', 'end-date', 'tools']
const COLUMNS_FOR_CONTENT_BLOCK = ['window','position',          'name', 'start-date', 'end-date', 'tools'] 

class PromoListHead extends Component {
  render(){
    const {
      currentSortType,
      currentSortDirection,
      isAscending,
      isSearchContext
    } = this.props
    
    const promoListHeadArray = isSearchContext ? 
      COLUMNS_FOR_SEARCH : COLUMNS_FOR_CONTENT_BLOCK;

    return (
      <div className='promo-list__item promo-list__item--head' 
        onClick={this.onColumnClick.bind(this)}
      >
      
      {promoListHeadArray.map(name => { 
        return this.renderColumn({
          isShim : /window|tools/.test(name),
          active : camelize(name) == currentSortType,
          icon   : isAscending ? 'up' : 'down',
          name
        })
      })}  
    </div>)
  }
  
  renderColumn({name,active,isShim,icon}){
    return (
      <span 
        key={name}
        data-sort-type={!isShim ? name : ''}
        className={cn(
            'promo-list__item__column',
            'promo-list__item__column--' + name,
            'promo-list__item__column--header',
          { 'promo-list__item__column--active' : active })
        }>
        {!isShim && name.replace('-',' ').toUpperCase() }
        {!isShim && active && <i className={cn(
          'promo-list__item__sort-direction-icon',
          'fa',
          'fa-icon',
          `fa-angle-${icon}`)
        }></i>}
      </span>
    )
  }
  
  onColumnClick(e){
    e.preventDefault()
    e.stopPropagation()
    
    let el
    const klass = 'promo-list__item__column';
    
    if($(e.target).hasClass(klass)){
      el = e.target
    } else {
      el = $(e.target).parent(`.${klass}`).get(0)
    }
    
    const {sortType} = el.dataset
    sortType && this.setSort(camelize(sortType)) // 'start date' => 'startDate'
  }
  
  setSort(type){
    const {
      setSort,
      toggleSortDirection,
      currentSortType,
      currentSortDirection
    } = this.props
    
    if(type == currentSortType){
      toggleSortDirection()
    } else {
      setSort({type})
    }
  }
}

export default PromoListHead