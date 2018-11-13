import { connect, bindActionCreators } from 'react-redux';
import {getPromos} from '../redux/promos'
import PromoList from '../components/PromoList';

const mapStateToProps = (state) => {
  
  const {
    filters,
    app
  } = state
  
  const {
    loading,
    error,
    list,
    filtered,
    detailsVisible,
    details,
    highlighted
  } = state.promos || {}

  let index=0;
  let displayList = (filters.length ? filtered : list).slice(0)
  
  if(detailsVisible){
    const isNew  = details.id == undefined
    const length = isNew ? 0 : 1
     
    displayList.map((p,i) => {
      if(p.id == details.id) index = i
    })
    displayList.splice(index, length, {isDetails:true})
  }  

  return {
    loading,
    error,
    displayList,
    detailsVisible,
    detailsId: details.id,
    highlighted,
    appContext: app.context
  }
}

const mapDispatchToProps = {
  getPromos
}

const PromoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoList)

export default PromoListContainer
