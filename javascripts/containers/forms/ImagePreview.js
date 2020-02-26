import { connect } from 'react-redux';
import ImagePreview from '../../components/ImagePreview'

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

const ImagePreviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePreview)

export default ImagePreviewContainer
