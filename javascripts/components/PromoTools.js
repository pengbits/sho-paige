import React, { Component } from 'react';
import $ from 'jquery'
import {camelize,hyphenize} from '../utils/string'
import cn from 'classnames'

class PromoTools extends Component {

  render(){
    return (<span className='promo-tools'>{
      this.props.options.map(this.renderOption.bind(this))
    }
    </span>)
  }
    
  renderOption({name,icon,disabled}){
    // <a onClick={onClick} href="#" data-action='editPromo' name='edit' className="promo-tools__action promo-tools__action--edit"> 
    //   <span className="fa fa-pencil text-success"></span>
    // </a>
    // console.log(`${name} disabled:${disabled}`)
    return (<a 
      key={name}
      href="#"
      name={name} 
      title={name} 
      data-action={!disabled ? camelize(name) : ''}
      onClick={this.onClick.bind(this)} 
      className={cn(
        'promo-tools__action',
        'promo-tools__action--' + hyphenize(name),
      { 'promo-tools__action--disabled' : disabled } 
      )}>
      {icon.map(i => <span className={`fa ${i}`} key={i}></span>)}
    </a>)
  }

  onClick(e){
    e.preventDefault()
    e.stopPropagation()
    
    const el = e.currentTarget
    const {id, contentBlockId, isEditing} = this.props
    const attrs = {id,contentBlockId}

    switch(el.dataset.action){
      case 'edit':
        if(!isEditing || confirm("Are you sure you want to start editing another Promotion? Your changes will not be saved")) {
          this.props.editPromo(attrs)
        }
        break
        
      case 'clone':
        if(!isEditing || confirm("Are you sure you want to clone another Promotion? Your changes will not be saved")) {
          this.props.clonePromo(attrs)
        }
        break
        
      case 'cloneWithDuration':
        if(!isEditing || confirm("Are you sure you want to clone another Promotion? Your changes will not be saved")) {
          this.props.cloneWithDurationPromo(attrs)
        }
        break
    
      case 'cloneToSection':
        if(!isEditing || confirm("Are you sure you want to copy a Promotion to another content-block while editing a Promotion? Your changes will not be saved")) {
          this.props.cloneToSection(attrs)
        }
        break
      
      case 'delete':
        if(confirm("Are you sure you want to delete this promo? This cannot be undone.")) {
          this.props.deletePromo(attrs);
        } 
        break

    }
  }

} 

export default PromoTools