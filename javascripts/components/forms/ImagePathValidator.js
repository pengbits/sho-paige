import React, { Component } from 'react';
import cn from 'classnames'


class ImagePathValidator extends Component {
  render() {
    const {path,isValid} = this.props
    return (<div className={cn('image-validator', {'image-validator--success' : isValid})}>
      <span className='image-validator__status'>{isValid ? '√' : 'x'}</span>
    </div>)
  }
}

export default ImagePathValidator
