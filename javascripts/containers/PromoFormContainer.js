import { connect, bindActionCreators } from 'react-redux';
import { 
  createPromo, 
  updatePromo,
  deletePromo,
  cancelEditing,
  unsetDatetime
} from '../redux/promos/actions'

import { openPicker, closePicker } from '../redux/datetimes'

import PromoForm from '../components/PromoForm';

const mapStateToProps = (state) => {
  const {
    details,
    detailsError,
    groupError
  }  = state.promos


  const {datetimes} = state
  
  const {id,name,isDraft}    = details
  const isNew                = id == undefined 
  const initialValues        = {...details}
  const ctaTypeOptions       = state.configs.CTA_TYPE_DROPDOWNS
  const detailsErrorMessages = detailsError ? Object.values(detailsError) : []
  const groupErrorMessages   = groupError ? Object.values(groupError) : []
  const groupErrorMessagesUnique = groupErrorMessages.reduce((list,msg) => {
    if(!list.includes(msg)) list.push(msg)
    return list
  },[])

  return {
    initialValues,
    isNew,
    id,
    name,
    ctaTypeOptions,
    isDraft,
    detailsError,
    detailsErrorMessages,
    groupError,
    groupErrorMessages: groupErrorMessagesUnique,
    datetimes
  }
}

const mapDispatchToProps = {
  createPromo,
  updatePromo,
  deletePromo,
  cancelEditing,
  unsetDatetime,
  openPicker,
  closePicker,
}

const PromoFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoForm)

export default PromoFormContainer
