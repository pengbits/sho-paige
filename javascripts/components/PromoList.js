import React, { Component } from 'react'
import PromoListHead from '../containers/PromoListHeadContainer'
import PromoListItem from '../containers/PromoListItemContainer'
import PromoDetails from './PromoDetails'

class PromoList extends Component {
  
  componentWillMount() {
    this.props.getPromos()
  }
  
  render(){

    return !this.props.error ?
      this.renderList() :
      this.renderErrorType()
  }
  
  renderErrorType(){
    if (this.props.error.errorType == 'Warning') {
      return this.renderWarning()
      }
    else {
      return this.renderError()
    }
  }

  renderWarning () {
    return (
    <div className='warning'>
      <p className='warning__message'>{this.props.error.message}</p>
    </div>)
  }

  renderError () {
    return (
    <div className='error'>
      <h2 className='error__header'>Error</h2>
      <p className='error__message'>{this.props.error.message}</p>
    </div>)
  }

  renderList(){
    return (
      <div className="promo-list">
        <PromoListHead />        
        {this.props.loading && this.spinner()}
        {this.getItems()}
      </div >
    )
  }
  
  spinner(){
    return (<span className="promo-list__spinner fa fa-spinner fa-spin fa-fw"></span>)
  }
  
  getItems(){
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
}

export default PromoList