import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'

class FilterSearchBox extends Component {
  
  render(){
    const {
      onChange,
      pristine,
      handleSubmit,
      search
    } = this.props;
    return (
    <form className="filter__form filter__form--search-term "  onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      <Field 
        component='input' 
        className={'filter__input form-control form-control--search-term' + (this.props.search ? ' filter__input--show-icon' : "")}
        name='search' 
        placeholder="Text"
        onChange={this.onChange.bind(this)}
      />
      {!!search && <button 
        className='filter__cancel' 
        type="button"
        onClick={this.clear.bind(this)}>
          &#215;
      </button>}
    </form>
    )
  }
  
  // on keypress
  onChange(e, search){
    this.props.updateSearchTerm({search})
  }
  
  // on return
  onSubmit(values){
    const {search} = values
    this.props.updateSearchTerm({search})
  }
  
  clear(e){
    e.preventDefault()
    this.props.unsetFilters({type:'text'})
  }
}

export default reduxForm({
  form: 'search'
})(FilterSearchBox)