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
      status,
      displayContextName,
      displayContentBlockName,
      editorPath
    } = this.props

    const isHighlighted   = (id == highlighted)
    const ContextLink     = (displayContextName && editorPath) ? 'a' : 'span'
    
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
        {displayContextName &&
          <span className='promo-list__item__column promo-list__item__column--context'>
          <ContextLink className='promo-list__item__context-link' 
            href={editorPath}>
              <u className='promo-list__item__context-link__context'>{displayContextName}</u>
              <u className='promo-list__item__context-link__content-block'>{displayContentBlockName}</u>
          </ContextLink>
        </span>
        }
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