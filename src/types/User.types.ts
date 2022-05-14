import { ACCOUNT_TYPE } from './index'

export interface UserType {
  accountType?: ACCOUNT_TYPE
  activated?: boolean
  ratingAvg?: number
  location?: string
  _id: string
  id: string
  email?: string
  name: string
  addressOne: string
  addressTwo: string
  city: string
  state: string
  zipCode: string
  createdAt?: string
  updatedAt?: string
  avatar?: string
  username?: string
  phoneNumber?: string
  website?: string
  company?: string
  isFollowing?: boolean
  linkedInId?: string
  tagCodes?: []
  aboutCEO?: string
  facebookUserId?: string
  twitterUserId?: string
  youtubeUserId?: string
  instagramUserId?: string
  businessCategory?: string
  __v?: number
  workingHours?: [
    {
      closing: string
      dayOfWeek: string
      opening: string
    },
  ]
  yearFounded?: {
    dateStr: string
    timeStamp: number
  }
  subCategory?: {
    _id: string
    categoryId: string
    name: string
  }
  category?: {
    _id: string
    name: string
  }
  totalLoyaltyToken: number
  referralCode: string
}

export interface TopProfileUserType extends UserType {
  totalRatedPostPoint: number
  totalRatedPostCount: number
  totalReviewsPoint: number
  totalReviewsCount: number
  totalInteractions: number
  visitsCount: number
  totalPoint: number
}

export interface DirectoryBusinessProfileType extends UserType {
  viewPostsCount: number
  likePostsCount: number
  ratingPostsPoint: number
  ratingPostsCount: number
  ratingReviewsPoint: number
  ratingReviewsCount: number
  ratingProfileAvg: number
}
