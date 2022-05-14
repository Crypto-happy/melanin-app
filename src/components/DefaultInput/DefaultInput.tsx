import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon, { IconType } from '../Icon/Icon'
import COLORS from '../../constants/colors'
import { isEmpty } from 'lodash'
import { FONT_FAMILIES } from 'constants/fonts'

export interface DefaultInputProps extends TextInputProps {
  title?: string
  containerStyle?: ViewStyle
  iconStartType?: IconType
  iconStartName?: string
  iconEndType?: IconType
  iconEndName?: string
  hasError?: boolean
  isHiddenUnderLine?: boolean
  isForcedHighlight?: boolean
  startText?: string
  startTextStyle?: ViewStyle
  endText?: string
  endTextStyle?: ViewStyle
  onAddedFunc?: (value: string) => void
}

interface State {
  isFocusing: boolean
  curText: string
}

class DefaultInput extends React.PureComponent<DefaultInputProps, State> {
  constructor(props: DefaultInputProps) {
    super(props)

    this.state = {
      isFocusing: false,
      curText: '',
    }
  }

  onFocus = () => {
    this.setState({
      isFocusing: true,
    })
  }

  onBlur = () => {
    this.setState({
      isFocusing: false,
    })
  }

  onChangeText = (text: string) => {
    this.setState({
      curText: text,
    })
  }

  getColor = (isFocusing: boolean, hasError: boolean) => {
    if (hasError) {
      return COLORS.coral
    }
    if (isFocusing) {
      return COLORS.cornFlowerBlue
    }
    return COLORS.silver
  }

  render() {
    const {
      title,
      containerStyle,
      style,
      iconStartType,
      iconStartName,
      iconEndType,
      iconEndName,
      hasError = false,
      startText,
      isHiddenUnderLine,
      startTextStyle,
      endText,
      isForcedHighlight = false,
      endTextStyle,
      onAddedFunc,
      ...rest
    } = this.props
    const { isFocusing, curText } = this.state

    const color = this.getColor(isFocusing || isForcedHighlight, hasError)

    const currentContainerStyle = { borderColor: color }

    return (
      <View>
        {!isEmpty(title) && (
          <Text style={[styles.title, { color: color }]}>
            {title?.toUpperCase()}
          </Text>
        )}
        <View
          style={[
            isHiddenUnderLine
              ? styles.containerWithoutUnderLine
              : styles.container,
            containerStyle,
            currentContainerStyle,
          ]}>
          {iconStartType && iconStartName ? (
            <Icon
              style={styles.icon}
              type={iconStartType}
              name={iconStartName}
              size={25}
              color={color}
            />
          ) : (
            !isEmpty(startText) && (
              <Text style={[styles.text, startTextStyle]}>{startText}</Text>
            )
          )}
          <TextInput
            underlineColorAndroid={'transparent'}
            style={[
              style,
              iconStartType && iconStartName
                ? styles.textInput
                : styles.textInputExtraPadding,
            ]}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            value={curText}
            {...rest}
          />
          {iconEndType && iconEndName ? (
            <Icon
              style={styles.icon}
              type={iconEndType}
              name={iconEndName}
              size={25}
              color={color}
            />
          ) : (
            !isEmpty(endText) && (
              <TouchableOpacity
                onPress={() => {
                  if (onAddedFunc && !isEmpty(curText)) {
                    onAddedFunc(curText)
                    this.onChangeText('')
                  }
                }}>
                <Text style={[styles.text, endTextStyle]}>{endText}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
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
  containerWithoutUnderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.silver,
  },
  textInput: {
    includeFontPadding: false,
    flex: 1,
    paddingVertical: 8,
    paddingTop: 8,
  },
  textInputExtraPadding: {
    includeFontPadding: false,
    flex: 1,
    paddingVertical: 8,
    paddingStart: 12,
    paddingTop: 8,
  },
  icon: {
    marginHorizontal: 12,
  },
  text: {
    marginHorizontal: 12,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
})

export default DefaultInput
