import { connect, bindActionCreators } from 'react-redux';
import {
  setContentBlock
} from '../redux/content-block'

import {
  setDestinationContext,
  setDestinationContentBlock
} from '../redux/content-blocks'

import {
  copyPromoToContentBlock,
  setIsCopyingToContentBlock
} from '../redux/promos/actions'

import ContentBlockBrowser from '../components/ContentBlockBrowser';

const mapStateToProps = (state) => {
  
  const {
    loading,
    contexts,
    selectedContext,
    selectedList
  } = state.contentBlocks
  
  return {
    loading,
    contexts,
    selectedContext,
    selectedList
  }
}

const mapDispatchToProps = function(dispatch){
  return {
    // todo - bundle + simplify ie w/ middleware
    // also.. are we certain the id is all we need, no contentBlockKey or simialr?
    selectContext: function(context){
      dispatch(setDestinationContext(context))
    },
    
    selectContentBlock: function(contentBlock){ 
      console.log(`selectContentBlock ${JSON.stringify(contentBlock)}`)
      dispatch(setDestinationContentBlock(contentBlock)) 
      dispatch(copyPromoToContentBlock(contentBlock))
    },
    
    cancelContentBlockSelection: function(){
      dispatch(setIsCopyingToContentBlock(false))
    }
  }
}

const ContentBlockBrowserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentBlockBrowser)

export default ContentBlockBrowserContainer
