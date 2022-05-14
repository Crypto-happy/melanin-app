import React from 'react'
import COLORS from 'constants/colors'
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import DefaultInput from 'components/DefaultInput'
import { FONT_FAMILIES } from 'constants/fonts'
import Icon, { IconType } from '../Icon/Icon'
import { DefaultInputProps } from '../DefaultInput/DefaultInput'

export interface DefaultAddTagProps extends DefaultInputProps {
  title?: string
  titleStyle?: TextStyle
  iconStartType?: IconType
  iconStartName?: string
  iconEndType?: IconType
  iconEndName?: string
  startText?: string
  startTextStyle?: any
  endText?: string
  endTextStyle?: any
  placeholder: string
  tagCodes: Array<string>
  focusColor?: string
  containerStyle?: ViewStyle
  onAddedFunc?: (value: string) => void
  onRemovedFunc?: (value: string) => void
}

class DefaultAddTags extends React.PureComponent<DefaultAddTagProps, any> {
  constructor(props: DefaultAddTagProps) {
    super(props)
  }

  render() {
    const {
      title,
      titleStyle,
      iconStartType,
      iconStartName,
      iconEndType,
      iconEndName,
      startText,
      startTextStyle,
      endText,
      endTextStyle,
      placeholder,
      tagCodes,
      focusColor,
      containerStyle,
      onAddedFunc,
      onRemovedFunc,
    } = this.props

    return (
      <View>
        <DefaultInput
          title={title}
          titleStyle={titleStyle}
          containerStyle={{ ...styles.inputContainer, ...containerStyle }}
          placeholder={placeholder}
          iconStartType={iconStartType}
          iconStartName={iconStartName}
          iconEndType={iconEndType}
          iconEndName={iconEndName}
          startText={startText}
          startTextStyle={startTextStyle}
          endText={endText}
          endTextStyle={endTextStyle}
          focusColor={focusColor}
          autoFocus={false}
          keyboardType={'default'}
          autoCapitalize={'none'}
          onAddedFunc={onAddedFunc}
        />

        <View style={styles.tagViewParent}>
          {tagCodes &&
            tagCodes.length !== 0 &&
            tagCodes.map((tagCode: string) => {
              return (
                <View key={tagCode} style={styles.tagViewChild}>
                  <Text numberOfLines={1} style={styles.text}>
                    {tagCode}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (onRemovedFunc) {
                        onRemovedFunc(tagCode)
                      }
                    }}>
                    <View style={styles.closeIcon}>
                      <Icon
                        type={IconType.FontAwesome}
                        name={'close'}
                        size={16}
                        color={COLORS.silver}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  tagViewParent: {
    flexWrap: 'wrap',
    marginBottom: 16,
    flexDirection: 'row',
  },
  tagViewChild: {
    marginStart: 24,
    marginBottom: 8,
    flexDirection: 'row',
    backgroundColor: COLORS.lightEasternBlue,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: '100%',
    paddingEnd: 4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  text: {
    paddingStart: 12,
    paddingEnd: 8,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: COLORS.black,
    opacity: 0.7,
  },
})

export default DefaultAddTags
