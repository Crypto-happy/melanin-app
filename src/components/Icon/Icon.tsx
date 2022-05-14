import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Zocial from 'react-native-vector-icons/Zocial'
import { TextStyle } from 'react-native'

export enum IconType {
  AntDesign = 'AntDesign',
  Entypo = 'Entypo',
  EvilIcons = 'EvilIcons',
  Feather = 'Feather',
  FontAwesome = 'FontAwesome',
  FontAwesome5 = 'FontAwesome5',
  Fontisto = 'Fontisto',
  Foundation = 'Foundation',
  Ionicons = 'Ionicons',
  MaterialCommunityIcons = 'MaterialCommunityIcons',
  MaterialIcons = 'MaterialIcons',
  SimpleLineIcons = 'SimpleLineIcons',
  Octicons = 'Octicons',
  Zocial = 'Zocial',
}

export interface IconProps {
  type: IconType
  name: string
  color: string
  size: number
  style?: TextStyle
}

const getIconSourceFromType = (type: IconType) => {
  switch (type) {
    case IconType.AntDesign:
      return AntDesign
    case IconType.Entypo:
      return Entypo
    case IconType.EvilIcons:
      return EvilIcons
    case IconType.Feather:
      return Feather
    case IconType.FontAwesome:
      return FontAwesome
    case IconType.FontAwesome5:
      return FontAwesome5
    case IconType.Fontisto:
      return Fontisto
    case IconType.Foundation:
      return Foundation
    case IconType.Ionicons:
      return Ionicons
    case IconType.MaterialCommunityIcons:
      return MaterialCommunityIcons
    case IconType.MaterialIcons:
      return MaterialIcons
    case IconType.SimpleLineIcons:
      return SimpleLineIcons
    case IconType.Octicons:
      return Octicons
    case IconType.Zocial:
      return Zocial
  }
}

const Icon = (props: IconProps) => {
  const { type, ...rest } = props

  const Source = getIconSourceFromType(type)

  return <Source {...rest} />
}

export default Icon
