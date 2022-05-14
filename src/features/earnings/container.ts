import { getLoyaltyTokensRequest } from './ducks/actions'
import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import Earnings from './Earnings'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => ({
  loyaltyTokens: state.loyaltyTokens.loyaltyTokens,
  totalLoyaltyTokens: state.loyaltyTokens.total,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getLoyaltyTokens: () => dispatch(getLoyaltyTokensRequest()),
})

const headerOptions = {
  title: localizedStrings.earnings.title,
  showLogo: false,
  showBackButton: true,
}

export default compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps),
)(Earnings)
