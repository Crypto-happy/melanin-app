import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'

export interface BusinessCategoryItemProps {
  data: any
  onPress: (category: string) => void
}

const BusinessCategoryItem = (props: BusinessCategoryItemProps) => {
  const {
    data: { text = '' },
    onPress,
  } = props

  const onPressHandler = useCallback(() => {
    onPress(text)
  }, [text, onPress])

  return (
    <TouchableOpacity style={styles.container} onPress={onPressHandler}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 19,
    paddingVertical: 10,
  },
  text: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.black,
  },
})

export default BusinessCategoryItem
