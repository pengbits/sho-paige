import React, { Component } from 'react';
import PromoForm from '../containers/PromoFormContainer'

class PromoDetails extends Component {
  
  render(){
    const {
      detailsId
    } = this.props

    return <PromoForm />
  }

}

export default PromoDetails