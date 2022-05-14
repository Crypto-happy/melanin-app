import { connect } from 'react-redux'
import Notifications from './Notifications'
import { Dispatch } from 'redux'
import { getNotificationsRequest,makeNotificationsSeenRequest } from 'features/notifications/ducks/actions'

const mapStateToProps = (state: any) => ({
    notifications: state.notifications.notifications,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getNotifications: () => dispatch(getNotificationsRequest()),
  makeNotificationsSeen: () => dispatch(makeNotificationsSeenRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
