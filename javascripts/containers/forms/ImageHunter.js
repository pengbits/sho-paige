import { connect } from 'react-redux';
import { 
  hunterConfirmDeps,
  hunterInitHunter,
  hunterRequestSearch, 
  hunterQuitHunter
} from '../../redux/hunter-adapter'
import ImageHunter from '../../components/forms/ImageHunter'

const mapStateToProps = (state) => {
  const {
    error,
    dependencies,
    initialized,
    loading
  } = state.hunter
  const {
    seriesId
  } = state.promos.details || {}
  return {
    error,
    dependencies,
    initialized,
    loading,
    seriesId
  }
}

const mapDispatchToProps = {
  hunterConfirmDeps,
  hunterInitHunter,
  hunterQuitHunter,
  hunterRequestSearch
}

const ImageHunterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageHunter)

export default ImageHunterContainer
