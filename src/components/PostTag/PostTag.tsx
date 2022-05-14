import React from 'react'
import COLORS from 'constants/colors'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'

export interface PostTagProps extends ViewProps {
  text: string
}

const PostTag = (props: PostTagProps) => {
  const { text, style, ...rest } = props

  return (
    <View style={[styles.container, style]} {...rest}>
      <Text numberOfLines={1} style={styles.text}>
        {text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightOceanGreen,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: COLORS.black,
    opacity: 0.7,
  },
})

export default PostTag
