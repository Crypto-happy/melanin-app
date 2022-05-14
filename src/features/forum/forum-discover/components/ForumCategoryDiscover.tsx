import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList, SafeAreaView, Text } from 'react-native'
import { isEmpty } from 'lodash'
import COLORS from 'constants/colors'
import { NAVIGATORS } from 'constants/navigators'
import localizedStrings from 'localization'
import FloatingButton from 'components/FloatingButton'
import ForumPost from './ForumPost'

interface Props {
  navigation: any
  route: any
  forumPosts: any
  getForumPost: (id: string, limit?: number, skip?: number) => void
}

const ForumCategoryDiscover = ({
  navigation,
  route,
  forumPosts,
  getForumPost,
}: Props) => {
  const [categoryId, setCategoryId] = useState('')
  const [fetchingPost, setFetchingPosts] = useState(false)

  useEffect(() => {
    const routeCategoryId = route.params?.categoryId
    setCategoryId(routeCategoryId)
  }, [route.params?.categoryId])

  const categoryPosts = forumPosts[categoryId]

  const goToCreateForumPost = () => {
    navigation.navigate(NAVIGATORS.FORUMS_CONTENT_FORM.name, {
      headerTitle: localizedStrings.forums.form.newContent,
    })
  }

  const fetchAdditionalPost = async () => {
    setFetchingPosts(true)
    await getForumPost(categoryId)
    setFetchingPosts(false)
  }

  if (isEmpty(categoryId)) {
    return null
  }

  if (isEmpty(categoryPosts)) {
    return (
      <SafeAreaView style={[styles.screenContainer, styles.noPostContainer]}>
        <Text>{localizedStrings.forums.discover.noPostFound}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <FlatList
        data={categoryPosts}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }: any) => <ForumPost item={item} />}
        onRefresh={() => fetchAdditionalPost()}
        refreshing={fetchingPost}
      />
      <FloatingButton onPress={goToCreateForumPost} />
    </SafeAreaView>
  )
}

export default ForumCategoryDiscover

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    display: 'flex',
    alignItems: 'center',
  },
  noPostContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
