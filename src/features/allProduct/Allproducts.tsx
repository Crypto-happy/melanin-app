import React from 'react'
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Route,
  FlatList,
  Dimensions,
} from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import localizedStrings from 'localization'
import Icon, { IconType } from 'components/Icon/Icon'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'
import { NAVIGATORS } from 'constants/navigators'
import NumberFormat from 'react-number-format'
import FastImage from 'react-native-fast-image'
import { ATTACHMENT_TYPE } from 'types'
import { get, isEmpty } from 'lodash'

interface State {
  query: string
  value: string
  filterMin: number
  filterMax: number
  product_type: string
}

interface Product {
  _id: string
  name: string
  nameLower: string
  price: number
  salePrice: number
  link: string
  productCategory: string
  post: Post
}

interface Post {
  _id: string
  viewsCount: number
  ratingAvg: number
  attachments: Array<Attachment>
}

interface Attachment {
  _id: string
  type: string
  previewUrl: string
  url: string
}

interface Props extends Route {
  route: any
  authUser: any
  loading: boolean
  success: boolean
  error: boolean

  reset: () => void

  fetchSearchProductsByText: (query: string, type: int) => void

  searchProductsByText: Array<Product>

  fetchFeaturedProducts: (skip: number, limit: number) => void

  featuredProducts: Array<Product>
  paginationFeaturedProducts: {
    skip: number
    endReached: boolean
  }
  featuredProductsScrollEnded: boolean

  fetchFiveStarProducts: (skip: number, limit: number) => void

  fiveStarProducts: Array<Product>
  paginationFiveStarProducts: {
    skip: number
    endReached: boolean
  }
  fiveStarProductsScrollEnded: boolean
}

class Allproducts extends React.Component<Props, State> {
  lastQueryUpdateTime: Date
  constructor(props: Props) {
    super(props)
    this.state = {
      query: '',
      value: '',
      filterMin: 4,
      filterMax: 5,
      product_type: '',
    }
    this.lastQueryUpdateTime = new Date()
  }

