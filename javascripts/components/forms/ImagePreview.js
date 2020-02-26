import React, { Component } from 'react';
import cn from 'classnames'
import $ from 'jquery'

class ImagePreview extends Component {
  render() {
    const {src, imagePathStatus, error} = this.props;
    const isValid = imagePathStatus == 200 && !error;

    return (
    <div className={`image-preview image-action ${isValid ? '' : 'image-preview--invalid'}`}>
      <span className='image-preview__icon image-action__icon fa fa-eye'>&nbsp;</span>
      {isValid && 
        <img className="image-preview__img" src={src}></img>
      }
    </div>

    )
  }

}
  

export default ImagePreview
