import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import NotificationItem from 'features/notifications/components/NotificationItem'
import COLORS from 'constants/colors'

interface Props {
  navigation: any
  route: any
  getNotifications: () => void
  notifications: any[]
}

interface State { }

class Notifications extends React.Component<Props, State> {
  componentDidMount() {
    this.props.getNotifications()
    this.props.navigation.addListener('blur', this._onBlur);
  }
  componentWillUnmount() {
    this.props.navigation.removeListener('blur', this._onBlur);
  }
  _onBlur = () => {

    this.props.makeNotificationsSeen()
  };
  renderItem = ({ item }) => {
    const data = { item }
    return <NotificationItem data={data} navigation={this.props.navigation} />
  }

  keyExtractor = (_item: any, index: number) => {
    return index.toString()
  }


  render() {
    const { notifications } = this.props
    return (
      <FlatList
        data={notifications}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.container}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: COLORS.white
  }
})

export default Notifications
