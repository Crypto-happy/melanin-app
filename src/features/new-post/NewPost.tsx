import React from 'react'
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import localizedStrings from 'localization'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'
import {
  NEW_POST_MODE,
  POST_TYPE,
  POST_VISIBILITY,
  VIDEO_MAXIMUM_LENGTH,
  VIDEO_PREVIEW_MAX_SIZE,
} from 'constants'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import { BottomActionSheet } from 'components/bottom-action-sheet'
import Tag from 'components/Tag'
import { get, head, isEmpty, round } from 'lodash'
import { ACCOUNT_TYPE, ATTACHMENT_TYPE } from 'types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import { getFileNameFromPath, getVisibilityString } from 'utils'
import InfoModal from 'components/InfoModal'
import { NAVIGATORS } from 'constants/navigators'
import ProgressModal from 'components/ProgressModal'
import { getScreenOptions } from 'utils/navigation'
import DefaultInput from 'components/DefaultInput'
import ImageGallery from 'components/ImageGallery'
import { Picker } from '@react-native-picker/picker'
import VideoPlayer from 'components/VideoPlayer'
import RNPickerSelect from 'react-native-picker-select'
import { getLinkPreview } from 'link-preview-js'
import TrimmerManager from '../../utils/TrimmerManager'
const linkify = require('linkify-it')()

const DESKTOP_BROWSER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x338.png?text=No%20Image'

interface Props {
  navigation: any
  fetchProductCategories: () => void
  submitPost: (
    post: any,
    uploadProgressHandler?: (event: ProgressEvent) => void,
  ) => void
  loading: boolean
  success: boolean
  updatePost: (
    post: any,
    uploadProgressHandler: (event: ProgressEvent) => void,
  ) => void
  currentUser: any
}

interface State {
  visibility: POST_VISIBILITY
  showVisibilityActionSheet: boolean
  tags: string[]
  tagText: string
  pickedAttachments: any
  attachmentType: ATTACHMENT_TYPE | null
  showAddAttachmentActionSheet: boolean
  description: string
  showSuccessModal: boolean
  uploaded: number
  descriptionWidth: string
  attachmentChanged: boolean
  showBusinessFields: boolean
  productInfo: any
  success_type: boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

class NewPost extends React.Component<Props, State> {
  private visibilityOptions: any[]
  private addAttachmentOptions: any[]
  private trimmedVideoSource: string | null
  private mode: NEW_POST_MODE
  private detectLinkTimeout: number | null

  constructor(props: Props) {
    super(props)

    const params = this.props.route.params
    this.mode = get(params, 'mode', NEW_POST_MODE.CREATE)
    let post = get(params, 'post')
    const attachments = [...get(post, 'attachments', [])]

    if (!isEmpty(post) && !isEmpty(post.attachments)) {
      delete post.attachments
    }

    let attachmentType = ATTACHMENT_TYPE.PHOTO
    if (
      attachments.length === 1 &&
      attachments[0].type === ATTACHMENT_TYPE.VIDEO
    ) {
      attachmentType = ATTACHMENT_TYPE.VIDEO
    }

    let productInfo = {
      name: '',
      price: '',
      salePrice: '',
      link: '',
      productCategory: '',
      productCategoryName: '',
    }

    const isProduct =
      post && post.type === POST_TYPE.PRODUCT && !isEmpty(post.product)

    if (post && isProduct) {
      productInfo = {
        ...post.product,
        price: post.product.price.toString(),
        salePrice: post.product.salePrice
          ? post.product.salePrice.toString()
          : '',
      }
    }

    this.state = {
      visibility: get(post, 'visibility', POST_VISIBILITY.PUBLIC),
      showVisibilityActionSheet: false,
      tags: get(post, 'tags', []),
      tagText: '',
      pickedAttachments: attachments,
      attachmentType: attachmentType,
      showAddAttachmentActionSheet: false,
      description: get(post, 'text', ''),
      showSuccessModal: false,
      uploaded: 0,
      descriptionWidth: '99%',
      attachmentChanged: false,
      showBusinessFields: isProduct && this.mode === NEW_POST_MODE.EDIT,
      productInfo,
      success_type: false,
    }

    this.trimmedVideoSource = null

    this.visibilityOptions = [
      {
        text: getVisibilityString(POST_VISIBILITY.PUBLIC),
        onPress: () => this.onVisibilityOptionSelect(POST_VISIBILITY.PUBLIC),
        renderIcon: () => (
          <Icon
            type={IconType.MaterialCommunityIcons}
            name={'earth'}
            color={COLORS.black}
            size={20}
          />
        ),
      },
      {
        text: getVisibilityString(POST_VISIBILITY.FRIENDS),
        onPress: () => this.onVisibilityOptionSelect(POST_VISIBILITY.FRIENDS),
        renderIcon: () => (
          <Icon
            type={IconType.Ionicons}
            name={'md-people'}
            color={COLORS.black}
            size={20}
          />
        ),
      },
      {
        text: getVisibilityString(POST_VISIBILITY.ONLY_ME),
        onPress: () => this.onVisibilityOptionSelect(POST_VISIBILITY.ONLY_ME),
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'lock'}
            color={COLORS.black}
            size={20}
          />
        ),
      },
    ]

