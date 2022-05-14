import { STATISTIC_INFO_NAME } from 'constants'
import { UserType } from 'types/User.types'

export type RootStackParamList = {
  FollowersFollowing: {
    profileId: string
    profileName: string
    tabState: STATISTIC_INFO_NAME
    followingsCount: number
    followersCount: number
    followedUsers: any
  }
  UserProfile: {
    userId: string
  }
  EditProfile: {
    profile: UserType
    allCategory: []
  }
  Reviews: {
    userId: string
    targetId: string
  }
}
