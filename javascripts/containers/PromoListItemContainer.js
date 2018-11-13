import { connect, bindActionCreators } from 'react-redux';
import PromoListItem from '../components/PromoListItem';
import Promo from '../models/Promo'

const mapStateToProps = (state, ownProps) => {
  return {
    status: Promo.fromAttributes(ownProps).window().status
  }
}

const mapDispatchToProps = {}

const PromoListItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PromoListItem)

export default PromoListItemContainer
