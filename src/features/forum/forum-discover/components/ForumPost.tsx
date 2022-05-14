import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { head, isEmpty } from 'lodash'
import numeral from 'numeral'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import UserAvatar from 'components/UserAvatar'
import Icon, { IconType } from 'components/Icon/Icon'

interface Props {
  item: any
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

const ForumPost = ({ item }: Props) => {
  const {
    title,
    description,
    attachments,
    author,
    likesCount,
    dislikesCount,
    commentsCount,
    sharesCount,
    viewsCount,
  } = item
  const image: any = head(attachments) || {}
  const { name: authorName, avatar } = author

  return (
    <View style={styles.cardContainer}>
      <View style={styles.topSection}>
        {isEmpty(image) ? (
          <View
            style={[
              styles.imageContainer,
              styles.placeholderImage,
              styles.cardSection,
            ]}
          />
        ) : (
          <Image
            source={{ uri: image.url }}
            style={[styles.imageContainer, styles.cardSection]}
          />
        )}

        <View style={styles.postInfoSection}>
          <View style={styles.postInfoSectionItem}>
            <UserAvatar imgSrc={avatar} heightOrWidth={30} />
            <Text
              style={[
                styles.postInfoSectionText,
                styles.postInfoSectionItemSection,
              ]}>
              {authorName}
            </Text>
          </View>

          <View style={styles.postInfoSectionItem}>
            <View
              style={[
                styles.likeCommentSection,
                styles.postInfoSectionItemSection,
              ]}>
              <Icon
                type={IconType.AntDesign}
                name={'eye'}
                color={COLORS.geyser}
                size={20}
              />
              <Text
                style={[styles.postInfoSectionText, styles.iconNumberSpacing]}>
                {numeral(viewsCount).format('0a')}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.cardText, styles.cardTitle, styles.cardSection]}
          numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.cardText, styles.cardSection]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.bottomSectionItem}>
          <View
            style={[
              styles.likeCommentSection,
              styles.postInfoSectionItemSection,
            ]}>
            <Icon
              type={IconType.AntDesign}
              name={'like1'}
              color={COLORS.geyser}
              size={20}
            />
            <Text
              style={[styles.postInfoSectionText, styles.iconNumberSpacing]}>
              {numeral(likesCount).format('0a')}
            </Text>
          </View>
        </View>
        <View style={styles.bottomSectionItem}>
          <View
            style={[
              styles.likeCommentSection,
              styles.postInfoSectionItemSection,
            ]}>
            <Icon
              type={IconType.AntDesign}
              name={'dislike1'}
              color={COLORS.geyser}
              size={20}
            />
            <Text
              style={[styles.postInfoSectionText, styles.iconNumberSpacing]}>
              {numeral(dislikesCount).format('0a')}
            </Text>
          </View>
        </View>
        <View style={styles.bottomSectionItem}>
          <View
            style={[
              styles.likeCommentSection,
              styles.postInfoSectionItemSection,
            ]}>
            <Icon
              type={IconType.MaterialIcons}
              name={'mode-comment'}
              color={COLORS.geyser}
              size={20}
            />
            <Text
              style={[styles.postInfoSectionText, styles.iconNumberSpacing]}>
              {numeral(commentsCount).format('0a')}
            </Text>
          </View>
        </View>
        <View style={styles.bottomSectionItem}>
          <View
            style={[
              styles.likeCommentSection,
              styles.postInfoSectionItemSection,
            ]}>
            <Icon
              type={IconType.Ionicons}
              name={'ios-share-alt'}
              color={COLORS.geyser}
              size={20}
            />
            <Text
              style={[styles.postInfoSectionText, styles.iconNumberSpacing]}>
              {numeral(sharesCount).format('0a')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ForumPost

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'column',
    width: SCREEN_WIDTH - 40,
    marginHorizontal: 20,
    height: 400,
    padding: 10,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    overflow: 'hidden',
    borderRadius: 5,
  },
  placeholderImage: {
    backgroundColor: COLORS.lightGray,
  },
  cardTitle: {
    color: COLORS.black,
  },
  cardText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    lineHeight: 18,
    color: '#bcbcbc',
  },
  cardSection: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  topSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  postInfoSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postInfoSectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  postInfoSectionText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.black,
  },
  postInfoSectionItemSection: {
    marginLeft: 10,
  },
  bottomSection: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  bottomSectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  likeCommentSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconNumberSpacing: {
    marginLeft: 5,
  },
})
