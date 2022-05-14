import { connect } from 'react-redux'
import FollowListItem from './FollowListItem'

const mapStateToProps = (state: any, props: any) => {
  const { userItemId } = props

  return {
    user: state.search.usersById[userItemId],
  }
}

export default connect(mapStateToProps, null)(FollowListItem)
