import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import { NAVIGATORS } from 'constants/navigators'
import localizedStrings from 'localization'
import FloatingButton from 'components/FloatingButton'
import ForumPostMinified from './ForumPostMinified'

interface Props {
  navigation: any
  route: any
  selectedCategories: any
  forumPosts: any
  getForumPost: (id: string) => void
}

const ForumDiscover = ({
  navigation,
  route,
  selectedCategories,
  forumPosts,
  getForumPost,
}: Props) => {
  const fetchForumPost = () => {
    selectedCategories.forEach((category: any) => {
      getForumPost(category._id)
    })
  }

  useEffect(() => {
    fetchForumPost()
  }, [])

  useEffect(() => {
    const shouldRefresh = route.params?.shouldRefresh
    shouldRefresh && fetchForumPost()
  }, [route.params?.shouldRefresh])

  const goToCreateForumPost = () => {
    navigation.navigate(NAVIGATORS.FORUMS_CONTENT_FORM.name, {
      headerTitle: localizedStrings.forums.form.newContent,
    })
  }

  const goToCategoryDiscover = (headerTitle: string, categoryId: string) => {
    navigation.navigate(NAVIGATORS.FORUMS_CATEGORY_DISCOVER.name, {
      headerTitle,
      categoryId,
    })
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView>
        <View style={styles.container}>
          {selectedCategories.map((category: any, index: number) => {
            const { name, _id: id } = category
            const categoryPosts = forumPosts[id]

            const categorySectionStyle: any = [styles.categorySection]
            if (index === selectedCategories.length - 1) {
              categorySectionStyle.push(styles.lastCategorySection)
            }

            return (
              <View style={categorySectionStyle}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.text}>{name}</Text>
                  <TouchableOpacity>
                    <Text
                      style={[styles.text, styles.linkText]}
                      onPress={() => goToCategoryDiscover(name, id)}>
                      {localizedStrings.forums.discover.seeAll}
                    </Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={categoryPosts}
                  keyExtractor={(item: any) => item._id}
                  renderItem={({ item }: any) => (
                    <ForumPostMinified item={item} />
                  )}
                  horizontal
                />
              </View>
            )
          })}
        </View>
      </ScrollView>

      <FloatingButton onPress={goToCreateForumPost} />
    </View>
  )
}

export default ForumDiscover

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    paddingLeft: 20,
  },
  categorySection: {
    marginTop: 20,
  },
  lastCategorySection: {
    marginBottom: 100,
  },
  categoryHeader: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 20,
  },
  text: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  linkText: {
    color: COLORS.easternBlue,
  },
})
