import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import localizedStrings from 'localization'
import COLORS from '../../constants/colors'
import { UserType } from 'types/User.types'
import UserAvatar from 'components/UserAvatar'
import { ACCOUNT_TYPE } from 'types'
import { DefaultButton } from 'components/DefaultButton'
import { NAVIGATORS } from '../../constants/navigators'


interface Props {
  navigation: any,
  authUser:any
  settingData:any
  blockedUserList:any
  updateUserSetting: (settingObj:object) => void
  getBlockedUser: () => void
  blockUser: (id:string) => void

}

interface State {

}

class BlockedAccounts extends React.Component<Props, State> {


  constructor(props: Props) {
    super(props)
    this.state = {
      
    }
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    this.props.getBlockedUser()
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    
  }


  keyExtractor = (item: UserType) => {
    return `__${item.id}`
  }

  handleAvatarAndUserNamePress = (id: string) => () => {
    this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
      userId: id,
    })
  }

  onPressblockUnblock = (userId: string) => () => {

    const {blockedUserList} = this.props;
    const _index  = blockedUserList.findIndex( (o:any) => o.id == userId);
  
    blockedUserList.splice(_index, 1);

    this.props.blockUser(userId)

    this.setState(this.state)
    
  }

  renderListItem = ({ item }: { item: UserType }) => {
    const localization = localizedStrings.blockedAccount;
    const navigateToUserProfile = this.handleAvatarAndUserNamePress(item.id)
    const pressBlockUnblock = this.onPressblockUnblock(item.id)

    return (
      <View style={styles.listItemWrapper}>
        <TouchableOpacity onPress={navigateToUserProfile}>
          <UserAvatar
            imgSrc={item.avatar}
            heightOrWidth={40}
            isBusiness={item.accountType === ACCOUNT_TYPE.BUSINESS}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemName}
          onPress={navigateToUserProfile}>
          <Text>{item.name}</Text>
        </TouchableOpacity>

        <DefaultButton
          contentContainerStyle={styles.itemAction}
          text={localization.unBlockButton}
          onPress={pressBlockUnblock}
        />
      </View>
    )
  }

  renderEmptyContainer = () => {
    return (
      <View style={styles.emptyMessageContainer}>
        <Text style={styles.emptyMessage}>{localizedStrings.blockedAccount.emptyMessage}</Text> 
      </View>
    )
  }

  render() {

    const {settingData, blockedUserList} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={[styles.listContainer]}
          data={blockedUserList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
          ListEmptyComponent={(e)=>this.renderEmptyContainer()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
  },
  tabHeader: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 48,
  },
  tabView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.silver,
  },
  selectedTab: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
  selectedTabName: {
    color: COLORS.black,
  },
  listContainer: {
    flex: 1,
  },
  listItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  itemAction: {
    maxHeight: 26,
  },
  emptyMessageContainer:{
    textAlign: 'center',
    flex:1,
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  emptyMessage: {
    flex:1,
    paddingVertical:50,
    height:'100%',
    color:COLORS.black,
  }
})


export default BlockedAccounts
