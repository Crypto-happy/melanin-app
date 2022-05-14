import React from 'react'
import { Modal, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import { ScrollView } from 'react-native-gesture-handler'
import localizedStrings from 'localization'
import Icon, { IconType } from 'components/Icon/Icon'
import { WebView } from 'react-native-webview'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'
import Spinner from 'react-native-spinkit'

interface Props {
  navigation: any
  route: any
  authUser: any
}

interface State {
  loading: boolean
}

class Podcasts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const currentUser = this.props.authUser
    const title = localizedStrings.podcasts.headerTitle
    const navigation = this.props.navigation
    navigation.setOptions({
      headerTitle: (props: StackHeaderTitleProps) => (
        <Text style={styles.title}>{title}</Text>
      ),
      headerLeft: (props: StackHeaderLeftButtonProps) => {
        return (
          <>
            <TouchableOpacity
              style={styles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={() => {
                navigation.goBack()
              }}>
              <Icon
                type={IconType.MaterialIcons}
                name={'arrow-back'}
                color={COLORS.black}
                size={30}
              />
            </TouchableOpacity>
          </>
        )
      },
    })
  }

  showIconsHandler() {
    this.setState({
      loading: false,
    })
  }

  render() {
    const { loading } = this.state

    return (
      <View style={styles.container}>
        <Modal visible={loading} transparent={true}>
          <View style={styles.container1}>
            <Spinner
              isVisible={true}
              color={COLORS.oceanGreen}
              size={40}
              type={'Circle'}
            />
          </View>
        </Modal>
        <WebView
          source={{ uri: 'https://www.melaninpeople.com/magazine/podcasts/' }}
          onLoadEnd={this.showIconsHandler.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.lightGrey,
  },
  backButton: {
    marginEnd: 17,
    marginStart: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  container1: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default Podcasts
