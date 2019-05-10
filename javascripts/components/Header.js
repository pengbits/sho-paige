import React, { Component } from 'react';
import Filters from '../containers/FiltersContainer';
import ContentBlockForm from '../containers/ContentBlockFormContainer'
import { CONTENT_BLOCK_CONTEXT, SEARCH_CONTEXT } from '../redux/app'

class Header extends Component {

  render() {
    const isContentBlock = (this.props.context == CONTENT_BLOCK_CONTEXT)
    
    return (
      <section className="paige-app__header">
        {isContentBlock && <ContentBlockForm/>}
        <div className="paige-app__header--inner">
          <Filters />
          {' '}
          {isContentBlock && <button 
            className='btn btn-success paige-app__add-promo-btn' 
            onClick={(e) => {this.onAddPromoButtonClick()}}
            >+ Add Promo
          </button>}
        </div>
      </section>
    )
  }
  
  onAddPromoButtonClick(e){
    const {addPromo,isEditing} = this.props
    if(!isEditing || confirm("Are you sure you want to add a new Promotion? Your changes will not be saved")) {
      addPromo()
    }
  }
}

export default Header
