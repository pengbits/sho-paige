import { connect } from 'react-redux';
import Filters from '../components/Filters';
import { setFilters } from '../redux/filters';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  setFilters
}

const FiltersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters)

export default FiltersContainer
