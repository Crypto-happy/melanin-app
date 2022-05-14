import React from 'react'
import COLORS from 'constants/colors'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Icon, { IconType } from '../Icon/Icon'
import { isEmpty } from 'lodash'
import moment from 'moment'

export interface DefaultDateTimeProps extends ViewProps {
  title?: string
  containerStyle?: ViewStyle
  iconStartType?: IconType
  iconStartName?: string
  defaultData?: any
  mode?: string
  onConfirm?: (date: Date) => void
}

class DefaultDateTimePicker extends React.PureComponent<
  DefaultDateTimeProps,
  any
> {
  constructor(props: DefaultDateTimeProps) {
    super(props)

    this.state = {
      date: null,
      isDatePickerVisible: false,
    }
  }

  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    })
  }

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    })
  }

  handleConfirm = (newDate: Date) => {
    this.props.onConfirm && this.props.onConfirm(newDate)
    this.setState({
      date: newDate,
    })
    this.hideDatePicker()
  }

  prepareContent = (mode: any, date: Date) => {
    if (mode === 'date') {
      if (
        this.props.defaultData &&
        typeof this.props.defaultData !== 'string' &&
        date == null
      ) {
        date = this.props.defaultData
      } else if (typeof this.props.defaultData !== 'string' && date == null) {
        date = new Date()
      }
    }

    if (mode === 'date') {
      return (
        <Text>
          {date != null
            ? moment(date).format('DD MMMM YYYY')
            : this.props.defaultData}
        </Text>
      )
    } else {
      return (
        <Text>
          {date != null
            ? moment(date).format('hh:mma')
            : this.props.defaultData}
        </Text>
      )
    }
  }

  render() {
    const {
      title,
      containerStyle,
      iconStartType,
      iconStartName,
      mode,
    } = this.props
    const { date, isDatePickerVisible } = this.state

    return (
      <View style={[containerStyle]}>
        {!isEmpty(title) && (
          <Text style={[styles.title, { color: COLORS.silver }]}>
            {title?.toUpperCase()}
          </Text>
        )}
        <View style={[!isEmpty(title) && styles.container]}>
          {iconStartType && iconStartName && (
            <Icon
              style={styles.icon}
              type={iconStartType}
              name={iconStartName}
              size={25}
              color={COLORS.silver}
            />
          )}
          <TouchableOpacity
            style={[!isEmpty(title) && styles.textInputExtraPadding]}
            onPress={this.showDatePicker}>
            {this.prepareContent(mode, date)}
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.silver,
  },
  icon: {
    marginHorizontal: 12,
  },
  textInputExtraPadding: {
    paddingVertical: 12,
    width: '100%',
  },
})

export default DefaultDateTimePicker
