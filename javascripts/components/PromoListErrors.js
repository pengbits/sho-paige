import React, { Component } from 'react'

const NEW_PROMO_MARKUP = '[add one]'
const NEW_PROMO_LABEL  =  'add one'

class PromoListErrors extends Component {

  render(){
    return this.toHTML(this.props.message)
  }
  
  toHTML(text){
    if(text.indexOf(NEW_PROMO_MARKUP) > -1) {
      const [beforeText,afterText] = text.split(NEW_PROMO_MARKUP)
      return <span>
        {beforeText}
        <a onClick={this.props.newPromo}>{NEW_PROMO_LABEL}</a>
        {afterText}
      </span>
    }
    
    return text
  }
}
  
export default PromoListErrors
