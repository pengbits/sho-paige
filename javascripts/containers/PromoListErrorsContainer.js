import { connect } from 'react-redux';
import PromoListErrors from '../components/PromoListErrors';
import { newPromo } from '../redux/promos/actions'
import {
  NO_SEARCH_RESULTS_MESSAGE, 
  NO_FILTERED_SEARCH_RESULTS_MESSAGE, 
  NO_FILTERED_PROMOS_CONTENT_BLOCK_MESSAGE, 
  NO_PROMOS_IN_CONTENT_BLOCK_MESSAGE
} from '../redux/promos/constants'


const mapStateToProps = (state) => {
  const {
    filters,
    app
  } = state

  const {
    isSearchContext
  } = app

  const hasFilters = filters.length
  const message = (
    isSearchContext ?
      (hasFilters ? 
        NO_FILTERED_SEARCH_RESULTS_MESSAGE : 
        NO_SEARCH_RESULTS_MESSAGE
      )
      :
      (hasFilters ? 
        NO_FILTERED_PROMOS_CONTENT_BLOCK_MESSAGE : 
        NO_PROMOS_IN_CONTENT_BLOCK_MESSAGE
      )
    )
  ;
  
  return {
    message
  }
}

const mapDispatchToProps = { newPromo }

const PromoListErrorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoListErrors)

export default PromoListErrorsContainer
