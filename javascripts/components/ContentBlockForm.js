import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'

class ContentBlockForm extends Component {
  
  render(){
    const {
      onChange,
      pristine,
      contentBlockName,
      contentBlockEdit,
      initialValues
    } = this.props;

    if(contentBlockEdit){
      return this.renderForm()
    } else {
      return this.renderReadOnlyForm()
    }
  }

  renderReadOnlyForm (){ 
    return (
      <div className="content-block">
        <div className = "content-block__header">
          <h3 className="content-block__header--name">{this.props.contentBlockName}</h3>
          <a href="#" name="edit" onClick={this.editContentBlock.bind(this)} data-action="" className="content-block__header__action--edit"><span className="fa fa-pencil text-success"></span></a>
        </div>
      </div>) 
  }

  renderForm() {
    const {handleSubmit} = this.props
    return (      
      <div className="content-block">
       <form className="content-block__form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field 
            component='input' 
            className='content-block__form__input' 
            name='contentBlockName' 
          />
          <button className='btn btn-primary content-block__form__btn' type="submit"> 
            Save
          </button>
          {<button 
            className='content-block__form__cancel' 
            onClick={this.cancel.bind(this)}>
              x
          </button>}
        </form>
      </div >
    )
  }

  editContentBlock(e) {
    e.preventDefault()
    this.props.editContentBlock()
  }
  
  // on return
  onSubmit(attrs){
    const {contentBlockName} = attrs
    this.props.renameContentBlock({'name': contentBlockName})
  }
  
  cancel(e){
    e.preventDefault()
    this.props.reset();
    this.props.cancelEditingContentBlock()
  }
}

export default reduxForm({
  form: 'contentBlock'
})(ContentBlockForm)