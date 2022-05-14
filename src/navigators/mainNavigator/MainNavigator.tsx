import { get } from 'lodash'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import UserAvatar from 'components/UserAvatar'
import { ChatRoomScreen } from 'features/chat-room'
import { EditProfileScreen } from 'features/edit-profile'
import { FollowerFollowing } from 'features/followers-following'
import NotificationsIcone from 'features/notifications/components/NotificationsIcone'
import { PostDetailsScreen } from 'features/post-details'
import { Reviews } from 'features/reviews'
import { UserProfileScreen } from 'features/user-profile'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { ACCOUNT_TYPE } from 'types'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import COLORS from '../../constants/colors'
import { NAVIGATORS } from '../../constants/navigators'
import { ChatScreen } from '../../features/chat'
import { HomeScreen } from '../../features/home'
import { NewPostScreen } from '../../features/new-post'
import { NotificationsScreen } from '../../features/notifications'
import { ProfileScreen } from '../../features/profile'
import { ExploreScreen } from '../../features/explore'
import { MagazineScreen } from '../../features/magazine'
import { MarketPlaceScreen } from '../../features/marketPlace'
import { PodcastsScreen } from '../../features/podcasts'
import { DirectoriesScreen } from '../../features/directories'
import { AllproductsScreen } from '../../features/allProduct'
import { ChatPickerScreen } from '../../features/chat-picker'

import { ReportPostScreen } from '../../features/report-post'
import { SettingsScreen } from '../../features/settings'
import { PersonalInformationScreen } from '../../features/personal-information'
import { InsightsScreen } from '../../features/insights'
import { CommentsScreen } from '../../features/comments'
import { BlockedAccountsScreen } from '../../features/blocked-accounts'
import { SearchScreen } from 'features/search'
import { ChangePasswordScreen } from '../../features/change-password'
import { CountryScreen } from '../../features/country'
import * as NavigationService from 'navigators/NavigationService'
import { FONT_FAMILIES } from 'constants/fonts'
import { TopProfilesScreen } from 'features/top-profiles'
import ForumsStackScreen from 'navigators/forumsNavigator'
import { DirectoryResultsScreen } from '../../features/directory-results'
import ReferScreen from 'features/refer/Refer'
import { EarningsScreen } from 'features/earnings'
import { setDynamicLink } from '../ducks/actions'

const HomeStack = createStackNavigator()
function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <HomeStack.Screen name={NAVIGATORS.HOME.name} component={HomeScreen} />

      <HomeStack.Screen
        name={NAVIGATORS.REPORT_POST.name}
        component={ReportPostScreen}
      />

      <HomeStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />

      <HomeStack.Screen
        name={NAVIGATORS.FOLLOWERS_FOLLOWING.name}
        component={FollowerFollowing}
        options={({ route }: { route: any }) => ({
          title: route.params.profileName,
        })}
      />

      <HomeStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />

      <HomeStack.Screen
        name={NAVIGATORS.EDIT_POST.name}
        component={NewPostScreen}
      />
      <HomeStack.Screen name={NAVIGATORS.REVIEWS.name} component={Reviews} />
      <HomeStack.Screen
        name={NAVIGATORS.CHAT_ROOM.name}
        component={ChatRoomScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name={NAVIGATORS.SEARCH.name}
        component={SearchScreen}
      />
      <HomeStack.Screen
        name={NAVIGATORS.TOP_PROFILES.name}
        component={TopProfilesScreen}
        options={({ route }: { route: any }) => ({
          title: route.params.screenTitle,
        })}
      />
      <HomeStack.Screen
        name={NAVIGATORS.CHAT_PICKER.name}
        component={ChatPickerScreen}
      />
    </HomeStack.Navigator>
  )
}

const ChatStack = createStackNavigator()
function ChatStackScreen() {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <ChatStack.Screen name={NAVIGATORS.CHAT.name} component={ChatScreen} />

      <ChatStack.Screen
        name={NAVIGATORS.CHAT_ROOM.name}
        component={ChatRoomScreen}
        options={{ headerShown: false }}
      />

      <ChatStack.Screen
        name={NAVIGATORS.CHAT_PICKER.name}
        component={ChatPickerScreen}
      />

      <ChatStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />

      <ChatStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />
    </ChatStack.Navigator>
  )
}

const NewPostStack = createStackNavigator()
function NewPostStackScreen() {
  return (
    <NewPostStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <NewPostStack.Screen
        name={NAVIGATORS.NEW_POST.name}
        component={NewPostScreen}
      />

      <NewPostStack.Screen name={NAVIGATORS.HOME.name} component={HomeScreen} />
    </NewPostStack.Navigator>
  )
}

