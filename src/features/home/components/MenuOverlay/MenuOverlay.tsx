import React, { useState, useEffect, useCallback } from 'react'
import { Overlay } from 'react-native-elements'
import { View, StyleSheet } from 'react-native'
import { useNavigationState, useNavigation } from '@react-navigation/native'

import MenuItem from './MenuItem'
import { hideMenu } from 'navigators/helpers'
import { NAVIGATORS } from 'constants/navigators'
import * as NavigationService from 'navigators/NavigationService'

const MenuOverlay = () => {
  const navState = useNavigationState((state: any) => state)
  const [visible, setVisible] = useState(!!navState.menuVisible)
  const navigation = useNavigation()
  useEffect(() => {
    setVisible(!!navState.menuVisible)
  }, [navState.menuVisible])

  const dispatchHideMenu = useCallback(() => {
    setVisible(false)
    navigation.dispatch(hideMenu())
  }, [navigation])

  const navigateTo = useCallback(
    (destination: string) => {
      dispatchHideMenu()
      NavigationService.drawerNavigationRef.current?.navigate(destination)
    },
    [dispatchHideMenu],
  )

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={dispatchHideMenu}
      overlayStyle={styles.root}>
      <View style={styles.container}>
        <View style={styles.row}>
          <MenuItem
            title="Explore"
            imageSrc={require('assets/images/explore.png')}
            onPress={() => navigateTo(NAVIGATORS.SEARCH.name)}
          />

          <MenuItem
            title="Marketplace"
            imageSrc={require('assets/images/marketplace.png')}
            onPress={() => navigateTo(NAVIGATORS.MARKET_PLACE.name)}
          />

          <MenuItem
            title="Insight"
            imageSrc={require('assets/images/insight.png')}
            onPress={() => navigateTo(NAVIGATORS.INSIGHTS.name)}
          />
        </View>

        <View style={styles.row}>
          {/*<MenuItem*/}
          {/*  title="Magazine"*/}
          {/*  imageSrc={require('assets/images/magazine.png')}*/}
          {/*  onPress={() => navigateTo(NAVIGATORS.MAGAZINE.name)}*/}
          {/*/>*/}

          {/*<MenuItem*/}
          {/*  title="Podcast"*/}
          {/*  imageSrc={require('assets/images/podcast.png')}*/}
          {/*  onPress={() => navigateTo(NAVIGATORS.PODCASTS.name)}*/}
          {/*/>*/}

          {/* <MenuItem
            title="Refer"
            imageSrc={require('assets/images/podcast.png')}
            onPress={() => navigateTo(NAVIGATORS.REFER.name)}
          /> */}

          <MenuItem
            title="Directory"
            imageSrc={require('assets/images/icon-directory.png')}
            onPress={() => navigateTo(NAVIGATORS.DIRECTORY.name)}
          />
        </View>

        {/*<View style={styles.row}>*/}
        {/*  <MenuItem*/}
        {/*    title="Forums"*/}
        {/*    imageSrc={require('assets/images/icon-forum.png')}*/}
        {/*    onPress={() => navigateTo(NAVIGATORS.FORUMS.name)}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    borderRadius: 15,
    top: 55,
    width: '80%',
  },
  container: {
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
  },
})

export default MenuOverlay
