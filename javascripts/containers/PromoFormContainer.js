import { connect, bindActionCreators } from 'react-redux';
import { 
  createPromo, 
  updatePromo,
  deletePromo,
  cancelEditing 
} from '../redux/promos'

import PromoForm from '../components/PromoForm';

const mapStateToProps = (state) => {
  const {details}      = state.promos
  const {id,name}      = details
  const isNew          = id == undefined 
  const initialValues  = {...details}
  const ctaTypeOptions = state.configs.CTA_TYPE_DROPDOWNS

  return {
    initialValues,
    isNew,
    id,
    name,
    ctaTypeOptions
  }
}

const mapDispatchToProps = {
  createPromo,
  updatePromo,
  deletePromo,
  cancelEditing
}

const PromoFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoForm)

export default PromoFormContainer
