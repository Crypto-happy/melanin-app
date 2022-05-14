import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONT_FAMILIES } from '../../../../constants/fonts'
import COLORS from 'constants/colors'


export interface CommunityFlorntsProps {
  data: any
}

class CommunityFlornts extends React.PureComponent<CommunityFlorntsProps> {

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getPosts,
      loading,
    } = this.props

    if (loading || endReached) {
      return
    }

    getPosts(skip + DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE)
  }

  render() {
    return(
      <FlatList
        data={posts}
        extraData={viewableItemIndexes}
        renderItem={this.renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={this.renderItemSeparator}
        onEndReached={this.onListEndReached}
        onEndReachedThreshold={0.7}
        onViewableItemsChanged={this.onViewableItemsChanged}
        windowSize={3}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    paddingHorizontal: 19,
    paddingBottom:19,
    marginBottom:19,
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor:COLORS.alabaster
  },
  childPost: {
    alignItems: 'stretch',
    paddingLeft: 19,
  },
  topInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  topRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  userName: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1,
  },
  createdTime: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.silver,
    marginRight: 10,
  },
  postText: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 15,
    color: COLORS.black,
  },
  postTextContainer: {
    marginBottom: 11,
  },
  attachmentView: {
    marginBottom: 0,
    borderRadius:5,
    overflow:'hidden'
  },
  bottomInfo: {
    opacity:1,
    bottom:0,
    paddingVertical:10,
    width:'100%',
    position:'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButton: {
    marginRight: 15,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 11,
    color: COLORS.white,
    marginLeft: 10,
  },
  dislikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsContainer: {
    marginHorizontal:6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    marginRight: 5,
    marginBottom: 10,
  },
  viewProductButton: {
    width: 150,
    height: 40,
    marginBottom: 20,
  },
  imageContainer:{
    borderRadius:5, 
    position:'relative'
  }
})

export default CommunityFlornts
