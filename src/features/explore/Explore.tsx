import React from 'react'
import {
    Alert,
    Keyboard,
    Route,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
    ImageBackground,
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
import Icon, { IconType } from 'components/Icon/Icon'
import { BottomActionSheet } from 'components/bottom-action-sheet'
import RangeSlider from 'rn-range-slider';

import { ACCOUNT_TYPE, ATTACHMENT_TYPE } from 'types'
import { UserType } from 'types/User.types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-crop-picker'
import { FONT_FAMILIES } from '../../constants/fonts'
import {
    emailPattern,
    phoneNumberPattern,
    urlPattern,
    usernamePattern,
} from 'utils/patterns'
import ProgressModal from 'components/ProgressModal'
import FilterModal from 'components/FilterModal'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector, connect } from 'react-redux'
import { HeaderBackButton } from '@react-navigation/stack'
import { NAVIGATORS } from 'constants/navigators'
import { Rating, AirbnbRating } from 'react-native-ratings';
import {
    StackHeaderLeftButtonProps,
    StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'

interface Profile {
    _id: string,
    avatar: string,
    ratingAvg: number,
    name: string
}

interface TopBusiness {
    _id: string
    avatar: string,
    ratingAvg: number,
    name: string
}
interface Post {
    _id: string
    sharedBy: Array<string>
    viewsCount: number
    ratingAvg: number
    items: Array<Attachment>
}

interface Attachment {
    _id: string
    previewUrl: string
    url: string
    type: string
    post: string
    viewsCount: number
    ratingAvg: number
    sharesCount: number
}

interface Props extends Route {
    authUser: any
    fetchRecommededProfiles: (
        userId: string,
        skip: number,
        limit: number,
        filterMin?: number,
        filterMax?: number,
    ) => void
    fetchTopRankedBusinesses: (
        userId: string,
        skip: number,
        limit: number,
        filterMin?: number,
        filterMax?: number,
    ) => void
    fetchFeaturedVideos: (
        userId: string,
        skip: number,
        limit: number,
        filterMin?: number,
        filterMax?: number,
    ) => void
    fetchFeaturedPhotos: (
        userId: string,
        skip: number,
        limit: number,
        filterMin?: number,
        filterMax?: number,
    ) => void
    reset: () => void
    loading: boolean
    success: boolean
    error: boolean
    profiles: Array<Profile>
    paginationProfiles: {
        skip: number,
        endReached: boolean,
    }
    profileScrollEnded: boolean
    topBusinesses: Array<TopBusiness>
    paginationBusinesses: {
        skip: number,
        endReached: boolean,
    }
    businessScrollEnded: boolean
    featuredVideos: Array<Post>
    paginationVideos: {
        skip: number,
        endReached: boolean,
    }
    videosScrollEnded: boolean
    featuredPhotos: Array<Post>
    paginationPhotos: {
        skip: number,
        endReached: boolean,
    }
    photosScrollEnded: boolean
}

interface State {
    showFilterModal: boolean
    filterMin: number
    filterMax: number
    tempMin: number
    tempMax: number
    sliderStep: number
    profilesPerPage: number
    topBusinessesPerPage: number
    featuredVideosPerPage: number
    featuredPhotosPerPage: number
}

class Explore extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            showFilterModal: false,
            filterMin: 4,
            filterMax: 5,
            tempMin: 4,
            tempMax: 5,
            sliderStep: 0.1,
            profilesPerPage: DEFAULT_ITEMS_PER_PAGE,
            topBusinessesPerPage: DEFAULT_ITEMS_PER_PAGE,
            featuredVideosPerPage: DEFAULT_ITEMS_PER_PAGE,
            featuredPhotosPerPage: DEFAULT_ITEMS_PER_PAGE,
        }
    }

    componentDidMount() {
        const currentUser = this.props.authUser
        const title = localizedStrings.explore.headerTitle
        const navigation = this.props.navigation
        navigation.setOptions({
            headerTitle: (props: StackHeaderTitleProps) => (
                <Text style={styles.title}>{title}</Text>
            ),
            headerRight: (props: StackHeaderLeftButtonProps) => {
                return (
                    <>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => { this.setState({ showFilterModal: true }) }}>
                            <Icon
                                type={IconType.FontAwesome}
                                name={'filter'}
                                color={COLORS.black}
                                size={20}
                            />
                        </TouchableOpacity>
                    </>
                )
            },
            headerLeft: (props: StackHeaderLeftButtonProps) => {
                return (
                    <>
                        <TouchableOpacity
                            style={styles.backButton}
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            onPress={() => { navigation.goBack() }}>
                            <Icon
                              type={IconType.MaterialIcons}
                              name={'arrow-back'}
                                color={COLORS.black}
                                size={30}
                            />
                        </TouchableOpacity>
                    </>
                )
            }

        })
        this.props.fetchRecommededProfiles(currentUser._id, 0, this.state.profilesPerPage, this.state.filterMin, this.state.filterMax)
        this.props.fetchTopRankedBusinesses(currentUser._id, 0, this.state.topBusinessesPerPage, this.state.filterMin, this.state.filterMax)
        this.props.fetchFeaturedVideos(currentUser._id, 0, this.state.featuredVideosPerPage, this.state.filterMin, this.state.filterMax)
        this.props.fetchFeaturedPhotos(currentUser._id, 0, this.state.featuredPhotosPerPage, this.state.filterMin, this.state.filterMax)
    }

    renderProfile = ({ item }) => (
        <TouchableOpacity style={styles.profileWrapper}
            onPress={() => this.onItemAvatarAndUserNamePress(item._id)}>
            <UserAvatar
                imgSrc={item.avatar}
                heightOrWidth={60}
                isBusiness={false} />
            <Text style={styles.nameText} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
            <View style={styles.ratingWrapper}>
                <Rating
                    type='star'
                    imageSize={13}
                    showRating={false}
                    readonly={true}
                    style={styles.newRatingBar}
                    startingValue={item.ratingAvg}
                />
                <Text style={styles.ratingText}>{Math.round(item.ratingAvg * 100) / 100}</Text>
            </View>
        </TouchableOpacity>
    )

    onProfileEndReached = () => {
        if (this.props.profileScrollEnded === true) return
        this.props.fetchRecommededProfiles(this.props.authUser._id,
            (this.props.paginationProfiles === undefined ? 0 : this.props.paginationProfiles.skip) + this.state.profilesPerPage,
            this.state.profilesPerPage, this.state.filterMin, this.state.filterMax)
    }

    keyExtractorProfile(item: Profile) {
        return item._id
    }

    renderBusiness = ({ item }) => {
        return (
            <TouchableOpacity style={styles.profileWrapper}
                onPress={() => this.onItemAvatarAndUserNamePress(item._id)}>
                <UserAvatar
                    imgSrc={item.avatar}
                    heightOrWidth={60}
                    isBusiness={true} />
                <Text style={styles.nameText} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                <View style={styles.ratingWrapper}>
                    <Rating
                        type='star'
                        imageSize={13}
                        showRating={false}
                        readonly={true}
                        style={styles.newRatingBar}
                        startingValue={item.ratingAvg}
                    />
                    <Text style={styles.ratingText}>{Math.round(item.ratingAvg * 100) / 100}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    onBusinessEndReached = () => {
        if (this.props.businessScrollEnded === true) return
        this.props.fetchTopRankedBusinesses(this.props.authUser._id,
            (this.props.paginationBusinesses === undefined ? 0 : this.props.paginationBusinesses.skip) + this.state.topBusinessesPerPage,
            this.state.topBusinessesPerPage, this.state.filterMin, this.state.filterMax)
    }

    keyExtractorBusiness(item: TopBusiness) {
        return item._id
    }

    renderFeaturedVideo = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onItemViewDetailPress(item._id)}>
                <ImageBackground source={{ uri: item.items[0].previewUrl }} style={styles.featuredMediaWrapper} imageStyle={styles.featuredMedia}>
                    <Icon
                        type={IconType.AntDesign}
                        name={'play'}
                        color={COLORS.white}
                        size={30}
                    />

                    <View style={styles.bottomLay}>
                        <Icon
                            type={IconType.Entypo}
                            name={'eye'}
                            color={COLORS.white}
                            size={15} />
                        <Text
                            style={styles.countText}>
                            {item.viewsCount}
                        </Text>
                        <Icon
                            type={IconType.Entypo}
                            name={'share'}
                            color={COLORS.white}
                            size={15} />
                        <Text
                            style={styles.countText}>
                            {item.sharedBy.length}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        )
    }

    onFeaturedVideoEndReached = () => {
        if (this.props.videosScrollEnded === true) return
        this.props.fetchFeaturedVideos(this.props.authUser._id,
            (this.props.paginationVideos === undefined ? 0 : this.props.paginationVideos.skip) + this.state.featuredVideosPerPage,
            this.state.featuredVideosPerPage, this.state.filterMin, this.state.filterMax)
    }

    keyExtractorFeaturedVideo = (item: Post) => {
        return item._id
    }

    renderFeaturedPhoto = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this.onItemViewDetailPress(item._id)}>
                <ImageBackground source={{ uri: item.items[0].url }} style={styles.featuredMediaWrapper} imageStyle={styles.featuredMedia}>
                    <View style={styles.bottomLay}>
                        <Icon
                            type={IconType.Entypo}
                            name={'eye'}
                            color={COLORS.white}
                            size={15} />
                        <Text
                            style={styles.countText}>
                            {item.viewsCount}
                        </Text>
                        <Icon
                            type={IconType.Entypo}
                            name={'share'}
                            color={COLORS.white}
                            size={15} />
                        <Text
                            style={styles.countText}>
                            {item.sharedBy.length}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        )
    }

    onFeaturedPhotoEndReached = () => {
        if (this.props.photosScrollEnded === true) return
        this.props.fetchFeaturedPhotos(this.props.authUser._id,
            (this.props.paginationPhotos === undefined ? 0 : this.props.paginationPhotos.skip) + this.state.featuredPhotosPerPage,
            this.state.featuredPhotosPerPage, this.state.filterMin, this.state.filterMax)
    }

    keyExtractorFeaturedPhoto = (item: Post) => {
        return item._id
    }

    onFilterPress = () => {
        const { tempMin, tempMax } = this.state;
        this.setState({ showFilterModal: false, tempMin: 4, tempMax: 5, filterMin: tempMin, filterMax: tempMax })
        const currentUser = this.props.authUser
        this.props.reset();
        this.props.fetchRecommededProfiles(currentUser._id, 0, this.state.profilesPerPage, tempMin, tempMax)
        this.props.fetchTopRankedBusinesses(currentUser._id, 0, this.state.topBusinessesPerPage, tempMin, tempMax)
        this.props.fetchFeaturedVideos(currentUser._id, 0, this.state.featuredVideosPerPage, tempMin, tempMax)
        this.props.fetchFeaturedPhotos(currentUser._id, 0, this.state.featuredPhotosPerPage, tempMin, tempMax)
    }

    onRangeChanged = (low: number, high: number, fromUser: boolean) => {
        this.setState({ tempMin: low, tempMax: high });
    }

    onItemAvatarAndUserNamePress = (userId: string) => {
        if (this.props.currentUserId === userId) {
            this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
        } else {
            this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
                userId,
            })
        }
    }

    onItemViewDetailPress = (id: string) => {
        this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
    }

    render() {
        const { profiles, topBusinesses, featuredVideos, featuredPhotos, } = this.props
        const { showFilterModal, filterMin, filterMax, sliderStep } = this.state
        const localization = localizedStrings.explore
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}>
                    <View style={styles.wrapper}>
                        <Text style={styles.subTitle}>
                            {localization.recommendedProfiles}
                        </Text>
                        <FlatList
                            horizontal={true}
                            style={styles.list}
                            keyExtractor={this.keyExtractorProfile}
                            onEndReached={this.onProfileEndReached}
                            onEndReachedThreshold={0.7}
                            data={profiles}
                            renderItem={this.renderProfile}
                        />
                        <Text style={styles.subTitle}>
                            {localization.topRankedBusinesses}
                        </Text>
                        <FlatList
                            horizontal={true}
                            style={styles.list}
                            keyExtractor={this.keyExtractorBusiness}
                            onEndReached={this.onBusinessEndReached}
                            onEndReachedThreshold={0.7}
                            data={topBusinesses}
                            renderItem={this.renderBusiness}
                        />
                        <Text style={styles.subTitle}>
                            {localization.featuredVideos}
                        </Text>
                        <FlatList
                            horizontal={true}
                            style={styles.list}
                            keyExtractor={this.keyExtractorFeaturedVideo}
                            onEndReached={this.onFeaturedVideoEndReached}
                            onEndReachedThreshold={0.7}
                            data={featuredVideos}
                            renderItem={this.renderFeaturedVideo}
                        />
                        <Text style={styles.subTitle}>
                            {localization.featuredPhotos}
                        </Text>
                        <FlatList
                            horizontal={true}
                            style={styles.list}
                            keyExtractor={this.keyExtractorFeaturedPhoto}
                            onEndReached={this.onFeaturedPhotoEndReached}
                            onEndReachedThreshold={0.7}
                            data={featuredPhotos}
                            renderItem={this.renderFeaturedPhoto}
                        />
                    </View>


                </ScrollView>
                <FilterModal
                    visible={showFilterModal}
                    min={filterMin / sliderStep}
                    max={filterMax / sliderStep}
                    step={1}
                    title={localization.alert.filterModalTitle}
                    message={localization.alert.filterModalContent}
                    onOkButtonPress={this.onFilterPress}
                    okButtonText={localization.apply}
                    onRangeChanged={this.onRangeChanged}
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
    subTitle: {
        fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: COLORS.black,
        margin: 15
    },
    list: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        backgroundColor: COLORS.lightGrey,
    },
    wrapper: {
        marginBottom: 15,
    },
    profileWrapper: {
        paddingVertical: 15,
        marginStart: 15,
        borderRadius: 15,
        backgroundColor: COLORS.white,
        alignItems: 'center',
    },
    nameText: {
        fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: COLORS.black,
        margin: 10,
        maxWidth: 100
    },
    featuredMediaWrapper: {
        width: 210,
        height: 130,
        marginStart: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredMedia: {
        borderRadius: 15,
    },
    bottomLay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        paddingBottom: 10,
        paddingStart: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    countText: {
        fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
        fontSize: 12,
        marginEnd: 15,
        color: COLORS.white,
    },
    newRatingBar: {
        justifyContent: 'space-between'
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    ratingText: {
        color: COLORS.darkYellow,
        marginStart: 8,
    },
    backButton: {
        marginEnd: 17,
        marginStart: 17
    },
    title: {
        color: COLORS.black,
        fontSize: 22,
        fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    },
})

export default Explore