const NotificationsStack = createStackNavigator()
function NotificationsStackScreen() {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <NotificationsStack.Screen
        name={NAVIGATORS.NOTIFICATIONS.name}
        component={NotificationsScreen}
        options={{
          headerTitleStyle: {
            color: COLORS.black,
            fontSize: 22,
            fontWeight: '700',
            fontFamily: 'Montserrat',
          },
        }}
      />

      <HomeStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />

      <HomeStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />
    </NotificationsStack.Navigator>
  )
}

const ProfileStack = createStackNavigator()
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <ProfileStack.Screen
        name={NAVIGATORS.PROFILE.name}
        component={ProfileScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.FOLLOWERS_FOLLOWING.name}
        component={FollowerFollowing}
        options={({ route }: { route: any }) => ({
          title: route.params.profileName,
        })}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.EDIT_PROFILE.name}
        component={EditProfileScreen}
        options={() => ({
          title: 'Edit Profile',
        })}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.SETTINGS.name}
        component={SettingsScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.COMMENTS.name}
        component={CommentsScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.BLOCKED_ACCOUNTS.name}
        component={BlockedAccountsScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.CHANGE_PASSWORD.name}
        component={ChangePasswordScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.COUNTRY.name}
        component={CountryScreen}
      />
      <ProfileStack.Screen
        name={NAVIGATORS.EARNINGS.name}
        component={EarningsScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.PERSONAL_INFORMATION.name}
        component={PersonalInformationScreen}
      />

      <HomeStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />

      <ProfileStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />

      <HomeStack.Screen name={NAVIGATORS.REVIEWS.name} component={Reviews} />

      <HomeStack.Screen
        name={NAVIGATORS.CHAT_ROOM.name}
        component={ChatRoomScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  )
}

const InsightsStack = createStackNavigator()
function InsightsStackScreen() {
  return (
    <InsightsStack.Navigator
      options={() => ({
        headerTitleStyle: {
          color: COLORS.black,
          fontSize: 22,
          fontWeight: '700',
          fontFamily: 'Montserrat',
        },
      })}>
      <InsightsStack.Screen
        name={NAVIGATORS.INSIGHTS.name}
        component={InsightsScreen}
      />
    </InsightsStack.Navigator>
  )
}

const Tab = createBottomTabNavigator()
const HomeNavigator = (props: any) => {
  const { chat = 0 } = useSelector((state) => state.unreads)
  const dynamicLink = useSelector((state: any) => state.navigator.dynamicLink)
  const dispatch = useDispatch()

  useEffect(() => {
    if (dynamicLink) {
      const screen = get(dynamicLink, 'screen')
      if (screen) {
        props.navigation.navigate(NAVIGATORS.HOME_STACK.name, {
          screen,
          params: get(dynamicLink, 'params'),
        })
        dispatch(setDynamicLink(null))
      }
    }
  }, [dispatch, dynamicLink, props.navigation])

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLORS.oceanGreen,
        inactiveTintColor: COLORS.silver,
        showLabel: false,
        keyboardHidesTabBar: true,
        safeAreaInsets: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}>
      <Tab.Screen
        name={NAVIGATORS.HOME_STACK.name}
        component={HomeStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route)
          const routeNamesWithTabBar = [NAVIGATORS.HOME.name]
          return {
            tabBarIcon: ({ color, size }) => (
              <Icon
                type={IconType.MaterialIcons}
                name={'home'}
                color={color}
                size={size}
              />
            ),
            tabBarVisible:
              !routeName || routeNamesWithTabBar.includes(routeName),
          }
        }}
      />
      <Tab.Screen
        name={NAVIGATORS.CHAT_STACK.name}
        component={ChatStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              type={IconType.MaterialIcons}
              name={'message'}
              color={color}
              size={size}
            />
          ),
          tabBarBadge: chat > 0 ? chat : undefined,
        }}
      />
      <Tab.Screen
        name={NAVIGATORS.NEW_POST_STACK.name}
        component={NewPostStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              type={IconType.MaterialIcons}
              name={'add-box'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={NAVIGATORS.NOTIFICATIONS_STACK.name}
        component={NotificationsStackScreen}
        options={{
          tabBarIcon: NotificationsIcone,
        }}
      />
      <Tab.Screen
        name={NAVIGATORS.PROFILE_STACK.name}
        component={ProfileStackScreen}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route)
          const routeNamesWithTabBar = [NAVIGATORS.PROFILE.name]

          return {
            tabBarIcon: ({ color, size }) => (
              <Icon
                type={IconType.MaterialIcons}
                name={'person'}
                color={color}
                size={size}
              />
            ),
            tabBarVisible:
              !routeName || routeNamesWithTabBar.includes(routeName),
          }
        }}
      />
    </Tab.Navigator>
  )
}

