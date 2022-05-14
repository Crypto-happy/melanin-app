import React from 'react'
import {
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import localizedStrings from 'localization'
import Hyperlink from 'react-native-hyperlink'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'

export interface ExpandableTextProps extends TextProps {
  containerStyle?: ViewStyle
}

interface State {
  showExpandButton: boolean
  expanded: boolean
}

const MAXIMUM_NUMBER_OF_LINES = 5

class ExpandableText extends React.PureComponent<ExpandableTextProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
      showExpandButton: false,
    }
  }

  onExpandButtonPress = () => {
    this.setState({
      expanded: true,
    })
  }

  onTextLayout = ({ nativeEvent: { lines } }) => {
    if (lines.length > MAXIMUM_NUMBER_OF_LINES) {
      this.setState({
        showExpandButton: true,
      })
    }
  }

  render() {
    const { containerStyle, ...rest } = this.props
    const { expanded, showExpandButton } = this.state
    let numberOfLines
    if (showExpandButton) {
      numberOfLines = expanded ? undefined : MAXIMUM_NUMBER_OF_LINES
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
          <Text
            numberOfLines={numberOfLines}
            {...rest}
            onTextLayout={this.onTextLayout}
          />
        </Hyperlink>
        {showExpandButton && !expanded && (
          <TouchableOpacity
            style={styles.expandButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.onExpandButtonPress}>
            <Text style={styles.expandButtonText}>
              {localizedStrings.common.expand}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  expandButton: {
    marginTop: 5,
  },
  expandButtonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.doveGray,
  },
  linkStyle: {
    color: COLORS.website,
  }
})

export default ExpandableText
