import React, { useLayoutEffect, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { isEmpty } from 'lodash'
import localization from 'localization'
import { FONT_FAMILIES } from 'constants/fonts'
import { NAVIGATORS } from 'constants/navigators'
import SelectableCard from 'components/SelectableCard'

type Props = {
  navigation: any
  categories: any
  loading: boolean
  getForumInterestCategories: () => void
  selectForumInterestCategory: (id: string) => void
}

const ForumInterestCategories = ({
  navigation,
  categories,
  loading,
  getForumInterestCategories,
  selectForumInterestCategory,
}: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerRightContainer}
          onPress={goToSelectSubCategoriesScreen}>
          <Image source={require('assets/images/green-check.png')} />
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const goToSelectSubCategoriesScreen = () => {
    navigation.navigate(NAVIGATORS.SELECT_INTEREST_SUB_CATEGORIES.name)
  }

  useEffect(() => {
    getForumInterestCategories()
  }, [])

  if (loading) {
    return null
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.titleText}>{localization.forums.chooseTopics}</Text>

      <View style={styles.categoriesContainer}>
        {!isEmpty(categories) &&
          categories.map((category: any) => {
            const { name, _id: id } = category
            return (
              <SelectableCard
                text={name}
                key={id}
                onPress={() => selectForumInterestCategory(id)}
              />
            )
          })}
      </View>
    </View>
  )
}

export default React.memo(ForumInterestCategories)

const styles = StyleSheet.create({
  headerRightContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  titleText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    paddingTop: 20,
    paddingBottom: 30,
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
