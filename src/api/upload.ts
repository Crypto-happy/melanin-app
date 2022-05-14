import apiInstance from 'api/base'

export const upload = async (
  attachment: any,
  uploadProgressHandler?: (event: ProgressEvent) => void,
) => {
  const { source, mime, fileName } = attachment
  let fileOptions = {
    uri: source,
    type: mime,
    name: fileName,
  }
  const formData = new FormData()
  formData.append('file', fileOptions)

  return apiInstance.post('upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: uploadProgressHandler,
  })
}
