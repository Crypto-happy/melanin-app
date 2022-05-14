import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'

interface Props {
  data: any
  index: number
  selected: boolean
  onPress: (index: number) => void
}

class TopicItem extends React.PureComponent<Props, any> {
  onPress = () => {
    const { index, onPress } = this.props
    onPress(index)
  }

  render() {
    const { data, selected } = this.props

    return (
      <TouchableOpacity style={styles.touchable} onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.text}>{data}</Text>
          {selected && (
            <Icon
              type={IconType.MaterialIcons}
              name={'check'}
              color={COLORS.cornFlowerBlue}
              size={20}
            />
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 19,
    paddingVertical: 20,
  },
  touchable: {},
  text: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    flex: 1,
  },
})

export default TopicItem
