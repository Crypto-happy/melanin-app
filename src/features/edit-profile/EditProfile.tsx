import React from 'react'
import {
  Alert,
  Keyboard,
  Route,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { get, isEmpty } from 'lodash'
import update from 'immutability-helper'

import { RootStackParamList } from 'navigators/RootStackParamList'
import localizedStrings from 'localization'
import UserAvatar from 'components/UserAvatar'
import COLORS from '../../constants/colors'
import { DefaultButton } from 'components/DefaultButton'
import DefaultInput from 'components/DefaultInput'
import { IconType } from 'components/Icon/Icon'
import { BottomActionSheet } from 'components/bottom-action-sheet'

import { ACCOUNT_TYPE, ATTACHMENT_TYPE } from 'types'
import { UserType } from 'types/User.types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import Icon from '../../components/Icon'
import { FONT_FAMILIES } from '../../constants/fonts'
import DefaultAddTags from 'components/DefaultAddTags/DefaultAddTags'
import {
  emailPattern,
  phoneNumberPattern,
  urlPattern,
  usernamePattern,
} from 'utils/patterns'
import ProgressModal from 'components/ProgressModal'
import InfoModal from 'components/InfoModal'
import DefaultPicker from 'components/DefaultPicker'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'
import defaultWorkingHours from '/assets/data/working-hour.json'
import DefaultDateTimePicker from '../../components/DefaultDateTimePicker'
import moment from 'moment'

type EditProfileRouteProp = RouteProp<RootStackParamList, 'EditProfile'>

interface Props extends Route {
  route: EditProfileRouteProp
  updateProfile: (
    newInfo: any,
    attachment: any,
    uploadProgressHandler: (event: ProgressEvent) => void,
  ) => void
  removeAuth: () => void
  reset: () => void
  countries: any[]
  states: any[]
  cities: any[]
  loading: boolean
  success: boolean
  error: boolean
  subCategoriesById: { [key: string]: any }
  getCountries: () => void
  getStates: (countryId: number) => void
  getCities: (stateId: number) => void
}

interface State {
  uploaded: number
  previousProfile: UserType
  allCategory: []
  showAddAttachmentActionSheet: boolean
  pickedNewPhoto?: any
  showWarningLogout: boolean
  subCategoryList: []
  showWarningUpdateSuccessful: boolean
  showWarningUpdateFailure: boolean
  userInput: { [key: string]: any }
  errorInput: { [key: string]: boolean }
  hasChangedField: {
    avatar: boolean
    email: boolean
    username: boolean
    theRest: boolean
  }
  selectedCity: any
  selectedState: any
}

const INPUT_FIELDS = {
  EMAIL_ID: 'email id',
  EMAIL: 'email',
  USERNAME: 'username',
  FULL_NAME: 'fullName',
  BUSINESS_NAME: 'businessName',
  YEAR_FOUNDED: 'yearFounded',
  LOCATION: 'location',
  ADDRESS_1: 'addressOne',
  ADDRESS_2: 'addressTwo',
  CITY: 'city',
  STATE: 'state',
  COUNTRY: 'country',
  ZIP_CODE: 'zipCode',
  PHONE_NUMBER: 'phoneNo',
  DESCRIPTION: 'description',
  ABOUT_CEO: 'aboutCEO',
  LINKEDIN: 'linkedInId',
  CATEGORIES: 'category',
  SUB_CATEGORIES: 'subCategory',
  WEBSITE: 'website',
  TAG_CODE: 'tagCodes',
  COMPANY: 'company',
  YOUTUBE: 'youtubeUserId',
  INSTAGRAM: 'instagramUserId',
  FACEBOOK: 'facebookUserId',
  TWITTER: 'twitterUserId',
  WORKING_HOUR: 'workingHours',
}

class EditProfile extends React.Component<Props, State> {
  private readonly addAttachmentOptions: any[]

  static defaultProps = {}

  constructor(props: Props) {
    super(props)

    const previousProfile = props.route.params.profile
    const allCategory = props.route.params.allCategory
    const subCategoriesById = props.subCategoriesById

    let categoryId: any = get(previousProfile, 'subCategory.categoryId', '')
    let category = get(allCategory, `${categoryId}`, [])
    const subCategoryIdList = get(category, 'subCategories', [])
    const subCategoryList = subCategoryIdList.map(
      (id: string) => subCategoriesById[id],
    )

    this.state = {
      uploaded: 0,
      previousProfile,
      allCategory,
      subCategoryList,
      showAddAttachmentActionSheet: false,
      showWarningLogout: false,
      showWarningUpdateSuccessful: false,
      showWarningUpdateFailure: false,
      userInput: {
        email: get(previousProfile, 'email', ''),
        username: get(previousProfile, 'username', ''),
        fullName: get(previousProfile, 'name', ''),
        location: get(previousProfile, 'location', ''),
        yearFounded: get(previousProfile, 'yearFounded', {}),
        addressOne: get(previousProfile, 'addressOne', ''),
        addressTwo: get(previousProfile, 'addressTwo', ''),
        city: get(previousProfile, 'city', ''),
        state: get(previousProfile, 'state', ''),
        zipCode: get(previousProfile, 'zipCode', ''),
        phoneNo: get(previousProfile, 'phoneNumber', ''),
        website: get(previousProfile, 'website', ''),
        tagCodes: get(previousProfile, 'tagCodes', []),
        company: get(previousProfile, 'company', ''),
        avatarUrl: get(previousProfile, 'avatar', ''),
        description: get(previousProfile, 'description', ''),
        category,
        subCategory: get(previousProfile, 'subCategory', {}),
        aboutCEO: get(previousProfile, 'aboutCEO', ''),
        linkedInId: get(previousProfile, 'linkedInId', ''),
        youtubeUserId: get(previousProfile, 'youtubeUserId', ''),
        instagramUserId: get(previousProfile, 'instagramUserId', ''),
        facebookUserId: get(previousProfile, 'facebookUserId', ''),
        twitterUserId: get(previousProfile, 'twitterUserId', ''),
        workingHours: get(previousProfile, 'workingHours', []),
      },
      errorInput: {
        email: false,
        username: false,
        fullName: false,
        location: false,
        addressOne: false,
        addressTwo: false,
        city: false,
        state: false,
        zipCode: false,
        phoneNo: false,
        description: false,
        aboutCEO: false,
        linkedInId: false,
        website: false,
        company: false,
      },
      hasChangedField: {
        avatar: false,
        email: false,
        username: false,
        theRest: false,
      },
      selectedCity: null,
      selectedState: null,
    }

    this.addAttachmentOptions = [
      {
        text: localizedStrings.newPost.attachment.options.selectPhoto,
        onPress: () => this.onAddAttachmentOptionPress(1),
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'photo-library'}
            color={COLORS.easternBlue}
            size={20}
          />
        ),
      },
      {
        text: localizedStrings.newPost.attachment.options.takePhoto,
        onPress: () => this.onAddAttachmentOptionPress(2),
        renderIcon: () => (
          <Icon
            type={IconType.Entypo}
            name={'camera'}
            color={COLORS.oceanGreen}
            size={20}
          />
        ),
      },
    ]
  }

  componentWillUnmount() {
    const { reset } = this.props
    reset && reset()
  }

  componentDidMount() {
    const { getCountries } = this.props
    if (this.state.userInput.workingHours.length <= 0) {
      this.state.userInput.workingHours = defaultWorkingHours
    }

    getCountries && getCountries()

    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.onPressUpdateProfile}>
          <Text style={styles.submitButtonLabel}>
            {localizedStrings.editProfile.submitForm}
          </Text>
        </TouchableOpacity>
      ),
    })
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.loading || this.props.loading) {
      return
    }

    if (this.props.error) {
      this.setState({
        showWarningLogout: false,
        showWarningUpdateSuccessful: false,
        showWarningUpdateFailure: true,
      })
    }

    if (this.props.success) {
      const { hasChangedField } = this.state

      if (hasChangedField.email || hasChangedField.username) {
        this.setState({
          showWarningLogout: true,
          showWarningUpdateSuccessful: false,
          showWarningUpdateFailure: false,
        })
      } else {
        this.setState({
          showWarningLogout: false,
          showWarningUpdateSuccessful: true,
          showWarningUpdateFailure: false,
        })
      }
    }
  }

  uploadProgressHandler = (event: ProgressEvent) => {
    const { loaded, total } = event

    this.setState({
      uploaded: loaded / total,
    })
  }

  onPressUpdateProfile = async () => {
    const localization = localizedStrings.editProfile

    const {
      errorInput,
      hasChangedField,
      pickedNewPhoto,
      userInput,
      selectedState,
      selectedCity,
    } = this.state

    if (!hasChangedField.avatar && !hasChangedField.theRest) {
      return Alert.alert(
        localization.alert.noChangeTitle,
        localization.alert.noChangeContent,
      )
    }

    let hasError = false
    Object.keys(errorInput).forEach((inputKey: string) => {
      if (errorInput[inputKey]) {
        hasError = true
      }
    })

    if (hasError) {
      return Alert.alert(
        localization.alert.hasErrorTitle,
        localization.alert.hasErrorContent,
      )
    }

    let attachment = null
    if (hasChangedField.avatar) {
      attachment = {
        type: ATTACHMENT_TYPE.PHOTO,
        source: pickedNewPhoto.path,
        mime: pickedNewPhoto.mime,
        fileName:
          pickedNewPhoto.filename ||
          this.getFileNameFromPath(pickedNewPhoto.path),
      }
    }

    let newInfo: any = {
      ...userInput,
      changedFields: {
        ...hasChangedField,
      },
    }

    const { updateProfile } = this.props

    let newLocation = ''
    if (!isEmpty(newInfo.addressOne)) {
      newLocation = String(newInfo.addressOne)
    }
    if (!isEmpty(newInfo.addressTwo)) {
      newLocation += ` ${newInfo.addressTwo}`
    }
    if (!isEmpty(selectedCity)) {
      newLocation += ` ${selectedCity.name}`
    }
    if (!isEmpty(selectedState)) {
      newLocation += ` ${selectedState.name}`
    }
    if (!isEmpty(newInfo.zipCode)) {
      newLocation += ` ${newInfo.zipCode}`
    }

    newInfo.location = newLocation

    if (!isEmpty(userInput.subCategory)) {
      newInfo.subCategoryId = userInput.subCategory._id
    }
    delete newInfo.category
    delete newInfo.subCategory

    updateProfile &&
      updateProfile(newInfo, attachment, this.uploadProgressHandler)
  }

  getFileNameFromPath = (path: string) => {
    const split = path.split('/')
    return split[split.length - 1]
  }

  onPressUploadAvatarButton = () => {
    this.setState({ showAddAttachmentActionSheet: true })
  }

  onAddAttachmentOverlayPress = () => {
    this.setState({
      showAddAttachmentActionSheet: false,
    })
  }

  onAddAttachmentOptionPress = (option: number) => {
    switch (option) {
      case 1:
        return ImagePicker.openPicker({
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
          compressImageMaxWidth: 1200,
          compressImageMaxHeight: 1200,
          compressImageQuality: 0.8,
          freeStyleCropEnabled: true,
          cropperToolbarColor: COLORS.white,
          cropperTintColor: COLORS.cornFlowerBlue,
          cropperActiveWidgetColor: COLORS.cornFlowerBlue,
        }).then((image) => {
          this.setState(
            update(this.state, {
              pickedNewPhoto: { $set: image },
              hasChangedField: {
                avatar: { $set: true },
              },
              showAddAttachmentActionSheet: { $set: false },
            }),
          )
        })

      case 2:
        return ImagePicker.openCamera({
          cropping: true,
          cropperCircleOverlay: true,
          compressImageQuality: 0.8,
          compressImageMaxWidth: 1200,
          compressImageMaxHeight: 1200,
          freeStyleCropEnabled: true,
          cropperToolbarColor: COLORS.white,
          cropperTintColor: COLORS.cornFlowerBlue,
          cropperActiveWidgetColor: COLORS.cornFlowerBlue,
        }).then((attachment) => {
          this.setState(
            update(this.state, {
              pickedNewPhoto: { $set: attachment },
              hasChangedField: {
                avatar: { $set: true },
              },
              showAddAttachmentActionSheet: { $set: false },
            }),
          )
        })
    }
  }

  onLogoutPress = () => {
    const { removeAuth } = this.props
    removeAuth && removeAuth()
  }

  onGoBackProfilePress = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  onPressOkayWarningFailureModal = () => {
    this.setState({ showWarningUpdateFailure: false })
  }

  validateErrorInputChange = (key: string, value: string) => {
    switch (key) {
      case INPUT_FIELDS.EMAIL:
        return isEmpty(value) || !emailPattern.test(value)

      case INPUT_FIELDS.USERNAME:
        return !isEmpty(value) && !usernamePattern.test(value)

      case INPUT_FIELDS.WEBSITE:
        return !isEmpty(value) && !urlPattern.test(value)

      case INPUT_FIELDS.PHONE_NUMBER:
        return !isEmpty(value) && !phoneNumberPattern.test(value)

      default:
        return false
    }
  }

  onUserInputChange = (key: string, value: any) => {
    let updateSpec = {
      userInput: { [key]: { $set: value } },
    }

    const hasError = this.validateErrorInputChange(key, value)
    updateSpec = Object.assign(updateSpec, {
      errorInput: { [key]: { $set: hasError } },
    })

    let hasChangedSpec = {
      theRest: { $set: true },
    }

    if (key === INPUT_FIELDS.EMAIL) {
      hasChangedSpec = Object.assign(hasChangedSpec, {
        email: { $set: value !== this.state.previousProfile.email },
      })
    } else if (key === INPUT_FIELDS.USERNAME) {
      hasChangedSpec = Object.assign(hasChangedSpec, {
        username: { $set: value !== this.state.previousProfile.username },
      })
    } else if (key === INPUT_FIELDS.CATEGORIES) {
      const { subCategoriesById } = this.props
      const { subCategories = [] } = value

      const subCategoryList = subCategories.map(
        (subCategoryId: string) => subCategoriesById[subCategoryId],
      )

      updateSpec = Object.assign(updateSpec, {
        subCategoryList: { $set: subCategoryList },
      })
    } else if (key === INPUT_FIELDS.COUNTRY) {
      const { countries, getStates } = this.props
      const country = countries.find((item: any) => item._id === value)

      if (!isEmpty(country)) {
        getStates && getStates(country.id)
      }
    } else if (key === INPUT_FIELDS.STATE) {
      const { states, getCities } = this.props
      const state = states.find((item: any) => item._id === value)

      if (!isEmpty(state)) {
        getCities && getCities(state.id)
      }

      updateSpec = Object.assign(updateSpec, {
        selectedState: { $set: state },
      })
    } else if (key === INPUT_FIELDS.CITY) {
      const { cities } = this.props
      const city = cities.find((item: any) => item._id === value)

      updateSpec = Object.assign(updateSpec, {
        selectedCity: { $set: city },
      })
    }

    updateSpec = Object.assign(updateSpec, {
      hasChangedField: hasChangedSpec,
    })

    this.setState(update(this.state, updateSpec))
  }

  onUserInputArgUpdate = (key: string, value: any) => {
    let args: Array<any> = this.state.userInput[key]
    if (key === INPUT_FIELDS.TAG_CODE && args.length >= 3) {
      return
    }

    let hasChangedSpec = {
      theRest: { $set: true },
    }

    if (key === INPUT_FIELDS.WORKING_HOUR) {
      args = args.map((item) => {
        if (item.dayOfWeek === value.dayOfWeek) {
          return value
        } else {
          return item
        }
      })
    } else {
      args.push(value)
    }
    args = [...new Set(args)]
    let updateSpec = {
      userInput: { [key]: { $set: args } },
    }

    updateSpec = Object.assign(updateSpec, {
      hasChangedField: hasChangedSpec,
    })

    this.setState(update(this.state, updateSpec))
  }

  onUserInputRemove = (key: string, value: any) => {
    let args: Array<any> = this.state.userInput[key]
    args = args.filter((item) => {
      return item !== value
    })

    let hasChangedSpec = {
      theRest: { $set: true },
    }

    args = [...new Set(args)]
    let updateSpec = {
      userInput: { [key]: { $set: args } },
    }

    updateSpec = Object.assign(updateSpec, {
      hasChangedField: hasChangedSpec,
    })
    this.setState(update(this.state, updateSpec))
  }

  onTouchAvatarSection = () => {
    Keyboard.dismiss()
    return true
  }

  render() {
    const {
      previousProfile,
      showAddAttachmentActionSheet,
      pickedNewPhoto,
      userInput,
      errorInput,
      hasChangedField,
      uploaded,
      showWarningLogout,
      showWarningUpdateSuccessful,
      showWarningUpdateFailure,
      subCategoryList,
      allCategory,
    } = this.state
    const { loading, subCategoriesById, countries, states, cities } = this.props

    const localization = localizedStrings.editProfile
    const tags = localizedStrings.newPost.tags

    const uploadProgressPercent = uploaded * 100
    let progressText = localization.updatingProfile
    if (hasChangedField.avatar) {
      progressText += `: ${uploadProgressPercent}%`
    }
    const isBusiness = previousProfile.accountType === ACCOUNT_TYPE.BUSINESS

    return (
      <View style={styles.container}>
        <View
          style={styles.avatarSection}
          onStartShouldSetResponder={this.onTouchAvatarSection}>
          <UserAvatar
            style={styles.avatar}
            imgSrc={
              isEmpty(pickedNewPhoto)
                ? previousProfile.avatar
                : pickedNewPhoto.path
            }
            heightOrWidth={120}
            isBusiness={previousProfile.accountType === ACCOUNT_TYPE.BUSINESS}
          />

          <DefaultButton
            style={styles.uploadAvatar}
            text={localization.changeAvatarButton}
            onPress={this.onPressUploadAvatarButton}
          />
        </View>

        <KeyboardAwareScrollView
          style={styles.userFormSection}
          contentContainerStyle={styles.userFormContainer}
          keyboardShouldPersistTaps={'handled'}
          scrollEnabled={true}>
          <DefaultInput
            title={localization.email}
            containerStyle={styles.inputContainer}
            placeholder={localization.email}
            iconStartType={IconType.MaterialIcons}
            iconStartName={'email'}
            autoFocus={false}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={userInput.email}
            hasError={errorInput.email}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.EMAIL, text)
            }
          />

          <DefaultInput
            title={localization.username}
            containerStyle={styles.inputContainer}
            placeholder={localization.username}
            iconStartType={IconType.MaterialCommunityIcons}
            iconStartName={'account-key'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.username}
            hasError={errorInput.username}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.USERNAME, text)
            }
          />

          <DefaultInput
            title={
              isBusiness ? localization.businessName : localization.fullName
            }
            containerStyle={styles.inputContainer}
            placeholder={localization.fullName}
            iconStartType={IconType.MaterialCommunityIcons}
            iconStartName={'account-details'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'words'}
            value={userInput.fullName}
            hasError={errorInput.fullName}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.FULL_NAME, text)
            }
          />

          {isBusiness && (
            <DefaultDateTimePicker
              title={localization.yearFounded}
              containerStyle={styles.inputContainer}
              iconStartType={IconType.Entypo}
              iconStartName={'calendar'}
              mode={'date'}
              defaultData={new Date(userInput.yearFounded.timeStamp)}
              onConfirm={(date: Date) => {
                const dateStr = moment(date).format('DD MMMM YYYY')
                const timeStamp = date.getTime()
                this.onUserInputChange(INPUT_FIELDS.YEAR_FOUNDED, {
                  dateStr: dateStr,
                  timeStamp: timeStamp,
                })
              }}
            />
          )}

          {!isBusiness && (
            <DefaultInput
              title={localization.location}
              containerStyle={styles.inputContainer}
              placeholder={localization.locationHint}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'location-on'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.location}
              hasError={errorInput.location}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.LOCATION, text)
              }
            />
          )}

          {isBusiness && (
            <DefaultInput
              title={localization.addressOne}
              containerStyle={styles.inputContainer}
              placeholder={localization.addressOneHint}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.addressOne}
              hasError={errorInput.addressOne}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.ADDRESS_1, text)
              }
            />
          )}

          {isBusiness && (
            <DefaultInput
              title={localization.addressTwo}
              containerStyle={styles.inputContainer}
              placeholder={localization.addressTwoHint}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.addressTwo}
              hasError={errorInput.addressTwo}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.ADDRESS_2, text)
              }
            />
          )}

          {isBusiness && (
            <DefaultPicker
              title={localization.country}
              dataSrc={countries}
              hint={localization.countryHint}
              containerStyle={styles.inputContainer}
              selectedValue={get(userInput, 'country', '')}
              onValueChangeFunc={(itemValue: ItemValue) =>
                this.onUserInputChange(INPUT_FIELDS.COUNTRY, itemValue || '')
              }
            />
          )}

          {isBusiness && (
            <DefaultPicker
              title={localization.state}
              dataSrc={states}
              hint={localization.stateHint}
              containerStyle={styles.inputContainer}
              selectedValue={get(userInput, 'state', '')}
              onValueChangeFunc={(itemValue: ItemValue) =>
                this.onUserInputChange(INPUT_FIELDS.STATE, itemValue || '')
              }
            />
          )}

          {isBusiness && (
            <DefaultPicker
              title={localization.city}
              dataSrc={cities}
              hint={localization.cityHint}
              containerStyle={styles.inputContainer}
              selectedValue={get(userInput, 'city', '')}
              onValueChangeFunc={(itemValue: ItemValue) =>
                this.onUserInputChange(INPUT_FIELDS.CITY, itemValue || '')
              }
            />
          )}

          {isBusiness && (
            <DefaultInput
              title={localization.zipCode}
              containerStyle={styles.inputContainer}
              placeholder={localization.zipCodeHint}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.zipCode}
              hasError={errorInput.zipCode}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.ZIP_CODE, text)
              }
            />
          )}

          <DefaultInput
            title={localization.phone}
            containerStyle={styles.inputContainer}
            placeholder={localization.phoneHint}
            iconStartType={IconType.Entypo}
            iconStartName={'phone'}
            autoFocus={false}
            keyboardType={'phone-pad'}
            autoCapitalize={'none'}
            value={userInput.phoneNo}
            hasError={errorInput.phoneNo}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.PHONE_NUMBER, text)
            }
          />

          <DefaultInput
            title={localization.description}
            containerStyle={styles.inputContainer}
            placeholder={localization.descriptionHint}
            iconStartType={IconType.MaterialCommunityIcons}
            iconStartName={'pencil'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.description}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.DESCRIPTION, text)
            }
          />

          {isBusiness && (
            <DefaultInput
              title={localization.aboutCEO}
              containerStyle={styles.inputContainer}
              placeholder={localization.aboutCEOHint}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.aboutCEO}
              hasError={errorInput.aboutCEO}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.ABOUT_CEO, text)
              }
            />
          )}

          <DefaultInput
            title={localization.linkedIn}
            containerStyle={styles.inputContainer}
            placeholder={localization.linkedIn}
            iconStartType={IconType.AntDesign}
            iconStartName={'linkedin-square'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.linkedInId}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.LINKEDIN, text)
            }
          />

          {isBusiness && (
            <DefaultPicker
              title={localization.category}
              dataSrc={Object.values(allCategory)}
              iconImageSrc={require('../../assets/images/icon-category.png')}
              hint={localization.categoryHint}
              containerStyle={styles.inputContainer}
              selectedValue={get(userInput, 'category._id', '')}
              onValueChangeFunc={(itemValue: ItemValue) => {
                const category = get(allCategory, itemValue, {})
                this.onUserInputChange(INPUT_FIELDS.CATEGORIES, category)
              }}
            />
          )}

          {isBusiness && (
            <DefaultPicker
              title={localization.subCategory}
              iconImageSrc={require('../../assets/images/icon-subcategory.png')}
              dataSrc={subCategoryList}
              hint={localization.subCategoryHint}
              containerStyle={styles.inputContainer}
              selectedValue={get(userInput, 'subCategory._id', '')}
              onValueChangeFunc={(itemValue: ItemValue) => {
                const subCategory = get(subCategoriesById, itemValue, {})
                this.onUserInputChange(INPUT_FIELDS.SUB_CATEGORIES, subCategory)
              }}
            />
          )}

          {isBusiness && (
            <DefaultAddTags
              title={localization.tag}
              placeholder={localization.tagsHint}
              iconStartType={IconType.FontAwesome}
              endText={tags.addButton}
              endTextStyle={styles.endTextInput}
              iconStartName={'tag'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              tagCodes={userInput.tagCodes}
              onAddedFunc={(tagCode: string) =>
                this.onUserInputArgUpdate(INPUT_FIELDS.TAG_CODE, tagCode)
              }
              onRemovedFunc={(tagCode: string) =>
                this.onUserInputRemove(INPUT_FIELDS.TAG_CODE, tagCode)
              }
            />
          )}

          <DefaultInput
            title={localization.website}
            containerStyle={styles.inputContainer}
            placeholder={localization.website}
            iconStartType={IconType.MaterialCommunityIcons}
            iconStartName={'web'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.website}
            hasError={errorInput.website}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.WEBSITE, text)
            }
          />

          {isBusiness && (
            <DefaultInput
              title={localization.company}
              containerStyle={styles.inputContainer}
              placeholder={localization.company}
              iconStartType={IconType.MaterialCommunityIcons}
              iconStartName={'office-building'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.company}
              hasError={errorInput.company}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.COMPANY, text)
              }
            />
          )}

          <DefaultInput
            title={localization.youtube}
            containerStyle={styles.inputContainer}
            placeholder={localization.youtube}
            iconStartType={IconType.AntDesign}
            iconStartName={'youtube'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.youtubeUserId}
            // hasError={errorInput.website}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.YOUTUBE, text)
            }
          />

          <DefaultInput
            title={localization.instagram}
            containerStyle={styles.inputContainer}
            placeholder={localization.instagram}
            iconStartType={IconType.AntDesign}
            iconStartName={'instagram'}
            autoFocus={false}
            keyboardType={'default'}
            autoCapitalize={'none'}
            value={userInput.instagramUserId}
            // hasError={errorInput.website}
            onChangeText={(text: string) =>
              this.onUserInputChange(INPUT_FIELDS.INSTAGRAM, text)
            }
          />

          {isBusiness && (
            <DefaultInput
              title={localization.facebook}
              containerStyle={styles.inputContainer}
              placeholder={localization.facebook}
              iconStartType={IconType.AntDesign}
              iconStartName={'facebook-square'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.facebookUserId}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.FACEBOOK, text)
              }
            />
          )}

          {isBusiness && (
            <DefaultInput
              title={localization.twitter}
              containerStyle={styles.inputContainer}
              placeholder={localization.twitter}
              iconStartType={IconType.Entypo}
              iconStartName={'twitter'}
              autoFocus={false}
              keyboardType={'default'}
              autoCapitalize={'none'}
              value={userInput.twitterUserId}
              // hasError={errorInput.website}
              onChangeText={(text: string) =>
                this.onUserInputChange(INPUT_FIELDS.TWITTER, text)
              }
            />
          )}

          {isBusiness && (
            <View>
              <Text style={styles.workingHoursTitle}>
                {localization.workingHours?.toUpperCase()}
              </Text>
              <View style={styles.workingHoursSubTitleContainer}>
                <Text style={styles.workingHoursSubTitle} />
                <Text style={styles.workingHoursSubTitle}>
                  {localization.opening?.toUpperCase()}
                </Text>
                <Text style={styles.workingHoursSubTitle}>
                  {localization.closing?.toUpperCase()}
                </Text>
              </View>
              {userInput.workingHours.map((workingHour: any) => {
                return (
                  <View
                    key={workingHour.dayOfWeek}
                    style={styles.userInfoContainer}>
                    <Text
                      style={[
                        styles.userInfoChild,
                        { color: COLORS.cornFlowerBlue },
                      ]}>
                      {workingHour.dayOfWeek}
                    </Text>
                    <DefaultDateTimePicker
                      containerStyle={styles.userInfoChild}
                      defaultData={workingHour.opening}
                      mode={'time'}
                      onConfirm={(date: Date) => {
                        const opening = moment(date).format('hh:mma')
                        this.onUserInputArgUpdate(INPUT_FIELDS.WORKING_HOUR, {
                          dayOfWeek: workingHour.dayOfWeek,
                          opening: opening,
                          closing: workingHour.closing,
                        })
                      }}
                    />
                    <DefaultDateTimePicker
                      containerStyle={styles.userInfoChild}
                      defaultData={workingHour.closing}
                      mode={'time'}
                      onConfirm={(date: Date) => {
                        const closing = moment(date).format('hh:mma')
                        this.onUserInputArgUpdate(INPUT_FIELDS.WORKING_HOUR, {
                          dayOfWeek: workingHour.dayOfWeek,
                          opening: workingHour.opening,
                          closing: closing,
                        })
                      }}
                    />
                  </View>
                )
              })}
            </View>
          )}
        </KeyboardAwareScrollView>

        <BottomActionSheet
          isShowing={showAddAttachmentActionSheet}
          actions={this.addAttachmentOptions}
          onOverlayPress={this.onAddAttachmentOverlayPress}
        />

        <ProgressModal
          visible={loading}
          text={progressText}
          progress={uploaded}
        />

        <InfoModal
          visible={showWarningUpdateFailure}
          title={localization.alert.updatedFailureTitle}
          message={localization.alert.updatedFailureContent}
          onOkButtonPress={this.onPressOkayWarningFailureModal}
        />

        <InfoModal
          visible={showWarningUpdateSuccessful}
          title={localization.alert.updateSuccessfulTitle}
          message={localization.alert.updateSuccessfulContent}
          onOkButtonPress={this.onGoBackProfilePress}
        />

        <InfoModal
          visible={showWarningLogout}
          title={localization.alert.updateSuccessfulTitle}
          message={localization.alert.updateSuccessfulAndLogoutContent}
          onOkButtonPress={this.onLogoutPress}
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
  submitButton: {
    paddingHorizontal: 16,
  },
  submitButtonLabel: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cornFlowerBlue,
  },
  avatarSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 16,
  },
  avatar: {},
  uploadAvatar: {
    marginTop: 8,
  },
  userFormSection: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  userFormContainer: {
    paddingBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  endTextInput: {
    color: COLORS.cornFlowerBlue,
  },
  workingHoursSubTitleContainer: {
    marginTop: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    backgroundColor: COLORS.lightSilver,
  },
  userInfoContainer: {
    marginTop: 8,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  workingHoursTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.silver,
    fontSize: 15,
  },
  workingHoursSubTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
    flex: 1,
    fontSize: 13,
  },
  userInfoChild: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    color: COLORS.black,
    flex: 1,
    includeFontPadding: false,
    alignSelf: 'center',
    fontSize: 15,
  },
})

export default EditProfile
