export const DEFAULT_ITEMS_PER_PAGE = 10

export const DEFAULT_COMMUNITY_POSTS_PER_PAGE = 30

export const DEFAULT_FEATURE_MEDIA_PER_PAGE = 32

export const DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE = 32

export const DEFAULT_GRID_ITEMS_PER_PAGE = 20

export enum REPORT_POST_REASONS {
  SPAM,
  NUDITY_OR_SEXUAL_ACTIVITY,
  HATE_SPEECH_OR_SYMBOLS,
  VIOLENCE_OR_DANGEROUS_ORGANIZATIONS,
  SALE_OF_ILLEGAL_OR_REGULATED_GOODS,
  BULLYING_OR_HARASSMENT,
  INTELLECTUAL_PROPERTY_VIOLATION,
  SUICIDE_SELF_INJURY_OR_EATING_DISORDERS,
  SCAM_OR_FRAUD,
  FALSE_INFORMATION,
}

export enum STATISTIC_INFO_NAME {
  POSTS,
  FOLLOWERS,
  FOLLOWING,
  REVIEWS,
  PHOTO,
  VIDEO,
  FOLLOWTOP,
  MEDIA,
  USERS,
  COMMUNITYFLORNTS,
}

export enum POST_VISIBILITY {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  ONLY_ME = 'only_me',
}

export const VIDEO_MAXIMUM_LENGTH = 60

export const VIDEO_PREVIEW_MAX_SIZE = 1200

export const DEFAULT_BUTTON_HIT_SLOP = {
  top: 12,
  right: 12,
  bottom: 12,
  left: 12,
}

export enum NEW_POST_MODE {
  CREATE,
  EDIT,
}

export enum SOCIAL_LINK_TYPE {
  WEBSITE,
  FACEBOOK,
  TWITTER,
  YOUTUBE,
  INSTAGRAM,
  EMAIL,
  LINKED_IN,
}

export enum POST_TYPE {
  NORMAL = 'normal',
  PRODUCT = 'product',
}

export const florntScheme = 'flornt://'
export const webScheme = 'https://melaninpeopleshop.com/flornt'
export const dynamicLinkPrefix = 'https://melaninpeopleapp.page.link'
export const webAppDynamicPrefix = 'https://www.melaninpeople.com/dynamic'

export const androidPackageName = 'com.melaninpeople.mobile'
export const iOSBundleId = 'com.melaninpeople.mobile'

export enum SOCKET_EVENT {
  CONNECT_SUCCESS = 'connect',
  CONNECT_FAILURE = 'connect_error',
  DISCONNECTED = 'disconnected',
  CHAT_MESSAGE = 'chat_message',
  DELETE_MESSAGE = 'delete_message',
  JOIN = 'join',
  IS_TYPING = 'is_typing',
}

export enum USER_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum CHAT_ROOM_ACTION {
  BLOCK = 'BLOCK',
  ALLOW = 'ALLOW',
  MUTE = 'MUTE',
  DELETE = 'DELETE',
}

export enum NAVIGATE_FROM_SOURCE {
  DIRECTORIES_RESULT = 'DIRECTORIES_RESULT',
}
