import React, { Component } from 'react'
import PromoTools from '../containers/PromoToolsContainer'
import Promo from '../models/Promo'
class PromoListItem extends Component {

  render(){
    const {
      id,
      position,
      name,
      startDate,
      endDate,
      highlighted,
      status
    } = this.props
    
    const isHighlighted = (id == highlighted)
    
    return (
      <div className={`promo-list__item ${isHighlighted ? 'promo-list__item--highlighted' : ''}`}>
        <span className='promo-list__item__column promo-list__item__column--window' 
          data-schedule-status={status}
        >
          {status}
        </span>
        <span className='promo-list__item__column promo-list__item__column--position'>
          {position}
        </span>
        <span className='promo-list__item__column promo-list__item__column--name'>
          {name}
        </span>
        <span className='promo-list__item__column promo-list__item__column--start-date'>
          {startDate && Promo.toDateStr(startDate)}
        </span>
        <span className='promo-list__item__column promo-list__item__column--end-date'>
          {endDate && Promo.toDateStr(endDate)}
        </span>
        <span className='promo-list__item__column promo-list__item__column--tools'>
          <PromoTools 
            id={id} 
            startDate={startDate}
            endDate={endDate} 
          />
        </span>
      </div>
    )
  }
}
  
export default PromoListItem