import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { isEmpty } from 'lodash'
import ImagePicker from 'react-native-image-crop-picker'
import localizedStrings from 'localization'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import ImageGallery from 'components/ImageGallery'

type Props = {
  imageUrl: any
  setImageUrl: (imageUrl: any) => void
}

const ImageUpload = ({ imageUrl, setImageUrl }: Props) => {
  const openImagePicker = async () => {
    const selectedImage = (await ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      width: 1200,
      height: 1200,
      compressImageMaxWidth: 1200,
      compressImageMaxHeight: 1200,
      compressImageQuality: 0.8,
      freeStyleCropEnabled: true,
      cropperToolbarColor: COLORS.white,
      cropperTintColor: COLORS.cornFlowerBlue,
      cropperActiveWidgetColor: COLORS.cornFlowerBlue,
      multiple: true,
      maxFiles: 1,
    })) as any

    setImageUrl(selectedImage)
  }

  return (
    <>
      <Text style={styles.title}>
        {localizedStrings.forums.form.addContentImage}
      </Text>

      {isEmpty(imageUrl) && (
        <TouchableOpacity style={styles.imagePreview} onPress={openImagePicker}>
          <Icon
            type={IconType.MaterialIcons}
            name={'insert-photo'}
            color={COLORS.oceanGreen}
            size={25}
          />
        </TouchableOpacity>
      )}

      {!isEmpty(imageUrl) && (
        <View style={[styles.imageContainer]}>
          <ImageGallery images={imageUrl} />
        </View>
      )}
    </>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    marginBottom: 20,
  },
  imagePreview: {
    backgroundColor: '#f6f6f6',
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imageContainer: {
    borderWidth: 0,
  },
})
