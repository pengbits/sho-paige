import { connect } from 'react-redux';
import { 
  setSort, 
  toggleSortDirection, 
  SORT_DIRECTION_ASC
} from '../redux/sort'

import PromoListHead from '../components/PromoListHead';

const mapStateToProps = (state) => {
  const {type,direction} = state.sort
  return {
    currentSortType : type,
    currentSortDirection : direction,
    isAscending : (direction == SORT_DIRECTION_ASC)
  }
}

const mapDispatchToProps = {
  setSort,
  toggleSortDirection
}

const PromoListHeadContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoListHead)

export default PromoListHeadContainer
