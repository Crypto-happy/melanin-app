import React from 'react'
import {
  Alert,
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
import {countryList} from './CountryList'; 


interface Props {
  navigation: any
  settingData: any
  updateUserSetting: (settingObj:object) => void
}

interface State {
  countryName:string

}

class CountryScreen extends React.Component<Props, State> {


  constructor(props: Props) {
    super(props)
    this.state = {
      countryName:''
    }
  }

  componentWillUnmount() {

  }

  componentDidMount() {
    const {settingData} = this.props;
    this.setState({
      countryName:settingData.country
    })
   
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    
  }


  keyExtractor = (item: UserType) => {
    return `__${item.id}`
  }

  selectCountry=(countryName:string)=>{
      const {settingData} = this.props;
      this.setState({
        countryName
      },()=>{
        let _settingObj = {
          "changedFields": {
              "email": 0,
              "username": 0
          },
          "fullName":settingData.name,
        }

        settingData.country = countryName;
        _settingObj = { ..._settingObj, ...settingData }

        this.props.updateUserSetting(_settingObj)
        
      })
  }

  renderListItem = ({ item }: { item: any }) => {
    return (
      <View style={[styles.listItemWrapper,{backgroundColor:COLORS[item==this.state.countryName?'lightEasternBlue':'transparent']}]}>
        <TouchableOpacity
          style={styles.itemName}
          onPress={(e)=>this.selectCountry(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={[styles.listContainer]}
          data={countryList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
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
})


export default CountryScreen
