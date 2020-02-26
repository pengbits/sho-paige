import { connect, bindActionCreators } from 'react-redux';
import { 
  selectPromo,
  editPromo, 
  showDetails,
  clonePromo, 
  cloneWithDurationPromo, 
  setIsCopyingToContentBlock,
  deletePromo
} from '../redux/promos/actions'

import {
  getContexts
} from '../redux/content-blocks'

import {
  OPTIONS_FOR_CONTEXT,
  OPTIONS_DISABLED_UNLESS
} from '../redux/promos/utils'

import PromoTools from '../components/PromoTools';

const mapStateToProps = (state, ownProps) => {
  
  return {
    isEditing      : state.promos.isEditing,
    contentBlockId : state.contentBlock.id,
    options        : OPTIONS_FOR_CONTEXT[state.app.context].map(opt => {
      const requiredProps = OPTIONS_DISABLED_UNLESS[opt.name]
      const disabled      = requiredProps && requiredProps.find(k => !ownProps[k])
      return {disabled, ...opt}
    })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editPromo: function({id}){
      dispatch(selectPromo({id}))
      dispatch(editPromo({id}))
      dispatch(showDetails())
    },
    
    clonePromo: function({id,contentBlockId}){
      dispatch(clonePromo({id,contentBlockId}))
    },

    cloneWithDurationPromo: function({id,contentBlockId}){
      dispatch(clonePromo({id,contentBlockId}, {offsetDuration:true}))
    },
    
    // 'clone to section' is an alias of 'copy to content-block'
    cloneToSection: function({id,contentBlockId}){
      // todo: bundle these actions into a single dispatch call w/ middleware
      // also need a way to stash the selected promo by setting attrs similar to editPromo([])
      dispatch(selectPromo({id}))
      dispatch(setIsCopyingToContentBlock(true))
      dispatch(getContexts())
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
