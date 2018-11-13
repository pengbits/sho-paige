import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { DateTimeWidget } from './Forms'

class FilterDateTime extends Component {

  render(){
    const {
      onChange,
      pristine,
      handleSubmit,
      filters,
      initialValues,
      type // startDate || endDate
    } = this.props;
 
    const placeholder = 'filter by '+(type.replace('Date',' date'))
    const dateTimeValue = Number(initialValues[type])
    return (
    <form className="filter__form filter__form--datetime" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      <DateTimeWidget 
        value={dateTimeValue} 
        inputProps={{placeholder: placeholder}}
        closeOnSelect={true}
        onChange={this.onChange.bind(this)}
        clearFilterField={this.clear.bind(this)}
      />
    </form>
    )
  }
  
  // on keypress
  onChange(datetime){
    this.props.updateDateTime({datetime})
  }
  
  // on return
  onSubmit(values){
    const {datetime} = values
    this.props.updateDateTime({datetime})
  }
  
  clear(e){
    e.preventDefault()

    const {type,unsetFilters} = this.props
    unsetFilters({type})
  }
}

export default reduxForm({
  form: 'datetime'
})(FilterDateTime)