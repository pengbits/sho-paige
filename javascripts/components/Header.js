import React, { Component } from 'react';
import Filters from '../containers/FiltersContainer';
import ContentBlockForm from '../containers/ContentBlockFormContainer'
import { CONTENT_BLOCK_CONTEXT, SEARCH_CONTEXT } from '../redux/app'

class Header extends Component {

  render() {
    const {addPromo,context} = this.props
    const isContentBlock = context == CONTENT_BLOCK_CONTEXT
    
    return (
      <section className="paige-app__header">
        {isContentBlock && <ContentBlockForm/>}
        <Filters />
        {' '}
        {isContentBlock && <button 
          className='btn btn-success paige-app__add-promo-btn' 
          onClick={(e) => {addPromo()}}
          >+Add Promo
        </button>}
      </section>
    )
  }
}

export default Header
