import { connect, bindActionCreators } from 'react-redux';
import { setFilters, unsetFilters, FILTER_TYPES } from '../redux/filters'
import FilterDateTime from '../components/FilterDateTime';
import Promo from '../models/Promo'

const mapStateToProps = (state, ownProps) => {
  const {type} = ownProps
  const {filters} = state
  let props = {
    initialValues: {},
    type,
    filters
  }
  // find the relevant filter for this component: (type:startDate or endDate)
  const filter = (filters || []).find(f => f.type == type)
  // grab the state and pass it back through to the form
  const value  = filter ? filter.value : null
  // console.log(`|FilterDateTimeCntr| mapStateToProps ${type} value='${value}'`)
  props.initialValues[type] = value
  props[type] = value
  return props
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateDateTime: function({datetime}){
      const value = Promo.toTimestamp(datetime)
      const filter = {type:ownProps.type, value};
      dispatch(setFilters([filter]))
    },
    
    unsetFilters: function({type}){
      dispatch(unsetFilters({type}))
    }
  }
}

const FilterDateTimeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterDateTime)

export default FilterDateTimeContainer
