import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon, { IconType } from 'components/Icon/Icon'
import localizedStrings from 'localization'
import update from 'immutability-helper'
import { get, isEmpty } from 'lodash'
import { Image } from 'react-native-elements'
import { NAVIGATORS } from '../../constants/navigators'
import { DEFAULT_ITEMS_PER_PAGE, NAVIGATE_FROM_SOURCE } from 'constants'
import { DirectoryBusinessProfileType } from '../../types/User.types'
import DirectoryItemResult from './DirectoryItemResult/DirectoryItemResultContainer'

interface Props {
  navigation: any
  route: any
  loading: boolean
  error: boolean
  directoryIds: Array<string>
  directories: Array<DirectoryBusinessProfileType>
  pagination: any
  getDirectories: (searchRequest: any, skip: number, limit: number) => void
  resetOldSearchResult: () => void
}

interface State {
  searchRequest: { [key: string]: any }
}

class DirectoryResults extends React.Component<Props, State> {
  state = {
    searchRequest: {},
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    const {
      navigation,
      route,
      getDirectories,
      resetOldSearchResult,
    } = this.props
    resetOldSearchResult && resetOldSearchResult()
    const searchRequest = get(route, 'params.searchRequest', '')
    const title = localizedStrings.directoryResults.headerTitle

    searchRequest && getDirectories(searchRequest, 0, DEFAULT_ITEMS_PER_PAGE)

    navigation.setOptions({
      headerTitle: () => <Text style={styles.title}>{title}</Text>,
      headerLeft: () => {
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

  componentWillUnmount() {
    const { resetOldSearchResult } = this.props
    resetOldSearchResult && resetOldSearchResult()
  }

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getDirectories,
      loading,
      route,
    } = this.props

    if (loading || endReached) {
      return
    }

    const searchRequest = get(route, 'params.searchRequest', {})
    getDirectories(
      searchRequest,
      skip + DEFAULT_ITEMS_PER_PAGE,
      DEFAULT_ITEMS_PER_PAGE,
    )
  }

  keyExtractor = (item: string) => {
    return item
  }

  onItemViewDetailPress = (userId: string) => {
    this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
      userId,
      source: NAVIGATE_FROM_SOURCE.DIRECTORIES_RESULT,
    })
  }

  renderItem = ({ item }: { item: string }) => {
    return (
      <DirectoryItemResult
        itemId={item}
        onItemViewDetailPress={this.onItemViewDetailPress}
      />
    )
  }

  onSearchRequestChange = (key: string, value: any) => {
    let updateSpec = {
      searchRequest: { [key]: { $set: value } },
    }

    this.setState(update(this.state, updateSpec))
  }

  renderNoResult = () => {
    const { loading } = this.props

    if (loading) {
      return (
        <View style={styles.emptyResultContainer}>
          <Text style={styles.emptyResultText}>Searching...</Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyResultContainer}>
        <Text style={styles.emptyResultText}>
          No Directories Found
        </Text>
      </View>
    )
  }

  render() {
    const { directoryIds } = this.props

    return (
      <FlatList
        style={[styles.container]}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.7}
        data={directoryIds}
        numColumns={1}
        renderItem={this.renderItem}
        onEndReached={this.onListEndReached}
        ListEmptyComponent={this.renderNoResult}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: COLORS.lightGrey,
    flex: 1,
  },
  backButton: {
    marginEnd: 18,
    marginStart: 18,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },

  emptyResultContainer: {
    textAlign: 'center',
    flex: 1,
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResultText: {
    marginHorizontal: 8,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 22,
    color: COLORS.black,
    textAlign: 'center',
  },

  directoryContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
  },
  directoryThumbnail: {
    resizeMode: 'cover',
    margin: 12,
    borderRadius: 8,
    flex: 1,
    width: 120,
    aspectRatio: 0.725,
  },
  directoryDescription: {
    flexDirection: 'column',
    margin: 8,
    flex: 1,
  },
  directoryDescriptionContent: {
    flexDirection: 'row',
    flex: 1,
  },
  directoryDescriptionTag: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginVertical: 4,
  },
  directoryDescriptionSubContent: {
    flexDirection: 'column',
  },
  directoryStartDescriptionSubContent: {
    flex: 3,
  },
  directoryEndDescriptionSubContent: {
    flex: 1,
  },
  directoryDescriptionSubContentChildText: {
    fontSize: 15,
    marginVertical: 2,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.doveGray,
  },
  directoryDescriptionSubContentChild: {
    marginVertical: 2,
    flexDirection: 'row',
  },
  tagViewChild: {
    backgroundColor: COLORS.lightEasternBlue,
    height: 24,
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 4,
    justifyContent: 'center',
  },
  text: {
    marginHorizontal: 8,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    color: COLORS.black,
    opacity: 0.7,
  },
})

export default DirectoryResults