  componentDidMount() {
    const title = global.type
    const navigation = this.props.navigation
    navigation.setOptions({
      headerTitle: (props: StackHeaderTitleProps) => (
        <Text style={styles.title}>{title}</Text>
      ),
      headerLeft: (props: StackHeaderLeftButtonProps) => {
        return (
          <>
            <TouchableOpacity
              style={styles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={() => {
                navigation.goBack()
              }}>
              <Icon
                type={IconType.MaterialIcons}
                name={'arrow-back'}
                color={COLORS.black}
                size={30}
              />
            </TouchableOpacity>
          </>
        )
      },
    })
    this.props.reset()

    if (global.type == 'Featured') {
      this.props.fetchSearchProductsByText(this.state.query, 1)
    } else {
      this.props.fetchSearchProductsByText(this.state.query, 2)
    }
  }

  onItemViewDetailPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  renderItem = ({ item }) => {
    const { post } = item

    const attachment = get(post, 'attachments.0', {})
    const attachmentType = get(attachment, 'type', '')
    let uri = get(attachment, 'previewUrl', '')

    if (attachmentType === ATTACHMENT_TYPE.PHOTO) {
      uri = get(attachment, 'url', '')
    }

    return (
      <TouchableOpacity
        onPress={() => this.onItemViewDetailPress(item.post._id)}>
        <View style={styles.productItem}>
          {item.post ? (
            <FastImage
              source={
                isEmpty(uri)
                  ? require('../../assets/images/empty_image.png')
                  : { uri }
              }
              style={[styles.productImage, styles.productImageStyle]}
            />
          ) : (
            <FastImage
              source={require('../../assets/images/empty_image.png')}
              style={[styles.productImage, styles.productImageStyle]}
            />
          )}

          <View style={styles.productTextContainer}>
            <View style={styles.productTextView1}>
              <Text style={styles.productNameText}>{item.name}</Text>

              <NumberFormat
                value={item.salePrice ? item.salePrice.toFixed(0) : '0'}
                displayType={'text'}
                thousandSeparator={true}
                fixedDecimalScale={false}
                prefix={'$'}
                renderText={(value) => (
                  <Text style={styles.priceText}>{value}</Text>
                )}
              />
            </View>

            <View style={styles.productTextView2}>
              <Icon
                type={IconType.Entypo}
                name={'eye'}
                color={COLORS.darkGrey}
                size={15}
              />
              <Text style={styles.productText}>
                {item.post ? item.post.viewsCount : 0}
              </Text>
              <Icon
                type={IconType.Entypo}
                name={'star'}
                color={COLORS.darkGrey}
                size={15}
              />
              <Text style={styles.productText}>
                {item.post ? item.post.ratingAvg : 0}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  handleOnClearText() {
    this.setState({ query: '' })
    this.props.reset()

    if (global.type == 'Featured') {
      this.props.fetchSearchProductsByText('', 1)
    } else {
      this.props.fetchSearchProductsByText('', 2)
    }
  }

  updateSearch = (query: string) => {
    this.setState({ query })
    this.props.reset()

    this.lastQueryUpdateTime = new Date()
    setTimeout(() => {
      if (
        this.lastQueryUpdateTime &&
        new Date().getTime() - this.lastQueryUpdateTime.getTime() > 1000
      ) {
        if (global.type == 'Featured') {
          if (query == '') {
            this.props.fetchSearchProductsByText('', 1)
          } else {
            this.props.fetchSearchProductsByText(query, 1)
          }
        } else {
          if (query == '') {
            this.props.fetchSearchProductsByText('', 2)
          } else {
            this.props.fetchSearchProductsByText(query, 2)
          }
        }
      }
    }, 1000)
  }

  render() {
    const localization = localizedStrings.marketplace
    const { searchProductsByText } = this.props
    const { query } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={
              query.length > 0
                ? styles.search_TextInput
                : styles.search_TextInput_empty
            }
            placeholderTextColor={COLORS.grey}
            placeholder="Search ..."
            value={query}
            autoCapitalize="none"
            onChangeText={(value) => this.updateSearch(value)}
            blurOnSubmit={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => this.handleOnClearText()}>
              <Icon
                type={IconType.AntDesign}
                name={'closecircleo'}
                color={COLORS.easternBlue}
                size={20}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.wrapper}>
          {searchProductsByText.length != 0 ? (
            <FlatList
              style={[styles.list, { marginTop: 15 }]}
              keyExtractor={(item, index) => item._id}
              onEndReachedThreshold={0.7}
              data={searchProductsByText}
              numColumns={2}
              renderItem={this.renderItem}
            />
          ) : (
            <View
              style={{
                flex: 1,
                height: 500,
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  search_TextInput: {
    fontSize: 17,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    width: '90%',
    color: '#000',
  },
  search_TextInput_empty: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 17,
    width: '95%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    marginTop: 5,
  },

  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.lightGrey,
  },
  backButton: {
    marginEnd: 17,
    marginStart: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  searchbar: {
    backgroundColor: 'white',
  },
  searchbartxt: {
    backgroundColor: 'white',
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.grey,
  },
  subTitle: {
    flex: 1,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 16,
    color: COLORS.black,
    margin: 15,
  },
  list: {
    flex: 1,
    width: '100%',
  },

  headerTitle: {
    flexDirection: 'row',
  },

  // items
  featuredMediaWrapper: {
    width: 200,
    height: 200,
    marginStart: 15,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  featuredMedia: {
    borderRadius: 15,
  },
  bottomLay: {
    height: '10%',
    width: '100%',
    paddingBottom: 10,
    paddingStart: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  countText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginEnd: 10,
    color: COLORS.white,
  },

  productItem: {
    height: 260,
    width: Dimensions.get('window').width * 0.45,
    marginBottom: 20,
    marginLeft: 15,
    borderRadius: 15,
  },
  productImage: {
    height: 190,
    width: Dimensions.get('window').width * 0.45,
  },
  productImageStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productTextContainer: {
    height: 70,
    width: Dimensions.get('window').width * 0.45,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  productTextView1: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productTextView2: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    marginBottom: 7,
  },
  productNameText: {
    width: '60%',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginEnd: 10,
    marginLeft: 10,
    marginTop: 5,
    color: COLORS.black,
  },
  productText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginEnd: 10,
    color: COLORS.darkGrey,
  },
  priceText: {
    width: '30%',
    textAlign: 'right',
    alignSelf: 'flex-start',
    color: '#00c569',
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    fontSize: 12,
    paddingRight: 10,
    marginTop: 5,
    flexWrap: 'wrap',
  },
})
export default Allproducts
