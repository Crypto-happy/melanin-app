export interface DirectoryType {
  ratingAvg?: number
  location?: string
  _id: string
  city?: string
  state?: string
  avatar?: string
  tagCodes?: []
  subCategory?: {
    _id?: string
    categoryId?: string
    name?: string
  }
}
