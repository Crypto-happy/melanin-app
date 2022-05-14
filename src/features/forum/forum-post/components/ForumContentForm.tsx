import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { findIndex, get, isEmpty } from 'lodash'
import update from 'immutability-helper'
import localizedStrings from 'localization'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import ImageUpload from './ImageUpload'
import ForumContentInput from './ForumContentInput'
import { DefaultButton } from 'components/DefaultButton'
import DefaultPicker from 'components/DefaultPicker'
import DefaultAddTags from 'components/DefaultAddTags'
import { IconType } from 'components/Icon/Icon'
import { NAVIGATORS } from 'constants/navigators'

const localization = localizedStrings.forums.form

type Props = {
  navigation: any
  categories: any
  subCategories: any
  categoryByIds: any
  subCategoryByIds: any
  loading: boolean
  selectForumFormCategoryId: (id: string) => void
  createForumPost: (forumPost: any) => void
}

const FORM_FIELDS = {
  IMAGE: 'image',
  TITLE: 'title',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  SUBCATEGORY: 'subCategory',
  TAGS: 'tags',
}

const INITIAL_FORM_VALUE = {
  image: [],
  title: '',
  description: '',
  category: {},
  subCategory: {},
  tags: [],
}

const ForumContentForm = ({
  navigation,
  categories,
  categoryByIds,
  subCategories,
  subCategoryByIds,
  loading,
  selectForumFormCategoryId,
  createForumPost,
}: Props) => {
  const [formValue, setFormValue] = useState<any>(INITIAL_FORM_VALUE)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const goToForumDiscoveryScreen = () => {
    navigation.goBack(NAVIGATORS.FORUMS_DISCOVER.name, {
      shouldRefresh: true,
    })
  }

  useEffect(() => {
    if (!formSubmitted || !loading) {
      return
    }
    goToForumDiscoveryScreen()
  }, [formSubmitted, loading])

  const onInputChange = (key: string, value: any) => {
    let updateSpec = {
      [key]: { $set: value },
    }
    setFormValue(update(formValue, updateSpec))
  }

  const onAddTag = (tag: string) => {
    const index = findIndex(formValue.tags, (t: string) => t === tag)
    if (index > -1) {
      return
    }

    setFormValue(update(formValue, { [FORM_FIELDS.TAGS]: { $push: [tag] } }))
  }

  const onRemoveTag = (tag: string) => {
    const index = findIndex(formValue.tags, (t: string) => t === tag)

    setFormValue(
      update(formValue, { [FORM_FIELDS.TAGS]: { $splice: [[index, 1]] } }),
    )
  }

  const onFormSubmit = async () => {
    if (!isFormValid()) {
      return
    }

    createForumPost && createForumPost(formValue)
    setFormSubmitted(true)
  }

  const isFormValid = () => {
    const { image, title, description, category, subCategory } = formValue

    return (
      !isEmpty(image) &&
      !isEmpty(title) &&
      !isEmpty(description) &&
      !isEmpty(category) &&
      !isEmpty(subCategory)
    )
  }

  const selectedImage = get(formValue, FORM_FIELDS.IMAGE) || []
  const selectedImageUrl = selectedImage.map(
    (image: any) => image.path || image.url,
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentSection}>
        <ImageUpload
          imageUrl={selectedImageUrl}
          setImageUrl={(url: any) => onInputChange(FORM_FIELDS.IMAGE, url)}
        />
      </View>

      <View style={styles.contentSection}>
        <ForumContentInput
          titleText={localization.postTitle}
          placeholder={localization.postTitlePlaceholder}
          maxLength={80}
          multiline
          autoFocus={false}
          autoCapitalize={'none'}
          textInputStyle={styles.titleInput}
          value={get(formValue, FORM_FIELDS.TITLE, '')}
          onChangeText={(text: string) =>
            onInputChange(FORM_FIELDS.TITLE, text)
          }
        />
      </View>
      <View style={styles.contentSection}>
        <ForumContentInput
          titleText={localization.postDescription}
          placeholder={localization.postDescriptionPlaceholder}
          multiline
          autoFocus={false}
          autoCapitalize={'none'}
          textInputStyle={styles.descriptionInput}
          value={get(formValue, FORM_FIELDS.DESCRIPTION, '')}
          onChangeText={(text: string) =>
            onInputChange(FORM_FIELDS.DESCRIPTION, text)
          }
        />
      </View>

      <View style={styles.contentSection}>
        <DefaultPicker
          title={localization.category}
          dataSrc={categories}
          iconStartType={IconType.MaterialIcons}
          iconStartName={'event'}
          hightLightColor={COLORS.oceanGreen}
          hint={localization.categoryPlaceholder}
          containerStyle={styles.inputContainer}
          titleStyle={styles.categorySelectTitle}
          selectedValue={get(formValue, `${FORM_FIELDS.CATEGORY}._id`, '')}
          onValueChangeFunc={(value: any) => {
            const category = get(categoryByIds, value, {})
            selectForumFormCategoryId && selectForumFormCategoryId(category._id)
            onInputChange(FORM_FIELDS.CATEGORY, category)
          }}
        />
      </View>

      <View style={styles.contentSection}>
        <DefaultPicker
          title={localization.subCategory}
          dataSrc={subCategories}
          iconStartType={IconType.MaterialIcons}
          iconStartName={'event'}
          hightLightColor={COLORS.oceanGreen}
          hint={localization.subCategoryPlaceholder}
          containerStyle={styles.inputContainer}
          titleStyle={styles.categorySelectTitle}
          selectedValue={get(formValue, `${FORM_FIELDS.SUBCATEGORY}._id`, '')}
          onValueChangeFunc={(value: any) => {
            const subCategory = get(subCategoryByIds, value, {})
            onInputChange(FORM_FIELDS.SUBCATEGORY, subCategory)
          }}
        />
      </View>

      <View style={styles.contentSection}>
        <DefaultAddTags
          title={localization.tag}
          titleStyle={styles.categorySelectTitle}
          placeholder={localization.tagPlaceholder}
          containerStyle={styles.tagContainer}
          iconStartType={IconType.FontAwesome}
          endText={'Add'}
          endTextStyle={styles.endTextInput}
          iconStartName={'tag'}
          autoFocus={false}
          keyboardType={'default'}
          autoCapitalize={'none'}
          focusColor={COLORS.oceanGreen}
          tagCodes={get(formValue, 'tags', [])}
          onAddedFunc={onAddTag}
          onRemovedFunc={onRemoveTag}
        />
      </View>

      <View style={[styles.contentSection, styles.lastContentSection]}>
        <DefaultButton
          text={localization.post}
          textStyle={styles.buttonText}
          isDisabled={!isFormValid()}
          onPress={() => onFormSubmit()}
        />
      </View>
    </ScrollView>
  )
}

export default ForumContentForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    flexDirection: 'column',
  },
  contentSection: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  lastContentSection: {
    paddingBottom: 30,
  },
  title: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    fontWeight: '700',
    fontSize: 14,
  },
  titleInput: {
    height: 40,
  },
  descriptionInput: {
    height: 200,
  },
  inputContainer: {
    marginTop: 20,
  },
  tagContainer: {
    marginTop: 10,
  },
  categorySelectTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  categoryPicker: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  endTextInput: {
    color: COLORS.oceanGreen,
  },
})
