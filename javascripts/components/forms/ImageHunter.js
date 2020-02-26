import React, { Component } from 'react';
import cn from 'classnames'
import $ from 'jquery'

class ImageHunter extends Component {
  componentWillMount() {
    this.onClick = this.onClick.bind(this)
    if(!this.props.initialized){
      if(!this.props.dependencies){
        this.props.hunterConfirmDeps()
      }
      
      this.props.hunterInitHunter({
        origin: window.location.origin
      })
    }
  }
  
  componentWillUnmount(){
    this.props.hunterQuitHunter()
  }
  
  render() {
    const {error,loading} = this.props
    return (
      <div className={cn('image-hunter image-action', {
          'image-hunter--loading' : loading,
          'image-hunter--error'   : error
        })}
        onClick={this.onClick}
      >
        <span className='image-hunter__icon image-action__icon fa fa-search'>&nbsp;</span>
      </div>
    )
  }
  
  onClick(e){
    e.preventDefault()
    const {
      error, 
      hunterRequestSearch,
      seriesId,
      name
    } = this.props
    
    const showError = function(e){
      alert('Error: '+e)
    }
    
    if(!error) {
      hunterRequestSearch({seriesId},{name})
    }
    else {
      alert('Error: '+e)
    }
  }
}
  

export default ImageHunter