    this.addAttachmentOptions = [
      {
        text: localizedStrings.newPost.attachment.options.selectPhoto,
        onPress: () => this.onAddAttachmentOptionPress(0),
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
        text: localizedStrings.newPost.attachment.options.selectVideo,
        onPress: () => this.onAddAttachmentOptionPress(1),
        renderIcon: () => (
          <Icon
            type={IconType.Entypo}
            name={'video'}
            color={COLORS.coral}
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
      {
        text: localizedStrings.newPost.attachment.options.recordVideo,
        onPress: () => this.onAddAttachmentOptionPress(3),
        renderIcon: () => (
          <Icon
            type={IconType.Entypo}
            name={'video-camera'}
            color={COLORS.coral}
            size={20}
          />
        ),
      },
    ]
  }

  onVisibilityOptionSelect = (visibility: POST_VISIBILITY) => {
    this.setState({
      visibility,
      showVisibilityActionSheet: false,
    })
  }

  componentDidMount() {
    this.setState({ success_type: false })
    this.props.fetchProductCategories()

    const options = {
      title:
        this.mode === NEW_POST_MODE.CREATE
          ? localizedStrings.newPost.title
          : localizedStrings.newPost.titleEdit,
      showBackButton: false,
      showLogo: false,
    }
    this.props.navigation.setOptions({
      ...getScreenOptions(options),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              this.props.navigation.goBack()
            }}>
            <Text style={styles.uploadButtonText}>
              {localizedStrings.newPost.cancelButton}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={this.submitPost}>
            <Text style={styles.uploadButtonText}>
              {this.mode === NEW_POST_MODE.CREATE
                ? localizedStrings.newPost.submitButton
                : localizedStrings.newPost.updateButton}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    })

    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.setState({
          descriptionWidth: '100%',
        })
      }, 100)
    }
  }

  validateAll = () => {
    const { description, pickedAttachments, showBusinessFields, productInfo } =
      this.state

    if (isEmpty(description) && isEmpty(pickedAttachments)) {
      return false
    }

    if (showBusinessFields) {
      const { name, price } = productInfo
      if (isEmpty(name) || isEmpty(price) || isEmpty(pickedAttachments)) {
        return false
      }
    }

    return true
  }

  uploadProgressHandler = (event: ProgressEvent) => {
    const { loaded, total } = event
    this.setState({
      uploaded: loaded / total,
    })
  }

  validateVideoLength = (video: any) => {
    const { duration } = video || {}
    const durationInSecond = duration && duration / 1000
    if (durationInSecond && durationInSecond <= VIDEO_MAXIMUM_LENGTH) {
      return true
    }
    Alert.alert(
      'Failed',
      `${localizedStrings.commonErrors.exceedVideoLengthFirstText} ${VIDEO_MAXIMUM_LENGTH} ${localizedStrings.commonErrors.exceedVideoLengthSecondText}`,
    )
    return false
  }

  submitPost = async () => {
    this.setState({ success_type: true })

    if (!this.validateAll()) {
      return Alert.alert('Failed', 'Please fill in required fields')
    }

    const {
      attachmentType,
      description,
      visibility,
      tags,
      pickedAttachments,
      attachmentChanged,
      showBusinessFields,
      productInfo,
    } = this.state

    const post = {
      text: description,
      visibility,
      tags,
      type: showBusinessFields ? POST_TYPE.PRODUCT : POST_TYPE.NORMAL,
    }

    if (showBusinessFields) {
      post.productInfo = { ...productInfo }
    }

    if (
      attachmentChanged &&
      !isEmpty(pickedAttachments) &&
      attachmentType === ATTACHMENT_TYPE.VIDEO
    ) {
      const videoAttachment = head(pickedAttachments)
      const source =
        this.trimmedVideoSource ||
        videoAttachment.sourceURL ||
        videoAttachment.path

      if (!this.validateVideoLength(videoAttachment)) {
        return
      }
      const previewImage = await this.getPreviewImage(source)
      post.attachments = [
        {
          type: ATTACHMENT_TYPE.VIDEO,
          source,
          mime: videoAttachment.mime,
          fileName:
            videoAttachment.filename ||
            getFileNameFromPath(videoAttachment.path),
          preview: previewImage,
        },
      ]
    }

    if (
      attachmentChanged &&
      !isEmpty(pickedAttachments) &&
      attachmentType === ATTACHMENT_TYPE.PHOTO
    ) {
      post.attachments = pickedAttachments.map((pickedAttachment) => ({
        type: ATTACHMENT_TYPE.PHOTO,
        source: pickedAttachment.path,
        mime: pickedAttachment.mime,
        fileName:
          pickedAttachment.filename ||
          getFileNameFromPath(pickedAttachment.path),
      }))
    }

    if (
      attachmentChanged &&
      !isEmpty(pickedAttachments) &&
      attachmentType === ATTACHMENT_TYPE.LINK
    ) {
      post.attachments = pickedAttachments
    }

    if (attachmentChanged && isEmpty(pickedAttachments)) {
      post.attachments = []
    } else if (
      !isEmpty(pickedAttachments) &&
      !isEmpty(get(pickedAttachments, '[0]._id', ''))
    ) {
      post.attachments = pickedAttachments
    }

    this.setState({
      uploaded: 0,
    })

    if (this.mode === NEW_POST_MODE.CREATE) {
      this.props.submitPost(post, this.uploadProgressHandler)
    } else {
      post.id = this.props.route.params.post._id
      this.props.updatePost(post, this.uploadProgressHandler)
    }
  }

  getPreviewImage = (source: string | number): Promise<number> => {
    const maximumSize = {
      width: VIDEO_PREVIEW_MAX_SIZE,
      height: VIDEO_PREVIEW_MAX_SIZE,
    }
    const param = { source, second: 1, maximumSize, format: 'JPEG' }

    return new Promise((resolve) => {
      TrimmerManager.getThumbnail(param)
        .then((data) => {
          const { image = {} } = data || {}
          resolve(image.uri)
        })
        .catch((error) => {})
    })
  }

  onVisibilityPress = () => {
    this.setState({
      showVisibilityActionSheet: true,
    })
  }

  onVisibilityOverlayPress = () => {
    this.setState({
      showVisibilityActionSheet: false,
    })
  }

  onAddTagButtonPress = () => {
    if (isEmpty(this.state.tagText)) {
      return
    }

    this.setState((prevState) => ({
      tags: [...prevState.tags, prevState.tagText],
      tagText: '',
    }))
  }

  onRemoveTagPress = (text: string) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((tag) => tag !== text),
    }))
  }

  onTagInputTextChange = (text: string) => {
    this.setState({
      tagText: text,
    })
  }

  onAddAttachmentPress = () => {
    this.setState({
      showAddAttachmentActionSheet: true,
    })
  }

  onRemoveAttachmentButtonPress = () => {
    this.setState({
      pickedAttachments: [],
      attachmentType: null,
      attachmentChanged: true,
    })
  }

  onVideoSourceChange = (source: string) => {
    this.trimmedVideoSource = source
  }

  renderAttachmentsPreview = (
    attachments: any,
    attachmentType: string | null,
  ) => {
    const images = attachments.map((attachment: any) =>
      attachmentType === ATTACHMENT_TYPE.LINK
        ? attachment.previewUrl || attachment.url
        : attachment.path || attachment.url,
    )
    let videoUrl =
      Platform.OS === 'ios' ? attachments[0].sourceURL : attachments[0].path

    if (this.mode === NEW_POST_MODE.EDIT) {
      videoUrl = attachments[0].url
    }

    return (
      <View style={styles.attachmentPreview}>
        {attachmentType === ATTACHMENT_TYPE.PHOTO ? (
          <ImageGallery images={images} />
        ) : attachmentType === ATTACHMENT_TYPE.LINK ? (
          <>
            <ImageGallery images={images} />
            <Text style={styles.attachmentTitle}>
              {get(attachments, '[0].title')}
            </Text>
            <Text style={styles.attachmentDescription}>
              {get(attachments, '[0].description')}
            </Text>
          </>
        ) : (
          <VideoPlayer
            source={{ uri: videoUrl }}
            style={styles.videoPreview}
            isViewable={true}
            resizeMode={'contain'}
            shouldShowPreview={false}
          />
        )}
        <TouchableOpacity
          style={styles.removeAttachmentButton}
          hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
          onPress={this.onRemoveAttachmentButtonPress}>
          <Icon
            type={IconType.Ionicons}
            name={'md-close'}
            color={COLORS.white}
            size={30}
          />
        </TouchableOpacity>
      </View>
    )
  }

  onAddAttachmentOverlayPress = () => {
    this.setState({
      showAddAttachmentActionSheet: false,
    })
  }

  onAddAttachmentOptionPress = (option: number) => {
    switch (option) {
      case 0:
        return ImagePicker.openPicker({
          cropping: true,
          mediaType: 'photo',
          width: 1200,
          height: 1200,
          compressImageMaxWidth: 1200,
          compressImageMaxHeight: 1200,
          compressImageQuality: 0.8,
          freeStyleCropEnabled: true,
          cropperToolbarColor: COLORS.white,
          cropperTintColor: COLORS.cornFlowerBlue,
          cropperActiveWidgetColor: COLORS.cornFlowerBlue,
          multiple: true,
          maxFiles: 4,
        }).then((images) => {
          this.setState({
            pickedAttachments: images,
            attachmentType: ATTACHMENT_TYPE.PHOTO,
            showAddAttachmentActionSheet: false,
            attachmentChanged: true,
          })
        })
      case 1:
        return ImagePicker.openPicker({
          mediaType: 'video',
        }).then((video) => {
          if (this.validateVideoLength(video)) {
            this.setState({
              pickedAttachments: [video],
              attachmentType: ATTACHMENT_TYPE.VIDEO,
              showAddAttachmentActionSheet: false,
              attachmentChanged: true,
            })
          }
        })
      case 2:
        return ImagePicker.openCamera({
          cropping: true,
          compressImageQuality: 0.8,
          width: 1200,
          height: 1200,
          compressImageMaxWidth: 1200,
          compressImageMaxHeight: 1200,
          freeStyleCropEnabled: true,
          cropperToolbarColor: COLORS.white,
          cropperTintColor: COLORS.cornFlowerBlue,
          cropperActiveWidgetColor: COLORS.cornFlowerBlue,
        }).then((attachment) => {
          this.setState({
            pickedAttachments: [attachment],
            attachmentType: ATTACHMENT_TYPE.PHOTO,
            showAddAttachmentActionSheet: false,
            attachmentChanged: true,
          })
        })
      case 3:
        return ImagePicker.openCamera({
          includeBase64: true,
          mediaType: 'video',
        }).then((attachment) => {
          this.setState({
            pickedAttachments: [attachment],
            attachmentType: ATTACHMENT_TYPE.VIDEO,
            showAddAttachmentActionSheet: false,
            attachmentChanged: true,
          })
        })
    }
  }

  detectLink = async (text: string) => {
    if (
      !isEmpty(this.state.pickedAttachments) &&
      get(this.state.pickedAttachments, '[0].type') !== ATTACHMENT_TYPE.LINK
    ) {
      return
    }
    const urls = linkify.match(text)
    const url = get(urls, '[0].url')
    if (url && url !== get(this.state.pickedAttachments, '[0].url')) {
      const data = await getLinkPreview(url, {
        headers: {
          'user-agent': DESKTOP_BROWSER_AGENT,
        },
      })
      const title = get(data, 'title')
      const description = get(data, 'description')
      const image = get(data, 'images[0]') || PLACEHOLDER_IMAGE
      this.setState({
        pickedAttachments: [
          {
            type: ATTACHMENT_TYPE.LINK,
            url,
            title,
            description,
            previewUrl: image,
          },
        ],
        attachmentType: ATTACHMENT_TYPE.LINK,
        attachmentChanged: true,
      })
    }
  }

  onDescriptionTextChange = (text: string) => {
    this.setState({
      description: text,
    })

    if (this.detectLinkTimeout) {
      clearTimeout(this.detectLinkTimeout)
      this.detectLinkTimeout = null
    }

    this.detectLinkTimeout = setTimeout(() => {
      this.detectLink(text)
    }, 1000)
  }

  resetAll = () => {
    this.setState({
      description: '',
      attachmentType: ATTACHMENT_TYPE.PHOTO,
      pickedAttachments: [],
      tags: [],
      visibility: POST_VISIBILITY.PUBLIC,
      productInfo: {
        name: '',
        price: '',
        salePrice: '',
        link: '',
        productCategory: '',
        productCategoryName: '',
      },
    })
  }

  componentDidUpdate(prevProps: Props) {
    const { loading } = prevProps
    const { loading: currentLoading, success: currentSuccess } = this.props
    const { success_type } = this.state
    if (success_type) {
      if (!currentLoading && loading !== currentLoading && currentSuccess) {
        this.resetAll()
        this.setState({ showSuccessModal: true })
      }
    }
  }

  onSuccessModalOkPress = () => {
    this.setState({ success_type: false })

    this.setState(
      {
        showSuccessModal: false,
      },
      () => {
        this.props.navigation.navigate(NAVIGATORS.HOME.name)
      },
    )
  }

  onBusinessSwitchValueChange = (value: boolean) => {
    this.setState({
      showBusinessFields: value,
    })
  }

  onProductNameTextChanged = (text: string) => {
    this.setState((prevState) => ({
      productInfo: {
        ...prevState.productInfo,
        name: text,
      },
    }))
  }

  onProductPriceTextChanged = (text: string) => {
    if (isNaN(text)) {
      return
    }

    this.setState((prevState) => ({
      productInfo: {
        ...prevState.productInfo,
        price: text,
      },
    }))
  }

  onProductSalePriceTextChanged = (text: string) => {
    if (isNaN(text)) {
      return
    }

    this.setState((prevState) => ({
      productInfo: {
        ...prevState.productInfo,
        salePrice: text,
      },
    }))
  }

  onProductLinkTextChanged = (text: string) => {
    this.setState((prevState) => ({
      productInfo: {
        ...prevState.productInfo,
        link: text,
      },
    }))
  }

  handlepropertystate = (productCategory: any) => {
    let { productInfo } = this.state
    productInfo.productCategory = productCategory
    const { p_categories } = this.props

    let category = p_categories.find(
      (category) => category._id === productCategory,
    )
    if (category) {
      productInfo.productCategoryName = category.name
    }

    this.setState({ productInfo })
  }

  render() {
    const { p_categories, loading, currentUser } = this.props

    if (isEmpty(currentUser)) {
      return null
    }

    const { accountType = ACCOUNT_TYPE.PERSONAL } = currentUser
    let pickerItems = []
    {
      p_categories.map((item, index) => {
        pickerItems.push({
          label: item.name,
          value: item._id,
        })
      })
    }

    const {
      visibility,
      showVisibilityActionSheet,
      tags,
      tagText,
      pickedAttachments,
      attachmentType,
      showAddAttachmentActionSheet,
      description,
      showSuccessModal,
      uploaded,
      descriptionWidth,
      showBusinessFields,
      productInfo: {
        name: productName,
        price: productPrice,
        salePrice: productSalePrice,
        link: productLink,
        productCategory,
        productCategoryName,
      },
    } = this.state

    const showAttachment = !isEmpty(pickedAttachments)
    const uploadProgressPercent = round(uploaded * 100, 2)
    const progressText = `${localizedStrings.common.uploading}: ${uploadProgressPercent}%`
    const successMessage =
      this.mode === NEW_POST_MODE.CREATE
        ? localizedStrings.newPost.successModal.createSuccessMessage
        : localizedStrings.newPost.successModal.updateSuccessMessage
    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.container}>
          {accountType === ACCOUNT_TYPE.BUSINESS && (
            <View style={styles.businessSwitchContainer}>
              <Switch
                value={showBusinessFields}
                trackColor={{
                  true: COLORS.cornFlowerBlue,
                }}
                onValueChange={this.onBusinessSwitchValueChange}
              />
              <Text style={styles.businessSwitchLabel}>
                {localizedStrings.newPost.businessSwitch.label}
              </Text>
            </View>
          )}

          {!showAttachment ? (
            <TouchableOpacity
              style={styles.attachmentTouchable}
              onPress={this.onAddAttachmentPress}>
              <View style={styles.attachmentContainer}>
                <Icon
                  type={IconType.MaterialIcons}
                  name={'photo-library'}
                  color={COLORS.cornFlowerBlue}
                  size={20}
                />
                <Text style={styles.addAttachmentText}>
                  {localizedStrings.newPost.attachment.addAttachment}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            this.renderAttachmentsPreview(pickedAttachments, attachmentType)
          )}
          <View style={styles.descriptionInputContainer}>
            <TextInput
              style={[
                styles.descriptionInput,
                Platform.OS === 'android' && { width: descriptionWidth },
              ]}
              multiline={true}
              placeholder={localizedStrings.newPost.description.placeholder}
              value={description}
              onChangeText={this.onDescriptionTextChange}
            />
          </View>

          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.visibilityTouchable}
            onPress={this.onVisibilityPress}>
            <View style={styles.visibilityContainer}>
              <Text style={styles.visibilityText}>
                {getVisibilityString(visibility)}
              </Text>
              <Icon
                type={IconType.AntDesign}
                name={'caretdown'}
                color={COLORS.black}
                size={8}
              />
            </View>
          </TouchableOpacity>

          {showBusinessFields ? (
            <View style={styles.pickeritem1}>
              {Platform.OS !== 'ios' ? (
                <View style={styles.pickerItemWrapper}>
                  <Picker
                    mode="dropdown"
                    selectedValue={productCategory}
                    style={styles.pickeritem}
                    onValueChange={this.handlepropertystate}
                    itemStyle={styles.pickeritemstyle}>
                    <Picker.Item label="Select Category" value="all" />

                    {p_categories.map((item, index) => {
                      return (
                        <Picker.Item
                          label={item.name}
                          value={item._id}
                          key={index}
                        />
                      )
                    })}
                  </Picker>
                </View>
              ) : (
                <View>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Category',
                      value: 'all',
                    }}
                    items={pickerItems}
                    onValueChange={this.handlepropertystate}
                    value={productCategory}
                    style={styles.inputIOS}
                  />
                </View>
              )}
            </View>
          ) : (
            <View />
          )}

          <View style={styles.tagsContainer}>
            <View style={styles.tagsTopContent}>
              <TextInput
                style={styles.tagInput}
                placeholder={localizedStrings.newPost.tags.input.placeholder}
                value={tagText}
                onChangeText={this.onTagInputTextChange}
                returnKeyType={'done'}
                onSubmitEditing={this.onAddTagButtonPress}
              />
              <TouchableOpacity
                style={styles.addTagButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={this.onAddTagButtonPress}>
                <Text style={styles.addTagText}>
                  {localizedStrings.newPost.tags.addButton}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsListContainer}>
              {tags.map((tag, index) => (
                <Tag
                  key={index.toString()}
                  style={styles.tag}
                  text={tag}
                  onRemovePress={this.onRemoveTagPress}
                />
              ))}
            </View>
          </View>
          {showBusinessFields && (
            <View style={styles.businessFieldsContainer}>
              <Text style={styles.productInfoLabel}>
                {localizedStrings.newPost.productInfo.label}
              </Text>
              <DefaultInput
                style={styles.productInfoInput}
                containerStyle={styles.productNameInput}
                onChangeText={this.onProductNameTextChanged}
                placeholder={localizedStrings.newPost.productInfo.productName}
                value={productName}
              />
              <DefaultInput
                style={styles.productInfoInput}
                containerStyle={styles.productPriceInput}
                onChangeText={this.onProductPriceTextChanged}
                placeholder={localizedStrings.newPost.productInfo.price}
                keyboardType={'decimal-pad'}
                endText={'USD'}
                value={productPrice}
              />
              <DefaultInput
                style={styles.productInfoInput}
                containerStyle={styles.productSalePriceInput}
                onChangeText={this.onProductSalePriceTextChanged}
                placeholder={localizedStrings.newPost.productInfo.salePrice}
                keyboardType={'decimal-pad'}
                endText={'USD'}
                value={productSalePrice}
              />
              <DefaultInput
                style={styles.productInfoInput}
                containerStyle={styles.productLinkInput}
                onChangeText={this.onProductLinkTextChanged}
                placeholder={localizedStrings.newPost.productInfo.link}
                value={productLink}
                autoCapitalize={'none'}
              />
            </View>
          )}

          <BottomActionSheet
            key="VisibilityActionSheet"
            isShowing={showVisibilityActionSheet}
            actions={this.visibilityOptions}
            onOverlayPress={this.onVisibilityOverlayPress}
          />

          <BottomActionSheet
            key="AddAttachmentActionSheet"
            isShowing={showAddAttachmentActionSheet}
            actions={this.addAttachmentOptions}
            onOverlayPress={this.onAddAttachmentOverlayPress}
          />

          {loading && !showSuccessModal && (
            <ProgressModal
              visible={loading && !showSuccessModal}
              text={progressText}
              progress={uploaded}
            />
          )}

          <InfoModal
            visible={showSuccessModal}
            title={localizedStrings.newPost.successModal.title}
            message={successMessage}
            onOkButtonPress={this.onSuccessModalOkPress}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'stretch',
  },
  uploadButton: {
    paddingHorizontal: 16,
  },
  uploadButtonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cornFlowerBlue,
  },
  descriptionInputContainer: {
    height: 171,
    backgroundColor: COLORS.white,
  },
  descriptionInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    textAlignVertical: 'top',
  },
  visibilityTouchable: {
    alignItems: 'stretch',
    marginTop: 7,
  },
  visibilityContainer: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityText: {
    fontSize: 15,
    flex: 1,
  },
  tagsContainer: {
    backgroundColor: COLORS.white,
    alignItems: 'stretch',
    marginTop: 8,
    paddingHorizontal: 18,
  },
  tagsTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  addTagButton: {},
  addTagText: {
    color: COLORS.cornFlowerBlue,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '600',
  },
  tagsListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.geyser,
    marginRight: 11,
    marginBottom: 14,
  },
  attachmentTouchable: {
    alignItems: 'stretch',
    marginVertical: 8,
  },
  attachmentContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  addAttachmentText: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
    marginLeft: 10,
  },
  attachmentPreview: {
    marginVertical: 8,
    backgroundColor: COLORS.white,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  videoAttachmentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  videoPreview: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: COLORS.black,
    marginBottom: 10,
  },
  trimmerContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
  },
  businessSwitchContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessSwitchLabel: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '600',
  },
  businessFieldsContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  productInfoLabel: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  productInfoInput: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.black,
  },
  productNameInput: {
    marginBottom: 20,
  },
  productPriceInput: {
    marginBottom: 20,
  },
  productSalePriceInput: {
    marginBottom: 20,
  },
  productLinkInput: {
    marginBottom: 20,
  },

  pickerItemWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pickeritem: {
    width: '100%',
    height: 50,
  },

  pickeritem1: {
    width: '100%',
    height: 50,
    marginTop: 8,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
  },

  pickeritemstyle: {
    color: COLORS.black,
    fontSize: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    alignSelf: 'flex-start',
    textAlign: 'left',
    backgroundColor: 'white',
    color: 'black',
  },
  attachmentTitle: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
    margin: 5,
  },
  attachmentDescription: {
    color: COLORS.doveGray,
    fontSize: 12,
    margin: 5,
  },
})

export default NewPost
