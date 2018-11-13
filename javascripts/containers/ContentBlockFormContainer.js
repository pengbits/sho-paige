import { connect } from 'react-redux';
import ContentBlockForm from '../components/ContentBlockForm';
import reducer, {
  setContentBlock,renameContentBlock,editContentBlock, cancelEditingContentBlock
} from '../redux/content-block'


const mapStateToProps = (state) => {
  const contentBlockEdit = state.contentBlock.isEditing
  const contentBlockName = state.contentBlock.name

  return {
    initialValues: {
      contentBlockName: contentBlockName
    },
    contentBlockEdit,
    contentBlockName
  }
}

const mapDispatchToProps = {
  setContentBlock, renameContentBlock, editContentBlock, cancelEditingContentBlock 
}

const ContentBlockContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentBlockForm)

export default ContentBlockContainer