const ExploreStack = createStackNavigator()
function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <ExploreStack.Screen
        name={NAVIGATORS.EXPLORE_STACK.name}
        component={ExploreScreen}
      />

      <ExploreStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />

      <ExploreStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />

      <InsightsStack.Screen
        name={NAVIGATORS.INSIGHTS.name}
        component={InsightsScreen}
      />
    </ExploreStack.Navigator>
  )
}

const MagazineStack = createStackNavigator()
function MagazineStackScreen() {
  return (
    <MagazineStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <MagazineStack.Screen
        name={NAVIGATORS.MAGAZINE_STACK.name}
        component={MagazineScreen}
      />
    </MagazineStack.Navigator>
  )
}

const ReferStack = createStackNavigator()
function ReferStackScreen() {
  return (
    <ReferStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <ReferStack.Screen name={NAVIGATORS.REFER.name} component={ReferScreen} />
    </ReferStack.Navigator>
  )
}

const PodcastsStack = createStackNavigator()
function PodcastsStackScreen() {
  return (
    <PodcastsStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <PodcastsStack.Screen
        name={NAVIGATORS.PODCASTS_STACK.name}
        component={PodcastsScreen}
      />
    </PodcastsStack.Navigator>
  )
}

const DirectoriesStack = createStackNavigator()
function DirectoriesStackScreen() {
  return (
    <DirectoriesStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <DirectoriesStack.Screen
        name={NAVIGATORS.DIRECTORY_STACK.name}
        component={DirectoriesScreen}
      />
      <DirectoriesStack.Screen
        name={NAVIGATORS.DIRECTORY_RESULTS_STACK.name}
        component={DirectoryResultsScreen}
      />
      <DirectoriesStack.Screen
        name={NAVIGATORS.USER_PROFILE.name}
        component={UserProfileScreen}
      />
    </DirectoriesStack.Navigator>
  )
}

const MarketPlaceStack = createStackNavigator()
function MarketPlaceStackScreen() {
  return (
    <MarketPlaceStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        },
      }}>
      <MarketPlaceStack.Screen
        options={{ headerShown: false }}
        name={NAVIGATORS.MARKET_PLACE_STACK.name}
        component={MarketPlaceScreen}
      />

      <MarketPlaceStack.Screen
        name={NAVIGATORS.ALL_PRODUCTS_STACK.name}
        component={AllproductsScreen}
      />

      <MarketPlaceStack.Screen
        name={NAVIGATORS.POST_DETAILS.name}
        component={PostDetailsScreen}
      />
    </MarketPlaceStack.Navigator>
  )
}

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props: any) {
  const authUser = props.authUser
  const isBusiness = authUser?.accountType === ACCOUNT_TYPE.BUSINESS
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center' }}>
        <UserAvatar
          imgSrc={authUser?.avatar}
          heightOrWidth={80}
          isBusiness={isBusiness}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

function MainNavigator(props: any) {
  const authUser = useSelector((state: any) => state.auth.currentUser)
  return (
    <NavigationContainer
      independent={true}
      ref={NavigationService.drawerNavigationRef}>
      <Drawer.Navigator
        initialRouteName={NAVIGATORS.MAIN.name}
        screenOptions={{ gestureEnabled: false }} // Disable swipe left or right from the edge of screen
        drawerContentOptions={{
          activeTintColor: COLORS.white,
          inactiveTintColor: COLORS.black,
          activeBackgroundColor: COLORS.oceanGreen,
        }}
        // drawerContent={(localProps) => (
        //   <CustomDrawerContent {...localProps} authUser={authUser} />
        // )}
      >
        <Drawer.Screen name={NAVIGATORS.HOME.name} component={HomeNavigator} />

        <Drawer.Screen
          name={NAVIGATORS.EXPLORE.name}
          component={ExploreStackScreen}
        />

        <Drawer.Screen
          name={NAVIGATORS.MARKET_PLACE.name}
          component={MarketPlaceStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.MAGAZINE.name}
          component={MagazineStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.PODCASTS.name}
          component={PodcastsStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.REFER.name}
          component={ReferStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.DIRECTORY.name}
          component={DirectoriesStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.INSIGHTS.name}
          component={InsightsStackScreen}
        />
        <Drawer.Screen
          name={NAVIGATORS.FORUMS.name}
          component={ForumsStackScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
