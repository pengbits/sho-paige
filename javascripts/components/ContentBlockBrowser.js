import React, { Component } from 'react';
import cn from 'classnames'

class ContentBlockBrowser extends Component {
  
  componentWillMount(){
    this.renderContextItem           = this.renderContextItem.bind(this)
    this.renderContentBlockItem      = this.renderContentBlockItem.bind(this)
    this.selectContentBlock          = this.selectContentBlock.bind(this)
    this.selectContext               = this.selectContext.bind(this)
    this.cancelContentBlockSelection = this.cancelContentBlockSelection.bind(this)
  }
  
  render(){
    return (
      <div className='content-block-browser'>
        <div className='content-block-browser__inner'>
          <div className='content-block-browser__head'>
            <h4 className='content-block-browser__title'>
              Please choose a destination:
            </h4>
            <span className='fa fa-times-circle content-block-browser__closer'
              onClick={this.cancelContentBlockSelection}></span>
          </div>
          {this.props.loading ? this.renderLoading() : this.renderColumns()}
        </div>
      </div>
    )
  }
  
  renderLoading(){
    return (
    <div className='content-block-browser__body'>
      <div className="loading-state">
        <span className="loading-state__spinner fa fa-spinner fa-spin fa-fw"></span>
    </div>
  </div>
  )
  }
  
  renderColumns(){
    const {
      contexts,
      selectedContext,
      selectedList
    } = this.props
    
    return (
      <div className='content-block-browser__body'>
        <div className='content-block-browser__primary'>
          <ul className='content-block-browser__list'>
            {contexts.map(this.renderContextItem)}
          </ul>
        </div>
        <div className='content-block-browser__secondary'>
          {selectedContext ?
            <ul className='content-block-browser__list'>
              {selectedList.map(this.renderContentBlockItem)}
            </ul>
          :
            null
          }
        </div>
      </div>
    )
  }
  
  renderContextItem(item){
    const isActive   = (item.id == this.props.selectedContext)
    return (<li 
      className={cn(
          'content-block-browser__list__item',
        { 'content-block-browser__list__item--active' : isActive })}
      onClick={this.selectContext}
      data-id={item.id}
      key={item.id}>
        {item.name}
      </li>
    )
  }
  
  renderContentBlockItem(item){
    return (<li className={cn(
        'content-block-browser__list__item', 
      { 'content-block-browser__list__item--invalid' : item.editorPath == undefined })}
      onClick={this.selectContentBlock}
      data-id={item.id}
      data-editor-path={item.editorPath}
      key={item.id}>
        {item.name}
      </li>
    )
  }
  
  selectContext(e){
    const {
      id
    } = e.currentTarget.dataset
    
    this.props.selectContext({
      id
    })
  }
  
  selectContentBlock(e){
    const {
      id,
      editorPath
    } = e.currentTarget.dataset

    if(editorPath){
      this.props.selectContentBlock({
        id,
        editorPath
      })
    }
    else {
      alert('this content-block can\'t be used as a destination, it does not have an editor-path')
    }
  }
  
  cancelContentBlockSelection(e){
    this.props.cancelContentBlockSelection()
  }
}

export default ContentBlockBrowser