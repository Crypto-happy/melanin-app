import React from 'react'
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { isEmpty, isNumber, get } from 'lodash'
import { FONT_FAMILIES } from 'constants/fonts'
import { Picker } from '@react-native-picker/picker'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'
import COLORS from '../../constants/colors'
import RNPickerSelect from 'react-native-picker-select'
import Icon, { IconType } from '../Icon/Icon'

export interface DefaultPickerProps extends ViewProps {
  title?: string
  containerStyle?: ViewStyle
  iosPickerStyle?: ViewStyle
  titleStyle?: TextStyle
  selectedValueStyle?: TextStyle
  dataSrc?: any
  hint?: string
  keptHint?: string
  iconImageSrc?: any
  iconStartType?: IconType
  iconStartName?: string
  iconEndType?: IconType
  iconEndName?: string
  isHiddenUnderLine?: boolean
  isForcedHighlight?: boolean
  hightLightColor?: string
  selectedValue?: ItemValue
  onValueChangeFunc?: (itemValue: ItemValue) => void
}

class DefaultPicker extends React.PureComponent<DefaultPickerProps, any> {
  constructor(props: DefaultPickerProps) {
    super(props)
  }

  picker: any

  getColor = (isFocusing: boolean) => {
    const { hightLightColor } = this.props
    if (isFocusing) {
      return hightLightColor || COLORS.cornFlowerBlue
    }
    return COLORS.silver
  }

  render() {
    const {
      title,
      containerStyle,
      titleStyle,
      selectedValueStyle,
      dataSrc,
      iconStartType,
      iconStartName,
      iconEndType,
      iconEndName,
      isHiddenUnderLine,
      hint,
      keptHint,
      onValueChangeFunc,
      isForcedHighlight = false,
      iconImageSrc,
    } = this.props

    const color = this.getColor(isForcedHighlight)
    const selectedValue = get(this.props, 'selectedValue', '')
    return (
      <View>
        {!isEmpty(title) && (
          <Text style={[styles.title, titleStyle, { color: COLORS.silver }]}>
            {title?.toUpperCase()}
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.picker && this.picker.togglePicker()
          }}>
          <View
            style={[
              isHiddenUnderLine
                ? styles.containerWithoutUnderLine
                : styles.container,
              containerStyle,
            ]}>
            {isNumber(iconImageSrc) && (
              <Image source={iconImageSrc} style={styles.imageIcon} />
            )}
            {iconStartType && iconStartName && (
              <Icon
                style={styles.icon}
                type={iconStartType}
                name={iconStartName}
                size={25}
                color={color}
              />
            )}
            {!isEmpty(selectedValue.toString()) && (
              <Text style={styles.keptHint}>{keptHint}</Text>
            )}
            {Platform.OS !== 'ios' ? (
              <Picker
                mode="dropdown"
                style={[
                  styles.androidPicker,
                  selectedValueStyle,
                  !isEmpty(selectedValue.toString()) ? selectedValueStyle : {},
                ]}
                selectedValue={selectedValue}
                onValueChange={(itemValue: ItemValue) =>
                  onValueChangeFunc && onValueChangeFunc(itemValue)
                }>
                <Picker.Item
                  key={-1}
                  color={COLORS.silver}
                  value={'all'}
                  label={hint}
                />
                {!isEmpty(dataSrc) &&
                  dataSrc.map((item: { name: string; _id: string }) => {
                    return (
                      <Picker.Item
                        color={COLORS.black}
                        key={item._id}
                        value={item._id}
                        label={item.name}
                      />
                    )
                  })}
              </Picker>
            ) : (
              <RNPickerSelect
                style={{
                  viewContainer: styles.iOSPicker,
                  inputIOS: !isEmpty(selectedValue.toString())
                    ? selectedValueStyle
                    : {},
                }}
                ref={(e) => (this.picker = e)}
                placeholder={{
                  label: hint,
                  value: null,
                }}
                items={
                  !isEmpty(dataSrc) &&
                  dataSrc.map((item: { name: string; _id: string }) => {
                    return {
                      label: item.name,
                      value: item._id,
                    }
                  })
                }
                onValueChange={(itemValue: ItemValue) =>
                  onValueChangeFunc && onValueChangeFunc(itemValue)
                }
                value={selectedValue}
                pickerProps={{ style: { height: '99%', overflow: 'hidden' } }}
              />
            )}
            {Platform.OS === 'ios' && (
              <Icon
                style={styles.icon}
                type={iconEndType ? iconEndType : IconType.MaterialIcons}
                name={iconEndName ? iconEndName : 'arrow-drop-down'}
                size={25}
                color={COLORS.black}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  hint: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.silver,
  },
  containerWithoutUnderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.silver,
  },
  imageIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.transparent,
  },
  icon: {
    marginHorizontal: 12,
    paddingBottom: 8,
  },
  keptHint: {
    marginEnd: 8,
    paddingBottom: 8,
    color: COLORS.silver,
  },
  androidPicker: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 8,
    alignItems: 'center',
    paddingStart: 12,
    fontSize: 15,
  },
  iOSPicker: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 8,
    alignItems: 'center',
    paddingStart: 12,
    zIndex: 1,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
})

export default DefaultPicker
