import { connect } from 'react-redux'
import LoadingIndicator from './LoadingIndicator'

const mapStateToProps = (state: any) => ({
  visible: state.loading.visible,
})

export default connect(mapStateToProps, null)(LoadingIndicator)
