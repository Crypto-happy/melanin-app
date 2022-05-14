import React from 'react';
import { StyleSheet, View,ScrollView, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import COLORS from 'constants/colors';
import Card from 'components/Card';
import { FONT_FAMILIES } from 'constants/fonts';
import { NAVIGATORS } from 'constants/navigators';
import Icon from 'components/Icon';
import { IconType } from 'components/Icon/Icon';
import localizedStrings from 'localization';
import PostThumbnail from './PostThumbnail/PostThumbnail';
import { STATISTIC_INFO_NAME } from 'constants';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import { HeaderBackButton } from '@react-navigation/stack'
import { get, head, isEmpty, reduce, round } from 'lodash'
import { Post } from 'types/Post.types'


interface Props {
  navigation: any
  posts: []
  interactionsGraph: any
  customerReview: {
    shares:number,
    total_rated:number,
    total_likes:number,
    total_comments:number,
  }
  profileStats: {
    male: number,
    visitsCount: number,
    female: number,
    ratingAvg: number,
    interactions:number,
    followersCount: number,
  }
  getCustomerReview: () => void
  getProfileStats: (dropdownType:string) => void
  getPageInteraction: (dropdownType:string) => void
  getTopPosts: (skip: number, limit: number, type:string) => void
}

interface State {
  selectedTab: STATISTIC_INFO_NAME
  profileStateValue: string
  pageInteractionValue: string
}

const { width: screenWidth } = Dimensions.get('screen')
const thumbnailPostWidth = screenWidth / 2 - 30;

class Insights extends React.Component<Props, State> {

  state = {
    profileStateValue:'months',
    pageInteractionValue:'months',
    selectedTab: STATISTIC_INFO_NAME.PHOTO,
  }

  changeProfileState=( profileStateValue:string )=>{

    this.setState({
      profileStateValue
    },()=>{
      
      this.props.getProfileStats(profileStateValue)
    })

  }

  changePageInteraction=( pageInteractionValue:string )=>{

    this.setState({

      pageInteractionValue

    },()=>{
      
      this.props.getPageInteraction(pageInteractionValue)
    })

  }

  onPostThumbnailPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  handleSelectTab = (tabState: STATISTIC_INFO_NAME) => {

    this.setState({ selectedTab: tabState },()=>{
      if(this.state.selectedTab == STATISTIC_INFO_NAME.PHOTO){
        this.props.getTopPosts(0, DEFAULT_ITEMS_PER_PAGE, 'photo');
      }else{
        this.props.getTopPosts(0, DEFAULT_ITEMS_PER_PAGE, 'video');
      }
    })

  }

  componentDidMount(){

    this.props.getCustomerReview();
    this.props.getProfileStats('months');
    this.props.getPageInteraction('months');
    this.props.getTopPosts(0, DEFAULT_ITEMS_PER_PAGE, 'photo');

    const title = localizedStrings.insights.title
    const navigation = this.props.navigation
    navigation.setOptions({
      headerTitle: title,
      headerLeft: () => ( <HeaderBackButton onPress={() => { navigation.goBack() }} />)
    })
    
  }

  renderTab = (tabState: STATISTIC_INFO_NAME) => {

    let tabStyles: Array<any> = [styles.tabView]
    let tabNameStyles: Array<any> = [styles.tabName]

    const { selectedTab } = this.state
    if (selectedTab === tabState) {
      tabStyles.push(styles.selectedTab)
      tabNameStyles.push(styles.selectedTabName)
    }

    return (
      <TouchableOpacity
        style={tabStyles}
        onPress={() => this.handleSelectTab(tabState)}>
        <Text style={tabNameStyles}>
          {tabEnumNames[tabState]}
        </Text>
      </TouchableOpacity>
    )
  }

  renderPostGridItem = (item: any) => {

    const { attachments, viewsCount, sharedBy } = item;
    const attachment = head(attachments)
    const itemType = get(attachment, 'type', '')
    if (isEmpty(itemType)) {
      return null
    }

    const imgUrl =
      itemType === 'video'
        ? get(attachment, 'previewUrl', '')
        : get(attachment, 'url', '')

    return (
      <PostThumbnail
        viewsCount={viewsCount}
        sharedCount={sharedBy.length}
        imgUrl={imgUrl}
        type={itemType}
        width={thumbnailPostWidth}
        onPress={() => this.onPostThumbnailPress(item.id)}
      />
    )
  }

  render() {
    const {customerReview, profileStats, interactionsGraph, posts} = this.props;
    const { profileStateValue } = this.state;

    const malePercent = !!profileStats.male ? round(profileStats.male/profileStats.followersCount*100):0
    const femalePercent = !!profileStats.female ? round(profileStats.female/profileStats.followersCount*100):0

    return (
      <ScrollView>
        <View style={styles.container}> 

        {/*   Customer Review  */}
        <View style={styles.contentWrapper}>
          <Text style={styles.title}> {localizedStrings.insights.customerReviews} </Text>
          <View style={styles.cardContainer}>              
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'thumb-up'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {customerReview.total_likes}</Text>
                    <Text style={styles.label}> Total Likes </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'message-reply-text'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {customerReview.total_comments} </Text>
                    <Text style={styles.label}> Comments </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'share-variant'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {customerReview.shares} </Text>
                    <Text style={styles.label}> Total Shares </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'star'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {customerReview.total_rated} </Text>
                    <Text style={styles.label}> Times Rated </Text>
                  </View> 
                </View>
              </Card>
          
          </View>
        </View>

     
        {/*  Page Intrection */}
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}> {localizedStrings.insights.pageInteractions} </Text>
            <RNPickerSelect
              style={{
                inputAndroid:styles.pickerInput, 
                inputIOS:styles.pickerInput, 
                viewContainer:styles.pickerContainer
              }}
              onValueChange={(value) =>this.changePageInteraction(value)}
              value={this.state.pageInteractionValue}
              items={[
                  { label: 'Monthly', value: 'months' },
                  { label: 'Weekly', value: 'weeks' }
              ]}
            />
          </View>
          <View style={styles.cardContainer}>
            <Card>
              {
                (!!interactionsGraph) &&
                <View style={styles.graphContainer}>
                  <View style={styles.yaxis}>
                    {
                      Object.keys(interactionsGraph.yAxisLabel).map((value, index)=>{
                        return <Text style={styles.label}> {interactionsGraph.yAxisLabel[value]} </Text>
                      })
                    }
                  </View>
                  <ScrollView  showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={styles.cardContent}>
                      {
                        Object.keys(interactionsGraph.result).map((key, index)=>{
                          const count = interactionsGraph.result[key].count;
                          const {yAxisLabel, result} = interactionsGraph;
                          const largestVal = yAxisLabel[Object.keys(yAxisLabel)[Object.keys(yAxisLabel).length - 1]];
                          const finalVal = (count / largestVal) * 170;
                          return(
                            <View key={index} style={styles.barContainer}>
                              <View style={styles.bar}>
                                <LinearGradient 
                                  colors={[COLORS.easternBlue, COLORS.oceanGreen]}
                                  start={{x: 0.0, y: 0}} end={{x: 1.0, y: 1.0}}
                                  style={{width:16, height:round(finalVal), borderRadius:2, position:'absolute', bottom:0, left:0}}
                                >
                                </LinearGradient>
                              </View>
                              <Text style={styles.label}> { result[key]['month'] || result[key]['week'] } </Text>
                            </View>
                          )
                        })
                      }
                    </View>
                  </ScrollView>
              
                </View>
                      
              }
            </Card>
          </View>
        </View>


        {/*   Profile Stats  */}
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}> {localizedStrings.insights.profileStats} </Text>
            <RNPickerSelect
              style={{
                inputAndroid:styles.pickerInput, 
                inputIOS:styles.pickerInput, 
                viewContainer:styles.pickerContainer
              }}
              onValueChange={(value) =>this.changeProfileState(value)}
              value={profileStateValue}
              items={[
                { label: 'This Month', value: 'months' },
                { label: 'This Week', value: 'weeks' },
              ]}
            />
          </View>
          <View style={styles.cardContainer}>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'thumb-up'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> { profileStats.visitsCount} </Text>
                    <Text style={styles.label}> Total Visits </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'eye'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> { profileStats.interactions} </Text>
                    <Text style={styles.label}> Page Interactions </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'account-multiple'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {profileStats.followersCount} </Text>
                    <Text style={styles.label}> Total Followers </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'human-male'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {profileStats.male} </Text>
                    <Text style={styles.label}> Male Follower </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'human-female'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {profileStats.female} </Text>
                    <Text style={styles.label}> Female Follower </Text>
                  </View> 
                </View>
              </Card>
              <Card width={thumbnailPostWidth}>
                <View style={styles.cardContent}>
                  <Icon
                    type={IconType.MaterialCommunityIcons}
                    name={'star'}
                    color={COLORS.lightGreen}
                    size={30}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.count}> {round(profileStats.ratingAvg, 1)}/5 </Text>
                    <Text style={styles.label}> Profile Rating </Text>
                  </View> 
                </View>
              </Card>
          </View>
        </View>

        {/*   Gender Breakdown  */}
        <View style={styles.contentWrapper}>
          <View style={styles.cardContainer}>
            <Card>
              <View>
                <Text> Gender Breakdown </Text>
                <Progress.Bar style={{marginTop:10}} borderRadius = {5} borderWidth = {0} height = {16} color = {COLORS.oceanGreen} animated = {true} progress={malePercent/100} width={screenWidth-70} unfilledColor={COLORS.easternBlue} />
                <View style={styles.progressContent}>
                  <Text style={styles.progressText}> {malePercent}%({profileStats.male}) Male </Text>
                  <Text style={styles.progressText}> {femalePercent}%({profileStats.female}) Female </Text>
                </View>
              </View> 
            </Card>
          </View>
        </View>

        </View>
        {/*  Post ThumbNail */}
        <>
          <Text style={[styles.title, styles.ph20]}> {localizedStrings.insights.topPosts} </Text>
          <View style={[styles.container, styles.topPostContainer]}>
            <View style={styles.tabHeader}>
              {this.renderTab(STATISTIC_INFO_NAME.PHOTO)}

              {this.renderTab(STATISTIC_INFO_NAME.VIDEO)}
            </View>
            <View style={[styles.cardContainer, styles.m15]}>
              {
                posts.map((row, index)=>(
                  this.renderPostGridItem(row)
                ))
              }
            </View>
          
          </View>
        </>

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
  m15:{
    marginVertical:15
  },
  contentWrapper:{

  },
  titleContainer:{
   flexDirection:'row',
   justifyContent:'space-between',
   alignItems:'center',
   marginVertical:10
  },
  title:{
    paddingTop:10,  
    paddingBottom:13,
    fontSize:13,
    fontFamily:FONT_FAMILIES.OPEN_SANS_SEMI_BOLD
  },
  cardContainer:{
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  cardContent:{
    flexDirection:'row',
    alignItems:'center'
  },
  rightContent:{
    marginLeft:14
  },
  count:{
    fontSize:16,
    fontWeight:'600',
    color:COLORS.lightGreen,
    fontFamily:FONT_FAMILIES.OPEN_SANS_SEMI_BOLD
  },
  label:{
    fontSize:12,
    paddingTop:5,
    color:COLORS.black,
    fontFamily:FONT_FAMILIES.ROBOTO
  },
  tabHeader: {
    flex: 1,
    flexDirection: 'row',
    minHeight:48,
    maxHeight: 48,
  },
  tabView: {
    flex: 1,
    marginHorizontal:20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.black,
  },
  selectedTab: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.easternBlue,
  },
  selectedTabName: {
    color: COLORS.easternBlue,
  },
  progressContent :{
    marginTop:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  progressText:{
    fontSize:12,
    color:COLORS.black,
    fontFamily:FONT_FAMILIES.ROBOTO
  },
  topPostContainer:{
    paddingVertical:0,
    backgroundColor:COLORS.white,
  },
  ph20:{
    backgroundColor: COLORS.alabaster,
    paddingHorizontal:20
  },
  graphContainer:{
    flexDirection:'row'
  },
  barContainer:{
    flexDirection:'column',
    alignItems:'center',
    marginRight:15,
  },
  bar:{
    height:170,
    width:16,
    overflow:'hidden',
    borderRadius:2,
    backgroundColor:COLORS.lightGrey
  },
  yaxis:{
    marginRight:20,
    marginBottom:20,
    flexDirection:'column-reverse',
    justifyContent:'space-between'
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
    width:135,
    paddingLeft:10,
    height:35,
    borderRadius:25,
    backgroundColor:COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,  
    elevation: 2,
    fontSize:12
  }
  
})

type TabEnumNamesType = {
  [key in string]: string
}

const tabEnumNames: TabEnumNamesType = {
  [STATISTIC_INFO_NAME.PHOTO]: 'Photo',
  [STATISTIC_INFO_NAME.VIDEO]: 'Video',
}

export default Insights


 
