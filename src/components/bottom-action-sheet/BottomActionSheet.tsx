import React, { ReactElement } from 'react'
import {
  Modal,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import COLORS from '../../constants/colors'
import { BottomActionSheetAction } from '../../types'
import { FONT_FAMILIES } from 'constants/fonts'

export interface BottomActionSheetProps {
  isShowing: boolean
  actions: BottomActionSheetAction[]
  onOverlayPress: () => void
}

class BottomActionSheet extends React.Component<BottomActionSheetProps> {
  onActionPress = (action: BottomActionSheetAction) => {
    action.onPress()
  }

  onOverlayPress = () => {
    this.props.onOverlayPress()
  }

  renderActionIcon = (icon: string, renderIcon: () => ReactElement) => {
    if (!icon && !renderIcon) {
      return null
    }

    return renderIcon ? (
      renderIcon()
    ) : (
      <Ionicons name={icon} size={20} color={COLORS.black} />
    )
  }

  renderActionText = (text: string, renderText: () => ReactElement) => {
    if (!text && !renderText) {
      return null
    }

    return renderText ? (
      renderText()
    ) : (
      <Text style={styles.actionText} numberOfLines={1}>
        {text}
      </Text>
    )
  }

  renderActions = (actions: Array<any>) => {
    return actions.map((action, index) => {
      const { icon, text, renderIcon, renderText } = action
      return (
        <>
          <TouchableHighlight
            style={styles.actionTouchable}
            key={index.toString()}
            underlayColor={COLORS.geyser}
            onPress={() => this.onActionPress(action)}>
            <View style={styles.actionContainer}>
              {this.renderActionIcon(icon, renderIcon)}
              {this.renderActionText(text, renderText)}
            </View>
          </TouchableHighlight>

          {actions.length > 1 && index < actions.length - 1 && (
            <View style={styles.divider} />
          )}
        </>
      )
    })
  }

  render() {
    const { actions, isShowing } = this.props

    return (
      <Modal visible={isShowing} transparent={true} animationType={'fade'}>
        <TouchableWithoutFeedback
          style={[styles.containerTouchable]}
          onPress={this.onOverlayPress}>
          <View style={[styles.container, styles.overlay]}>
            <View style={styles.actionsContainer}>
              {this.renderActions(actions)}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  containerTouchable: {
    flex: 1,
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    flex: 1,
  },
  overlay: {
    backgroundColor: COLORS.overlay,
  },
  actionContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  actionsContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  actionText: {
    marginLeft: 10,
    color: COLORS.black,
    // fontWeight: '600',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  actionTouchable: {
    alignItems: 'stretch',
  },
  divider: {
    height: 1 / PixelRatio.get(),
    backgroundColor: COLORS.geyser,
    marginHorizontal: 18,
  },
})

export default BottomActionSheet
