import React from 'react'
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { ImageSourcePropType } from 'react-native'
import COLORS from 'constants/colors'
interface MenuItemProps {
  title: string
  imageSrc: ImageSourcePropType
  onPress: () => void
}

const MenuItem = (props: MenuItemProps) => {
  const { onPress, title, imageSrc } = props
  return (
    <TouchableOpacity onPress={onPress} style={styles.root}>
      <View style={styles.container}>
        <Image source={imageSrc} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '33.3333%',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    backgroundColor: 'transparent',
    width: 46,
    height: 46,
  },
  title: {
    marginTop: 8,
    color: COLORS.darkBlue,
  },
})

export default MenuItem
