import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native'
import COLORS from 'constants/colors'
import DefaultPicker from 'components/DefaultPicker'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon, { IconType } from 'components/Icon/Icon'
import localizedStrings from 'localization'
import DefaultInput from '../../components/DefaultInput'
import update from 'immutability-helper'
import ratingScore from '/assets/data/rating_score.json'
import { get } from 'lodash'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'
import { DefaultButton } from '../../components/DefaultButton'
import DefaultCheckBox from '../../components/DefaultCheckBox'
import { NAVIGATORS } from '../../constants/navigators'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height: SCREEN_HEIGHT } = Dimensions.get('screen')

interface Props {
  navigation: any
  route: any
  authUser: any
}

interface State {
  searchRequest: { [key: string]: any }
}

const SEARCH_REQUEST_FIELDS = {
  UNIQUE_KEY: 'uniqueKey',
  LOCATION: 'location',
  MIN_RATING: 'minRating',
  MAX_RATING: 'maxRating',
  HIGH_VIEW_ONLY: 'highViewOnly',
}

class Directories extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchRequest: {
        uniqueKey: '',
        location: '',
        minRating: 1,
        maxRating: 5,
        highViewOnly: false,
      },
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    const title = localizedStrings.directories.headerTitle
    navigation.setOptions({
      headerTitle: () => <Text style={styles.title}>{title}</Text>,
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={styles.backButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={navigation.goBack}>
            <Icon
              type={IconType.MaterialIcons}
              name={'arrow-back'}
              color={COLORS.black}
              size={30}
            />
          </TouchableOpacity>
        )
      },
    })
  }

  onSearchPress = () => {
    this.props.navigation.push(NAVIGATORS.DIRECTORY_RESULTS_STACK.name, {
      searchRequest: this.state.searchRequest,
    })
  }

  onSearchRequestChange = (key: string, value: any) => {
    let updateSpec = {
      searchRequest: { [key]: { $set: value } },
    }

    this.setState(update(this.state, updateSpec))
  }

  render() {
    const { searchRequest } = this.state
    const localization = localizedStrings.directoriesSearch
    return (
      <KeyboardAwareScrollView
        style={styles.scrollViewContainer}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.container}>
          <View style={[styles.body]}>
            <DefaultInput
              containerStyle={styles.inputContainer}
              placeholder={localization.searchByKeyPlaceHolder}
              iconEndType={IconType.AntDesign}
              iconEndName={'search1'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              isHiddenUnderLine={true}
              isForcedHighlight={true}
              value={get(searchRequest, 'uniqueKey', '')}
              onChangeText={(text: string) =>
                this.onSearchRequestChange(
                  SEARCH_REQUEST_FIELDS.UNIQUE_KEY,
                  text,
                )
              }
            />
            <DefaultInput
              containerStyle={styles.inputContainer}
              placeholder={localization.searchByLocationPlaceHolder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'location-on'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              isHiddenUnderLine={true}
              isForcedHighlight={true}
              value={get(searchRequest, 'location', '')}
              onChangeText={(text: string) =>
                this.onSearchRequestChange(SEARCH_REQUEST_FIELDS.LOCATION, text)
              }
            />
            <DefaultPicker
              containerStyle={styles.pickerContainer}
              selectedValueStyle={styles.selectedValueStyle}
              keptHint={localization.searchByMinRatingTitle}
              hint={localization.searchByRatingPlaceHolder}
              dataSrc={ratingScore}
              iconStartType={IconType.AntDesign}
              iconStartName={'star'}
              isForcedHighlight={true}
              selectedValue={get(searchRequest, 'minRating', '')}
              onValueChangeFunc={(itemValue: ItemValue) =>
                this.onSearchRequestChange(
                  SEARCH_REQUEST_FIELDS.MIN_RATING,
                  itemValue || '',
                )
              }
            />
            <DefaultPicker
              containerStyle={styles.pickerContainer}
              selectedValueStyle={styles.selectedValueStyle}
              keptHint={localization.searchByMaxRatingTitle}
              hint={localization.searchByRatingPlaceHolder}
              dataSrc={ratingScore}
              iconStartType={IconType.AntDesign}
              iconStartName={'star'}
              isForcedHighlight={true}
              selectedValue={get(searchRequest, 'maxRating', '')}
              onValueChangeFunc={(itemValue: ItemValue) =>
                this.onSearchRequestChange(
                  SEARCH_REQUEST_FIELDS.MAX_RATING,
                  itemValue || '',
                )
              }
            />
          </View>

          <View style={[styles.footer]}>
            <DefaultCheckBox
              title={localization.highViewsOnlyCheckBoxTitle}
              isSelected={get(searchRequest, 'highViewOnly', '')}
              containerStyle={styles.checkBoxContainer}
              onValueChangeFunc={(isSelected: boolean) =>
                this.onSearchRequestChange(
                  SEARCH_REQUEST_FIELDS.HIGH_VIEW_ONLY,
                  isSelected || false,
                )
              }
            />

            <DefaultButton
              contentContainerStyle={styles.submitBtn}
              text={localization.submitBtn}
              onPress={() => this.onSearchPress()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
  },
  backButton: {
    marginEnd: 17,
    marginStart: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 18,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  inputContainer: {
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.125,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 24,
    marginVertical: 16,
  },
  pickerContainer: {
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.125,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 24,
    marginVertical: 8,
  },
  selectedValueStyle: {
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  checkBoxContainer: {
    justifyContent: 'flex-end',
  },
  submitBtn: {
    borderRadius: 12,
    margin: 24,
    height: 64,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  footer: {
    height: 180,
    flexDirection: 'column',
  },
})
export default Directories
