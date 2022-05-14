import React from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import Icon from '../Icon'
import COLORS from '../../constants/colors'
import { IconType } from '../Icon/Icon'
import { FONT_FAMILIES } from '../../constants/fonts'

export interface ErrorsListProps extends ViewProps {
  errors: string[]
}

const ErrorsList = (props: ErrorsListProps) => {
  const { errors, style } = props

  return (
    <View style={[styles.container, style]}>
      {errors.map((error, index) => (
        <View style={styles.errorItem} key={index.toString()}>
          <Icon
            type={IconType.MaterialIcons}
            name={'error'}
            color={COLORS.coral}
            size={20}
          />
          <Text style={styles.errorText} numberOfLines={1}>
            {error}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  errorItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    color: COLORS.coral,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
})

export default ErrorsList
