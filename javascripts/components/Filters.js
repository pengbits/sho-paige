import React, { Component } from 'react';
import FilterSearchBox from '../containers/FilterSearchBoxContainer'
import FilterDateTime from '../containers/FilterDateTimeContainer'
import propTypes from 'redux-form/lib/propTypes';

export default () => {
  const onBlur = (e,type) => {
    const el = e.currentTargets
  }
  
  return (<div className="filters">
    <div className='filter filter--start-date'>
      <FilterDateTime type='startDate' />
    </div>
    <div className='filter filter--end-date'>
      <FilterDateTime type='endDate' />
    </div>
    <div className='filter filter--search-term'>
      <FilterSearchBox />
    </div>
  </div>)
}