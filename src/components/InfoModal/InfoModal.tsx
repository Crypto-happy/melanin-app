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

export interface InfoModalProps extends ModalProps {
  title?: string
  message: string
  okButtonText?: string
  onOkButtonPress: () => void
}

class InfoModal extends React.Component<InfoModalProps, any> {
  render() {
    const {
      visible,
      title,
      message,
      okButtonText,
      onOkButtonPress,
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
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
  },
  okButton: {
    backgroundColor: COLORS.oceanGreen,
  },
  okButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
})

export default InfoModal
