import React from 'react'
import { StyleSheet, Text,ScrollView, View, TouchableOpacity } from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts';
import {commentsOptions} from './commentsOptions';
import LinearGradient from 'react-native-linear-gradient'
import localizedStrings from '../../localization'


interface Props {
  navigation: any
  settingData: any
  updateUserSetting: (settingObj:object) => void
}

interface State {
  selectedTab:string
}

class Comments extends React.Component<Props, State> {

  state = {
    selectedTab:'Everyone'
  }

  componentDidMount(){
    const {settingData} = this.props;
    this.setState({
      selectedTab:settingData.allowComments
    })
  }

  handleItemPress = (selectedTab:string) => {
    const {settingData} = this.props;
    this.setState({
      selectedTab
    },()=>{
      let _settingObj = {
        "changedFields": {
            "email": 0,
            "username": 0
        },
        "allowComments":selectedTab,
        "email":settingData.email,
        "fullName":settingData.name,
        "accountType":settingData.accountType
      }
      
      settingData.allowComments = selectedTab;
      _settingObj = { ..._settingObj, ...settingData }

      this.props.updateUserSetting(_settingObj)
    })
  }

  render() {
    const {selectedTab} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.listItemContainer}>
          <View style={[styles.listItem]}>
            <Text style={[styles.listText]}>{  localizedStrings.comments.whoCan}</Text>
          </View>
        </View>  
        <>
          {
            commentsOptions.map((option:any, i:number)=>(
              <View key={i} style={[styles.listItemContainer, {backgroundColor:COLORS[option.name==selectedTab?'lightEasternBlue':'transparent']}]}>
                <LinearGradient colors={[COLORS.easternBlue, COLORS.oceanGreen]}
                  start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                  style={{width:3}}
                >
                </LinearGradient>
                <TouchableOpacity style={styles.listItem} onPress={(e)=>this.handleItemPress(option.name)}>
                  <Text style={styles.listText}>{option.name}</Text>
                </TouchableOpacity>
              </View>
            ))        
          }
        </>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:14,
    backgroundColor: COLORS.alabaster,
  },
  listItemHeading:{

  },
  listText:{
    fontSize:15,
    fontFamily: FONT_FAMILIES.OPEN_SANS_SEMI_BOLD,
    color:COLORS.black
  },
  listItemContainer:{
    flexDirection:'row',
    
  },
  listItem:{
    flex:1,
    justifyContent:'space-between',
    flexDirection:'row',
    paddingVertical:20,
    paddingLeft: 33,
    paddingRight: 24,
  }
})

export default Comments

 
