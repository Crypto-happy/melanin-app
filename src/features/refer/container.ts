import { connect } from 'react-redux'
import Refer from './Refer'
import { Dispatch } from 'redux'
import { sendReferralEmails } from './ducks/actions'


const mapDispatchToProps = (dispatch: Dispatch) => ({
  sendReferralEmails: (data: any) => dispatch(sendReferralEmails(data)),
  
})

export default connect(null, mapDispatchToProps)(Refer)
