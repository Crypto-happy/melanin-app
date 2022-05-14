import COLORS from 'constants/colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface Props {
  children?: any,
  width?:number
}

const Card = (props: Props) => {
  const { children, width = '100%' } = props
  return (
    <View style={[styles.cardContainer,{width:width}]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    overflow: 'hidden',
    backgroundColor:COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,  
    elevation: 2,
    borderRadius: 5,
    paddingHorizontal:15,
    paddingVertical:15,
    marginBottom:15
  }
  
})

export default Card
