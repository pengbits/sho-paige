import { connect, bindActionCreators } from 'react-redux';

import { 
  createPromo, 
  updatePromo,
  deletePromo,
  cancelEditing,
  unsetDatetime
} from '../redux/promos/actions'

import { 
  openPicker, 
  closePicker 
} from '../redux/datetimes'

import {
  getKeyFromContentBlock
} from '../redux/content-block'

import PromoForm from '../components/PromoForm';
import {getFormFactory} from '../components/forms/FormFactory';

const mapStateToProps = (state) => {
  const contentBlockKey = getKeyFromContentBlock(state.contentBlock)
  const {
    details,
    detailsError,
    groupError,
    smallImageUrlStatus,
    largeImageUrlStatus
  }  = state.promos
  const {
    isSearchContext
  } = state.app

  const {datetimes} = state
  const {id,name,isDraft}    = details
  const isNew                = id == undefined 
  const initialValues        = getInitialValues({details,isSearchContext})
  const ctaTypeOptions       = state.configs.CTA_TYPE_DROPDOWNS
  const detailsErrorMessages = detailsError ? [detailsError.message].concat(Object.values(detailsError.map || {})) : []
  const groupErrorMessages   = groupError   ? Object.values(groupError) : []
  const groupErrorMessagesUnique = groupErrorMessages.reduce((list,msg) => {
    if(!list.includes(msg)) list.push(msg)
    return list
  },[])

  return {
    contentBlockKey,
    initialValues,
    isSearchContext,
    isNew,
    id,
    name,
    ctaTypeOptions,
    isDraft,
    detailsError,
    detailsErrorMessages,
    groupError,
    groupErrorMessages: groupErrorMessagesUnique,
    datetimes,
    validate: getValidator(contentBlockKey),
    smallImageUrlStatus,
    largeImageUrlStatus
  }
}

const getInitialValues = ({details,isSearchContext}) => {
  let values = {...details}
  
  // coerce the two displayContext properties into a single value suitable for passing to a form input
  if(isSearchContext && values.displayContextName) {
     values.displayContext = values.displayContextName +" :: " + values.displayContentBlockName
  }
  return values
}

const getValidator = (context) => {
  // get the validator function to pass to redux-form
  // this looks like we could pass the same 'context' property in to get custom validation,
  // but since validation is passed to the decorator, statically at 'design time',
  // and context is determined dynamically, at runtime, this won't work
  // at the moment all we cand is to get a factory with default settings and pass it to getValidator
  // console.log(`PromoFormContainer#getValidator(${context})`)
  const factory = getFormFactory({context})
  return factory.getValidator([
    'default',
    {'config':factory.getConfig({context})}
  ])
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
