import React from 'react'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { isEmpty, get } from 'lodash'
import { RootStackParamList } from 'navigators/RootStackParamList'
import COLORS from 'constants/colors'
import LinearGradient from 'react-native-linear-gradient'
import localizedStrings from 'localization'
import { FONT_FAMILIES } from '../../constants/fonts'
import { OutlineButton } from '../../components/OutlineButton'
import RatingBar from '../../components/RatingBar'
import UserAvatar from '../../components/UserAvatar'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants/index'
import { NAVIGATORS } from '../../constants/navigators'

type ReviewsRouteProp = RouteProp<RootStackParamList, 'Reviews'>

interface Review {
  id: string
  text: string
  rating: number
  author: {
    _id: string
    name: string
    avatar: string
    id: string
  }
  target: string
}

interface Props {
  loading: boolean
  pagination: any
  navigation: any
  reviews: Array<Review>
  route: ReviewsRouteProp
  getReviews: (targetId: string, skip: number, limit: number) => void
  addReview: (targetId: string, content: string, rating: number) => void
}

interface State {
  targetId: string
  userId: string
  viewYourSelf: boolean
  reviewPerPage: number
  reviewWidth: string
  minRatingPoint: number
  maxRatingPoint: number
  stepRatingPoint: number
  newReview: string
  newRating: number
}

class Reviews extends React.Component<Props, State> {
  static defaultProps = {}
  reviewInputRef: TextInput | null = null

  constructor(props: Props) {
    super(props)

    const { route } = this.props
    const targetId = get(route, 'params.targetId', '')
    const userId = get(route, 'params.userId', '')

    this.state = {
      targetId,
      userId,
      viewYourSelf: targetId === userId,
      reviewPerPage: DEFAULT_ITEMS_PER_PAGE,
      reviewWidth: '99%',
      newReview: '',
      newRating: 5,
      minRatingPoint: 1,
      maxRatingPoint: 5,
      stepRatingPoint: 1,
    }
  }

  componentWillUnmount() {}

