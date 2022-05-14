import React from 'react'
import { DirectoryBusinessProfileType } from '../../../types/User.types'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { get, isEmpty, round, isNumber } from 'lodash'
import { Image } from 'react-native-elements'
import { FONT_FAMILIES } from '../../../constants/fonts'
import COLORS from '../../../constants/colors'
import Icon from '../../../components/Icon'
import { IconType } from '../../../components/Icon/Icon'

interface Props {
  itemId: string
  item?: DirectoryBusinessProfileType
  onItemViewDetailPress: (id: string) => void
}

const DirectoryItemResult = (props: Props) => {
  const { item, onItemViewDetailPress } = props

  if (typeof item === 'undefined') {
    return null
  }

  const handleItemPress = () => {
    !isEmpty(item!._id) &&
      onItemViewDetailPress &&
      onItemViewDetailPress(item!._id)
  }

  let viewPostsCount = `${item.viewPostsCount}`
  if (viewPostsCount.length > 4) {
    viewPostsCount = viewPostsCount.slice(0, 4) + '..'
  }

  return (
    <TouchableOpacity
      style={styles.directoryContainer}
      onPress={handleItemPress}>
      <Image source={{ uri: item.avatar }} style={styles.directoryThumbnail} />

      <View style={styles.directoryDescription}>
        <View style={styles.directoryDescriptionContent}>
          <View
            style={[
              styles.directoryDescriptionSubContent,
              styles.directoryStartDescriptionSubContent,
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.directoryDescriptionSubContentChildText,
                {
                  fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
                  color: COLORS.black,
                },
              ]}>
              {item.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.directoryDescriptionSubContentChildText]}>
              {!isEmpty(item.city)
                ? `${item.state} , ${item.city}`
                : item.state}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.directoryDescriptionSubContentChildText]}>
              {item.businessCategory}
            </Text>
          </View>

          <View
            style={[
              styles.directoryDescriptionSubContent,
              styles.directoryEndDescriptionSubContent,
            ]}>
            <View style={styles.directoryDescriptionSubContentChild}>
              <Icon
                type={IconType.Entypo}
                name={'star'}
                color={COLORS.goldenTainoi}
                size={16}
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.directoryDescriptionSubContentChildText,
                  { marginVertical: 0, marginHorizontal: 4 },
                ]}>
                {round(get(item, 'ratingAvg', 0), 2)}
              </Text>
            </View>

            <View style={styles.directoryDescriptionSubContentChild}>
              <Icon
                type={IconType.Entypo}
                name={'eye'}
                color={COLORS.doveGray}
                size={16}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.directoryDescriptionSubContentChildText,
                  { marginVertical: 0, marginHorizontal: 4, marginTop: -2 },
                ]}>
                {viewPostsCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.directoryDescriptionTag}>
          {item.tagCodes &&
            item.tagCodes.map((tagCode: string) => {
              return (
                <View key={tagCode} style={styles.tagViewChild}>
                  <Text numberOfLines={1} style={styles.text}>
                    {tagCode}
                  </Text>
                </View>
              )
            })}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
    flexBasis: 6,
  },
  directoryDescriptionSubContentChildText: {
    fontSize: 14,
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

export default DirectoryItemResult
