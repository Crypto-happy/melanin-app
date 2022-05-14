import React from 'react'
import { Modal, ModalProps, StyleSheet, Text, View } from 'react-native'
import { Pie } from 'react-native-progress'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'

export interface ProgressModalProps extends ModalProps {
  text: string
  color?: string
  progress: number
}

class ProgressModal extends React.PureComponent<ProgressModalProps> {
  render() {
    const {
      text,
      color = COLORS.cornFlowerBlue,
      progress,
      ...rest
    } = this.props
    return (
      <Modal {...rest} transparent={true}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Pie color={color} size={30} progress={progress} />
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  content: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.cornFlowerBlue,
    marginTop: 10,
  },
})

export default ProgressModal
