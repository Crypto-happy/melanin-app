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
import localizedStrings from 'localization';
import RangeSlider from 'rn-range-slider';

export interface FilterModalProps extends ModalProps {
  title?: string
  message: string
  okButtonText?: string
  min?: number
  max?: number
  step?: number
  onOkButtonPress: () => void
  onRangeChanged: (low: number, high: number, fromUser: boolean) => void
}
interface FilterModalState {
  content: string
  scrollEnabled: boolean
}
class FilterModal extends React.Component<FilterModalProps, FilterModalState> {

  constructor(props: FilterModalProps) {
    super(props)
    this.state = {
      content: this.props.message,
      scrollEnabled: true
    }
  }
  enableScroll = (values: any) => {
    this.setState({ scrollEnabled: true })
  };
  disableScroll = () => this.setState({ scrollEnabled: false });

  render() {
    const {
      visible,
      title,
      min,
      max,
      step,
      okButtonText,
      onOkButtonPress,
      onRangeChanged,
    } = this.props
    const { content } = this.state
    return (
      <Modal visible={visible} transparent={true}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title || localizedStrings.appName}
              </Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.bodyText} numberOfLines={3}>
                {content}
              </Text>
              <View style={styles.slider}>
                <RangeSlider
                  style={{ width: '100%', height: 50 }}
                  min={0}
                  max={50}
                  step={step || 1}
                  lineWidth={15}
                  initialLowValue={min || 0}
                  initialHighValue={max || 50}
                  gravity='center'
                  labelStyle='none'
                  thumbRadius={15}
                  selectionColor={COLORS.oceanGreen}
                  blankColor={COLORS.grey}
                  onValueChanged={(low: number, high: number, fromUser: boolean) => {
                    onRangeChanged(low/10, high/10, fromUser)
                    this.setState({ content: `Show all posts with rating \n between ${low/10} and ${high/10}` })
                  }} />
              </View>
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
  slider: {
    paddingHorizontal: 20,
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
    flexDirection: 'column',
  },
  bodyText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.oceanGreen,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
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
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
})

export default FilterModal
