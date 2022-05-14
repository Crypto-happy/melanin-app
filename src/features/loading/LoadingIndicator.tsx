import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import COLORS from '../../constants/colors'
import Spinner from 'react-native-spinkit'

export interface LoadingIndicatorProps {
  visible?: boolean
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { visible } = props

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <Spinner
          isVisible={true}
          color={COLORS.oceanGreen}
          size={40}
          type={'Circle'}
        />
      </View>
    </Modal>
  )
}

LoadingIndicator.defaultProps = {
  visible: false,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default LoadingIndicator
