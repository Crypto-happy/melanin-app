import React from 'react'
import { StyleSheet, Text,ScrollView, View } from 'react-native'
import COLORS from 'constants/colors'
import RNPickerSelect from 'react-native-picker-select';
import { FONT_FAMILIES } from 'constants/fonts';


interface Props {
  navigation: any,
  settingData:any
  updateUserSetting: (settingObj:object) => void
}

interface State {
}

class PersonalInformation extends React.Component<Props, State> {

  state = {
    gender:''
  }

  componentDidMount(){

    this.handleChange(this.props.settingData.gender)

  }

  handleChange=(gender:string)=>{
    const {settingData} = this.props;
    this.setState({
      gender
    },()=>{
      let _settingObj = {
        "changedFields": {
            "email": 0,
            "username": 0
        },
        "fullName":settingData.name,
      }
      settingData.gender = gender;
      _settingObj = { ..._settingObj, ...settingData }
      this.props.updateUserSetting(_settingObj)
    })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}> Select Gender </Text>
          <RNPickerSelect
            style={{
              inputAndroid:styles.pickerInput, 
              inputIOS:styles.pickerInput, 
              viewContainer:styles.pickerContainer
            }}
            onValueChange={(value) => this.handleChange(value)}
            value={this.state.gender}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Transgender', value: 'transgender' },
              { label: 'Gender neutral', value: 'gender neutral' },
              { label: 'Non-binary', value: 'non-binary' },
              { label: 'Agender', value: 'agender' },
              { label: 'Pangender', value: 'pangender' },
              { label: 'Genderqueer', value: 'genderqueer' },
              { label: 'Two-spirit', value: 'two-spirit' },
              { label: 'Third gender', value: 'third gender' },
              { label: 'I Prefer Not To Say', value: 'i prefer not to say' },
            ]}
          />
        </View>     
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    paddingVertical:14,
    backgroundColor: COLORS.alabaster,
  },
  title:{
    paddingTop:10,  
    paddingBottom:13,
    fontSize:13,
    fontFamily:FONT_FAMILIES.OPEN_SANS_SEMI_BOLD
  },
  pickerInput:{
    padding:0,
    marginTop:-7,
    justifyContent:'center',
    alignItems:'center',
    fontSize:12
  },  
  pickerContainer:{
    flex:0,
    width:'100%',
    paddingLeft:10,
    height:40,
    borderRadius:25,
    backgroundColor:COLORS.white,
    borderWidth:1,
    borderColor:COLORS.lightSilver,
    fontSize:12
  }
})

export default PersonalInformation

 
