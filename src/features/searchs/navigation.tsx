import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from 'localization'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'

export const makeProfileOptions = (
  editHandler: (suggest: string) => void,
  focusHandler: () => void,
) => {
  return {
    headerLeft: (props: StackHeaderLeftButtonProps) => (
      // <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          // hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={props.onPress}>
          <Icon
            type={IconType.MaterialIcons}
            name={'arrow-back'}
            color={COLORS.black}
            size={30}
          />
        </TouchableOpacity>
        <View>
          <TextInput
            style={styles.textinput}
            // onChangeText={this.searchedAdresses}
            onChangeText={(suggest) => editHandler(suggest)}
            onFocus={() => focusHandler()}
            // value={this.state.text}
            placeholder="Search MelaninPeople"
          />
          {/* <View style={{position:"absolute",top:40,width:'100%',backgroundColor:'white'}}>
                        <FlatList
                            data={[
                              {key: 'Devin'},
                              {key: 'Dan'},
                              {key: 'Dominic'},
                              {key: 'Jackson'},
                              {key: 'James'},
                              {key: 'Joel'},
                              {key: 'John'},
                              {key: 'Jillian'},
                              {key: 'Jimmy'},
                              {key: 'Julie'},
                            ]}
                            renderItem={({item}) => <Text>{item.key}</Text>}
                          />
                    </View>*/}
        </View>

        {/* <ListView
                    dataSource={ds.cloneWithRows(this.state.searchedAdresses)}
          renderRow={this.renderAdress} /> */}
      </View>
    ),
    headerTitle: () => null,
    headerRight: () => (
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          // hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Icon
            type={IconType.MaterialCommunityIcons}
            name={'magnify'}
            color="#289FB9"
            size={30}
          />
        </TouchableOpacity>
      </View>
    ),
    headerLeftContainerStyle: headerStyles.headerLeftContainer,
    headerTitleAlign: 'left',
    headerStyle: headerStyles.container,
  }
}

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginLeft: 20,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: 10,
  },
  editButton: {
    marginHorizontal: 14,
  },
  shareButton: {
    marginRight: 14,
  },
  logoBrandYoutube: {
    width: 40,
    resizeMode: 'contain',
    marginRight: 6,
  },
  logoBrandInsta: {
    width: 40,
    resizeMode: 'contain',
    marginRight: 20,
  },
  textinput: {
    // marginTop: 30,
    fontSize: 20,
    backgroundColor: 'transparent',
  },
})
const headerStyles = StyleSheet.create({
  container: {
    elevation: 0,
    shadowOpacity: 0,
  },

  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  backButton: {
    // marginRight: 17,
  },
  headerLeftContainer: {
    paddingHorizontal: 0,
    paddingLeft: 20,
  },
  headerRightButton: {
    padding: 11,
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    alignItems: 'center',
  },
})
