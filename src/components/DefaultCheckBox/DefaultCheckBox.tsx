import React from 'react'
import { StyleSheet, Text, View, ViewProps, ViewStyle } from 'react-native'
import { CheckBox } from 'react-native-elements'
import COLORS from '../../constants/colors'

export interface DefaultCheckBoxProps extends ViewProps {
  title?: string
  containerStyle?: ViewStyle
  isSelected?: boolean
  onValueChangeFunc?: (itemValue: boolean) => void
}

class DefaultCheckBox extends React.PureComponent<DefaultCheckBoxProps, any> {
  constructor(props: DefaultCheckBoxProps) {
    super(props)
  }

  render() {
    const {
      title,
      containerStyle,
      isSelected = false,
      onValueChangeFunc,
    } = this.props

    return (
      <View style={[containerStyle, styles.checkboxContainer]}>
        <CheckBox
          containerStyle={styles.checkBox}
          textStyle={styles.title}
          center
          title={title}
          checked={isSelected && isSelected}
          onPress={() => onValueChangeFunc && onValueChangeFunc(!isSelected)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  title: {
    color: COLORS.silver,
    fontSize: 15,
  },
})

export default DefaultCheckBox
