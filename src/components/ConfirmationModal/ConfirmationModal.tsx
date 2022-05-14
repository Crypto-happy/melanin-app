import React from 'react'
import {
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'

export interface ConfirmationModalProps extends ModalProps {
  title?: string
  message: string
  okButtonText?: string
  cancelButtonText?: string
  onCancelButtonPress: () => void
  onOkButtonPress: () => void
}

class ConfirmationModal extends React.Component<ConfirmationModalProps, any> {
  render() {
    const {
      visible,
      title,
      message,
      okButtonText,
      cancelButtonText,
      onOkButtonPress,
      onCancelButtonPress,
    } = this.props

    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.bodyText} numberOfLines={3}>
                {message}
              </Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancelButtonPress}>
                  <Text style={styles.cancelButtonText} numberOfLines={1}>
                    {cancelButtonText || 'Cancel'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.okButton]}
                  onPress={onOkButtonPress}>
                  <Text style={styles.okButtonText} numberOfLines={1}>
                    {okButtonText || 'OK'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: COLORS.white,
    marginHorizontal: 37,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 5,
    borderRadius: 5,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 17,
    fontWeight: 'bold',
  },
  body: {
    alignItems: 'stretch',
  },
  bodyText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.silver,
    marginRight: 10,
  },
  okButton: {
    backgroundColor: COLORS.oceanGreen,
  },
  cancelButtonText: {
    color: COLORS.black,
    fontSize: 15,
  },
  okButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
})

export default ConfirmationModal
