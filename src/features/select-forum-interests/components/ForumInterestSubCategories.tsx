import React, { useLayoutEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { isEmpty } from 'lodash'
import { FONT_FAMILIES } from 'constants/fonts'
import { NAVIGATORS } from 'constants/navigators'
import localization from 'localization'
import SelectableCard from 'components/SelectableCard'

type Props = {
  navigation: any
  loading: boolean
  selectedCategories: any
  selectForumInterestSubCategory: (id: string) => void
}

const ForumInterestSubCategories = ({
  navigation,
  loading,
  selectedCategories,
  selectForumInterestSubCategory,
}: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerRightContainer}
          onPress={goToDiscoverScreen}>
          <Image source={require('assets/images/green-check.png')} />
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const goToDiscoverScreen = () => {
    navigation.navigate(NAVIGATORS.SELECT_INTEREST_SUB_CATEGORIES.name, {
      headerTitle: localization.forums.screenTitle.discover,
    })
  }

  const renderSubCategories = ({ item: category }) => {
    const { name: categoryName, subCategories } = category
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        <View style={styles.categoriesContainer}>
          {!isEmpty(subCategories) &&
            subCategories.map((subCategory: any) => {
              const { name: subCategoryName, _id: id } = subCategory
              return (
                <SelectableCard
                  text={subCategoryName}
                  key={id}
                  onPress={() => selectForumInterestSubCategory(id)}
                />
              )
            })}
        </View>
      </View>
    )
  }

  if (loading) {
    return null
  }

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={selectedCategories}
        renderItem={renderSubCategories}
        keyExtractor={(item) => item._id}
      />
    </View>
  )
}

export default React.memo(ForumInterestSubCategories)

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
    paddingTop: 20,
  },
  categoryContainer: {
    paddingVertical: 10,
  },
  categoryTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    paddingBottom: 15,
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
