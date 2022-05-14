import React from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { isEmpty } from 'lodash'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'

export interface BadgeProps extends ViewProps {
  content: string
  colors?: string[]
}

const Badge = (props: BadgeProps) => {
  const { style, content, colors = [] } = props
  const fillColors = isEmpty(colors)
    ? [COLORS.easternBlue, COLORS.oceanGreen]
    : colors

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={fillColors}
        style={styles.gradientContainer}>
        <Text style={styles.text}>{content}</Text>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.white,
  },
})

export default Badge
