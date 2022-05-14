import React from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { isEmpty } from 'lodash'

import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import Icon from 'components/Icon'
import { FONT_FAMILIES } from 'constants/fonts'
import LinearGradient from 'react-native-linear-gradient'
import { settingOptions } from './settingOptions'
import { NAVIGATORS } from 'constants/navigators'

interface Props {
  navigation: any
  settingData: any
  siteUrls: any
  logout: () => void
  getUserSettings: () => void
  updateUserSetting: (settingObj: object) => void
}

interface State {
  switchValue: boolean
  privateAccount: boolean
  activityStatus: boolean
  darkMode: boolean
  notificationStatus: boolean
  siteUrls: any
}

class Settings extends React.Component<Props, State> {
  state = {
    switchValue: false,
    privateAccount: false,
    activityStatus: false,
    darkMode: false,
    notificationStatus: false,
    siteUrls: null,
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { settingData, siteUrls } = this.props

    if (prevProps.settingData != settingData && !!settingData) {
      this.setState({
        privateAccount: settingData.privateAccount,
        activityStatus: settingData.activityStatus,
        darkMode: settingData.darkMode,
        notificationStatus: settingData.notificationStatus,
        siteUrls: siteUrls,
      })
    }
  }

  componentDidMount() {
    this.props.getUserSettings()
  }

  onSwitchValueChange = (type: string) => {
    const {
      privateAccount,
      activityStatus,
      darkMode,
      notificationStatus,
    } = this.state
    const { settingData } = this.props
    let _settingObj = {
      changedFields: {
        email: 0,
        username: 0,
      },
      fullName: settingData.name,
    }
    switch (type) {
      case 'Private Account':
        this.state.privateAccount = !privateAccount
        settingData.privateAccount = !privateAccount
        break
      case 'Activity Status':
        this.state.activityStatus = !activityStatus
        settingData.activityStatus = !activityStatus
        break
      case 'Dark Mode':
        this.state.darkMode = !darkMode
        settingData.darkMode = !darkMode
        break
      case 'Notifications':
        this.state.notificationStatus = !notificationStatus
        settingData.notificationStatus = !notificationStatus
        break
    }
    this.setState(this.state)

    _settingObj = { ..._settingObj, ...settingData }

    this.props.updateUserSetting(_settingObj)
  }

  handleWebLinkOption = (option: SettingItemOption) => {
    const { siteUrls } = this.state

    if (isEmpty(siteUrls)) {
      return Linking.openURL(`${option.routeName}`)
    }

    switch (option.name) {
      case 'Help page':
        return Linking.openURL(`${siteUrls.helpUrl}`)

      case 'About us':
        return Linking.openURL(`${siteUrls.aboutUsUrl}`)

      case 'Privacy policy':
        return Linking.openURL(`${siteUrls.privacyUrl}`)

      case 'Terms and conditions':
        return Linking.openURL(`${siteUrls.termConditionUrl}`)

      default:
        return Linking.openURL(`${option.routeName}`)
    }
  }

  handleItemPress = (option: SettingItemOption) => {
    const { type, routeName, name } = option
    if (type !== 'switch' && !!routeName) {
      if (type == 'webLink') {
        isEmpty(this.state.siteUrls)
          ? Linking.openURL(`${routeName}`)
          : this.handleWebLinkOption(option)
      } else {
        this.props.navigation.navigate(NAVIGATORS[routeName].name)
      }
    }
  }

  renderSettingOptions = (key: string) => {
    return settingOptions[key].map((option: any, i: number) => (
      <View key={i} style={styles.listItemContainer}>
        <LinearGradient
          colors={[COLORS.easternBlue, COLORS.oceanGreen]}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{ width: 3 }}
        />
        <TouchableOpacity
          activeOpacity={option.type == 'switch' ? 1 : 0.8}
          style={styles.listItem}
          onPress={(e) => {
            this.handleItemPress(option)
          }}>
          <Text style={styles.listText}>{option.name}</Text>
          {option.type === 'switch' ? (
            <Switch
              value={this.state[option.val]}
              thumbColor={
                COLORS[this.state[option.val] ? 'oceanGreen' : 'silver']
              }
              trackColor={{
                true: COLORS.geyser,
                false: COLORS.geyser,
              }}
              onValueChange={(e) => this.onSwitchValueChange(option.name)}
            />
          ) : (
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={'chevron-right'}
              color={COLORS.silver}
              size={24}
            />
          )}
        </TouchableOpacity>
      </View>
    ))
  }

  render() {
    const settingOptionsArr = Object.keys(settingOptions)
    const { logout } = this.props

    return (
      <ScrollView style={styles.container}>
        {settingOptionsArr.map((key, index) => {
          return (
            <>
              <View style={styles.listItemContainer}>
                <View key={index} style={[styles.listItem]}>
                  <Text style={[styles.listText, { color: COLORS.oceanGreen }]}>
                    {key}
                  </Text>
                </View>
              </View>

              <>{this.renderSettingOptions(key)}</>
            </>
          )
        })}

        <TouchableOpacity style={styles.listItem} onPress={(e) => logout()}>
          <Text style={styles.listText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.alabaster,
  },
  listItemHeading: {},
  listText: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
  },
  listItemContainer: {
    flexDirection: 'row',
  },
  listItem: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingLeft: 33,
    paddingRight: 24,
  },
})

interface SettingItemOption {
  type: string
  routeName: string
  name: string
}

export default Settings
