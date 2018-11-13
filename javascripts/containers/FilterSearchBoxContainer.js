import { connect, bindActionCreators } from 'react-redux';
import { setFilters, unsetFilters, FILTER_TYPES } from '../redux/filters'
import FilterSearchBox from '../components/FilterSearchBox';

const SEARCHBOX_FILTER_TYPE = 'text'

const mapStateToProps = (state) => {
  // find the relevant filter for this component: (title)
  const filter = (state.filters || []).find(f => f.type == SEARCHBOX_FILTER_TYPE)
  // grab the state and pass it back through to the form
  const search = filter ? filter.value : null
  return {
    initialValues: {
      search
    },
    search
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  
  return {
    updateSearchTerm: function({search}){
      const filters = [{
        type: SEARCHBOX_FILTER_TYPE, 
        value: search
      }]

      dispatch(setFilters(filters))
    },
    
    unsetFilters: function(){
      dispatch(unsetFilters({
        type:SEARCHBOX_FILTER_TYPE
      }))
    } 
  }
}

const FilterSearchBoxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSearchBox)

export default FilterSearchBoxContainer
