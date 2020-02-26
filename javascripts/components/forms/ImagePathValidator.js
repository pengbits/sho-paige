import React, { Component } from 'react';
import cn from 'classnames'


class ImagePathValidator extends Component {
  render() {
    const {imagePathStatus, error} = this.props
    const isPending  = imagePathStatus == 'PENDING'
    const isValid    = !isPending && !error && imagePathStatus == 200
    const isInvalid  = !isPending && !isValid
    
    return (<div className={cn([
        'image-validator', 
        'image-attr',
      { 'image-validator--success' : isValid},
      { 'image-validator--failure' : isInvalid}
    ])}>
      <span className='image-validator__status image-attr__icon'>{
          this.getSymbol({
            isPending,
            isValid,
            isInvalid
          })
      }</span>
    </div>)
  }
  
  getSymbol(state){
    if(state.isValid)    return '√'
    if(state.isInvalid)  return 'x'
    if(state.isPending)  return null
    return null
  }
}

export default ImagePathValidator
