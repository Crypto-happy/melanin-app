import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { head, isEmpty } from 'lodash'
import numeral from 'numeral'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import UserAvatar from 'components/UserAvatar'
import Icon, { IconType } from 'components/Icon/Icon'

interface Props {
  item: any
}

const ForumPostMinified = ({ item }: Props) => {
  const {
    title,
    description,
    attachments,
    author,
    commentsCount,
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
          <UserAvatar imgSrc={avatar} heightOrWidth={30} />
          <Text
            style={[styles.bottomSectionText, styles.bottomSectionItemSection]}>
            {authorName}
          </Text>
        </View>

        <View style={styles.bottomSectionItem}>
          <View style={styles.likeCommentSection}>
            <Icon
              type={IconType.MaterialIcons}
              name={'mode-comment'}
              color={COLORS.geyser}
              size={15}
            />
            <Text style={[styles.bottomSectionText, styles.iconNumberSpacing]}>
              {numeral(commentsCount).format('0a')}
            </Text>
          </View>

          <View
            style={[
              styles.likeCommentSection,
              styles.bottomSectionItemSection,
            ]}>
            <Icon
              type={IconType.AntDesign}
              name={'eye'}
              color={COLORS.geyser}
              size={15}
            />
            <Text style={[styles.bottomSectionText, styles.iconNumberSpacing]}>
              {numeral(viewsCount).format('0a')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ForumPostMinified

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    height: 300,
    padding: 10,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 15,
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
  },
  bottomSection: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSectionItemSection: {
    marginLeft: 10,
  },
  bottomSectionText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.black,
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
