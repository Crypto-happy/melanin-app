export interface AttachmentSize {
  originalWidth: number
  originalHeight: number
  width: number
  height: number
}

export interface Attachment {
  type: string
  url: string
  previewUrl: string
  title: string
  description: string
  size?: AttachmentSize
}
