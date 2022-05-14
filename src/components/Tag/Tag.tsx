import React from 'react'
import { FONT_FAMILIES } from 'constants/fonts'
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'

export interface TagProps extends ViewProps {
  text: string
  onRemovePress: (text: string) => void
  textStyle?: TextStyle
}

const Tag = (props: TagProps) => {
  const { text, onRemovePress, style, textStyle, ...rest } = props

  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {text}
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
        onPress={() => onRemovePress(text)}>
        <Icon
          type={IconType.Ionicons}
          name={'md-close'}
          color={COLORS.geyser}
          size={18}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    paddingLeft: 11,
    maxWidth: 150,
  },
  text: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginRight: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.regentGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Tag
