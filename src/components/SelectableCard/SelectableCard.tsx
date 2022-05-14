import React, { useState } from 'react'
import { FONT_FAMILIES } from 'constants/fonts'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import COLORS from 'constants/colors'

interface Props {
  text: string
  selected?: boolean
  onPress?: () => void
}

const SelectableCard = ({
  text = 'Text',
  selected = false,
  onPress,
}: Props) => {
  const [isSelected, setIsSelected] = useState(selected)

  const onPressHandler = () => {
    setIsSelected(!isSelected)
    onPress && onPress()
  }

  const gradientColors = isSelected
    ? [COLORS.easternBlue, COLORS.oceanGreen]
    : [COLORS.transparent]

  const containerStyles = [styles.container, isSelected ? styles.selected : {}]

  const textStyles = [
    styles.text,
    isSelected ? styles.textSelected : styles.textNotSelected,
  ]

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.0, y: 1.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={containerStyles}>
      <TouchableOpacity onPress={onPressHandler}>
        <Text style={textStyles}>{text}</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default React.memo(SelectableCard)

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderColor: COLORS.silver,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginRight: 10,
    marginBottom: 10,
  },
  selected: {
    borderColor: COLORS.transparent,
  },
  text: {
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    fontSize: 12,
  },
  textNotSelected: {
    color: COLORS.silver,
  },
  textSelected: {
    color: COLORS.white,
  },
})