  componentDidMount() {
    const { getReviews } = this.props
    const { targetId } = this.state

    if (!isEmpty(targetId)) {
      const { reviewPerPage } = this.state
      getReviews && getReviews(targetId, 0, reviewPerPage)
    }

    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.setState({
          reviewWidth: '100%',
        })
      }, 100)
    }
  }

  onNewReviewTextChange = (text: string) => {
    this.setState({
      newReview: text,
    })
  }

  onPointChange = (point: number) => {
    this.setState({
      newRating: point,
    })
  }

  onClickPostReview = () => {
    const { addReview } = this.props
    const { targetId, newReview, newRating } = this.state

    addReview && addReview(targetId, newReview, newRating)
    this.setState({
      newReview: '',
      newRating: 5,
    })
    this.reviewInputRef?.clear()
  }

  onReviewEndReached = () => {
    const { reviewPerPage, targetId } = this.state
    const {
      pagination: { skip, endReached },
      getReviews,
      loading,
    } = this.props

    if (!getReviews || loading || endReached) {
      return
    }

    getReviews(targetId, skip + reviewPerPage, reviewPerPage)
  }

  renderAddReviewSection = () => {
    const localization = localizedStrings.reviews
    const {
      viewYourSelf,
      reviewWidth,
      minRatingPoint,
      maxRatingPoint,
      stepRatingPoint,
      newReview,
      newRating,
    } = this.state

    if (viewYourSelf) {
      return (
        <View>
          <Text style={styles.reviewsSectionTitle}>
            {localization.customerReviews}
          </Text>
        </View>
      )
    }

    return (
      <>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[COLORS.easternBlue, COLORS.oceanGreen]}
          style={styles.newReviewSection}>
          <Text style={styles.newReviewTitle}>
            {localization.newReviewTitle}
          </Text>

          <View style={styles.newRatingSection}>
            <RatingBar
              minPoint={minRatingPoint}
              maxPoint={maxRatingPoint}
              step={stepRatingPoint}
              rating={newRating}
              style={styles.newRatingBar}
              onPointChanged={this.onPointChange}
            />

            <Text
              style={
                styles.newRatingPoint
              }>{`${newRating} / ${maxRatingPoint}`}</Text>
          </View>

          <TextInput
            ref={(ref) => (this.reviewInputRef = ref)}
            style={[
              styles.reviewInput,
              Platform.OS === 'android' && { width: reviewWidth },
              Platform.OS === 'ios' && { paddingBottom: 14 },
            ]}
            multiline={true}
            placeholder={localization.newReviewPlaceholder}
            defaultValue={newReview}
            onChangeText={this.onNewReviewTextChange}
          />

          <OutlineButton
            style={styles.newReviewButton}
            text={localization.newReviewButton}
            textStyle={styles.newReviewBtnLabel}
            onPress={this.onClickPostReview}
          />
        </LinearGradient>

        <Text style={styles.reviewsSectionTitle}>
          {localization.customerReviews}
        </Text>
      </>
    )
  }

  keyExtractor = (item: Review) => {
    return item.id
  }

  handleAvatarAndUserNamePress = (id: string) => () => {
    const { userId } = this.state

    if (userId === id) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.push(NAVIGATORS.USER_PROFILE.name, {
        userId: id,
      })
    }
  }

  renderReviewByUser = ({ item }: { item: Review }) => {
    const { minRatingPoint, maxRatingPoint, stepRatingPoint } = this.state
    const navigateToUserScreen = this.handleAvatarAndUserNamePress(
      item.author.id,
    )

    return (
      <View style={styles.reviewItemSection}>
        <TouchableOpacity
          style={styles.itemAvatar}
          onPress={navigateToUserScreen}>
          <UserAvatar
            imgSrc={item.author.avatar}
            heightOrWidth={40}
            isBusiness={false}
          />
        </TouchableOpacity>

        <View style={styles.itemInfoSection}>
          <View style={styles.itemInfoHeader}>
            <TouchableOpacity
              style={styles.itemInfoUserName}
              onPress={navigateToUserScreen}>
              <Text style={styles.fullName} numberOfLines={1}>
                {item.author.name}
              </Text>
            </TouchableOpacity>

            <View style={styles.itemInfoRating}>
              <Text style={styles.itemRatingPoint}>{item.rating}</Text>

              <View style={styles.itemRatingBar}>
                <RatingBar
                  minPoint={minRatingPoint}
                  maxPoint={maxRatingPoint}
                  step={stepRatingPoint}
                  rating={item.rating}
                  iconSize={18}
                  iconColor={COLORS.oceanGreen}
                  gapBetweenIcon={1}
                />
              </View>
            </View>
          </View>

          <Text style={styles.itemInfoContent}>{item.text}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { reviews } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderAddReviewSection()}
          onEndReached={this.onReviewEndReached}
          onEndReachedThreshold={0.7}
          data={reviews}
          renderItem={this.renderReviewByUser}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  newReviewSection: {
    padding: 20,
  },
  newReviewTitle: {
    color: COLORS.white,
  },
  reviewInput: {
    backgroundColor: COLORS.white,
    paddingTop: 14,
    paddingHorizontal: 10,
    marginVertical: 20,
    textAlignVertical: 'top',
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    borderRadius: 6,
    minHeight: 50,
  },
  newReviewButton: {
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 8,
    maxWidth: 150,
  },
  newReviewBtnLabel: {
    color: COLORS.white,
  },
  newRatingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  newRatingBar: {
    flex: 1,
  },
  newRatingPoint: {
    flexBasis: 50,
    fontSize: 17,
    fontWeight: 'normal',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.white,
  },
  reviewsSectionTitle: {
    padding: 20,
    fontSize: 18,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
  },
  reviewItemSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 26,
  },
  itemAvatar: {
    marginTop: 3,
  },
  itemInfoSection: {
    marginLeft: 10,
    flex: 1,
  },
  itemInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfoUserName: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  itemInfoRating: {
    flexBasis: 110,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRatingPoint: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    flexBasis: 20,
  },
  itemRatingBar: {
    flex: 1,
  },
  itemInfoContent: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginTop: 5,
  },
})

export default Reviews
