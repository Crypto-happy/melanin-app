import React from 'react'
import {
  Text,
  StyleSheet,
  View,
  ViewProps,
  TouchableOpacity,
} from 'react-native'
import { STATISTIC_INFO_NAME } from 'constants'

interface Props extends ViewProps {
  heading: string
  content: string | number
  onPressInfo?: (state: STATISTIC_INFO_NAME) => void
  state: STATISTIC_INFO_NAME
}

interface State {}

const StatisticInfo = (props: Props) => {
  const { style, heading, content, state, onPressInfo } = props

  const handlePressInfo = () => {
    onPressInfo && onPressInfo(state)
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.infoButton} onPress={handlePressInfo}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.content}>{`${content}`}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoButton: {
    flex: 1,
  },
  heading: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
})

export default StatisticInfo
