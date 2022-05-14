import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import { connect } from 'react-redux'

export interface NotifIconeProps {
  color: any
  size: any
}
export interface CounterProps {
  counter: any
}

const NotificationsIcone = (props: NotifIconeProps) => {
  const {
    color,
    size,
  } = props
  return (<View>
    <Icon
      type={IconType.MaterialIcons}
      name={'notifications'}
      color={color}
      size={size}
    />
    <Counter />
  </View>
  )
}

const CounterView = (props: CounterProps) => {
  const {
    counter
  } = props
  return (<LinearGradient
    colors={[COLORS.easternBlue, COLORS.oceanGreen]}
    style={[styles.gradient, {
      opacity: counter === 0 ? 0 : 1
    }]}>
    <Text style={styles.textStyle}>{counter}</Text>
  </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    right: -6,
    top: -7,
    borderRadius: 10,
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    zIndex: 5
  }, textStyle: {
    color: 'white',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 11,
    zIndex: 5
  }
})

const mapStateToProps = (state: any) => ({
  counter: state.notifications.notifications.filter(notif => !notif.isSeen).length
})
const Counter = connect(mapStateToProps, null)(CounterView)
export default NotificationsIcone
