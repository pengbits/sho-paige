import React, { Component } from 'react';

/** Component that warns the user when trying to navigate away from a Promo Edit **/
export default class PromoDetailsOutsideClick extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /* Set the reference for the wrapper */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /* A confirm message is shown if user attempts to navigate away from Promo Edit */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && event.target.href) {
      if (!confirm("Are you sure you want to navigate from this Promotion? Your changes will not be saved")) {
        return false;
      } 
      else {
        window.location.href = event.target.href;
      }
    }
  }

  render() {
    return <div ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

