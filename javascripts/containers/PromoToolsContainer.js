import { connect, bindActionCreators } from 'react-redux';
import { 
  showDetails,
  editPromo, 
  clonePromo, 
  cloneWithDurationPromo, 
  deletePromo,
  OPTIONS_FOR_CONTEXT
} from '../redux/promos'

import PromoTools from '../components/PromoTools';

const mapStateToProps = (state) => {
  return {
    isEditing      : state.promos.isEditing,
    options        : OPTIONS_FOR_CONTEXT[state.app.context],
    contentBlockId : state.contentBlock.id
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editPromo: function({id}){
      dispatch(editPromo({id}))
      dispatch(showDetails())
    },
    
    clonePromo: function({id,contentBlockId}){
      dispatch(clonePromo({id,contentBlockId}))
    },

    cloneWithDurationPromo: function({id,contentBlockId}){
      dispatch(clonePromo({id,contentBlockId}, {offsetDuration:true}))
    },
    
    deletePromo: function({id}){
      dispatch(deletePromo({id})) // deletePromo({id}) would be more consistent
    }
  }
}

const PromoToolsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoTools)

export default PromoToolsContainer
