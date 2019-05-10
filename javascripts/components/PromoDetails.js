import React, { Component } from 'react';
import PromoForm from '../containers/PromoFormContainer';
import PromoDetailsOutsideClick from "./PromoDetailsOutsideClick";

class PromoDetails extends Component {
  
  render(){
    const {
      detailsId
    } = this.props

    return  <PromoDetailsOutsideClick><PromoForm /> </PromoDetailsOutsideClick>
  }

}

export default PromoDetails