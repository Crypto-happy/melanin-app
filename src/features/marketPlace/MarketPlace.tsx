import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Route,
  FlatList,
  Dimensions,
} from 'react-native'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import { ScrollView } from 'react-native-gesture-handler'
import localizedStrings from 'localization'
import Icon, { IconType } from 'components/Icon/Icon'
import { NAVIGATORS } from 'constants/navigators'
import { Picker } from '@react-native-picker/picker'
import NumberFormat from 'react-number-format'
import RNPickerSelect from 'react-native-picker-select'
import FastImage from 'react-native-fast-image'

interface State {
  query: string
  category_id: string
  filterMin: number
  filterMax: number
  perPage: number
  searchState: boolean
  searchType: boolean
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
  authUser: any
  loading: boolean
  success: boolean
  error: boolean

  reset: () => void
  fetchProductCategories: () => void

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

  fetchAllProducts: (skip: number, limit: number) => void

  allproducts: Array<Product>
  paginationAllProducts: {
    skip: number
    endReached: boolean
  }
  allProductsScrollEnded: boolean

  fetchSearchProductsByText: (query: string) => void

  searchProductsByText: Array<Product>

  fetchSearchProductsByCategory: (category_id: string) => void

  searchProductByCategories: Array<Product>
}

class MarketPlace extends React.Component<Props, State> {
  lastQueryUpdateTime: Date
  constructor(props: Props) {
    super(props)
    this.state = {
      query: '',
      category_id: 'all',
      filterMin: 4,
      filterMax: 5,
      perPage: 20,
      searchState: true,
      searchType: true, // --text search
    }
    this.lastQueryUpdateTime = new Date()
  }

  componentDidMount() {
    this.reRenderSomething = this.props.navigation.addListener('focus', () => {
      this.handleOnClearText()
    })
  }

  componentWillUnmount() {
    this.reRenderSomething
  }

  handlepropertystate = (category_id: string) => {
    if (category_id == 'all') {
      this.setState({ category_id: 'all' })

      this.handleOnClearText()
    } else {
      this.setState({ category_id })
      this.setState({ searchState: false })
      this.setState({ searchType: false })
      this.props.fetchSearchProductsByCategory(category_id)
    }
  }

  onItemViewDetailPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  onAllproductsPress = (type: string) => {
    this.props.navigation.push(NAVIGATORS.ALL_PRODUCTS_STACK.name)
    global.type = type
  }

  handleOnClearText() {
    this.setState({
      category_id: 'all',
      query: '',
      searchState: true,
      searchType: true,
    })

    this.props.reset()
    this.props.fetchProductCategories()
    this.props.fetchFeaturedProducts(0, this.state.perPage)
    this.props.fetchFiveStarProducts(0, this.state.perPage)
  }

  updateSearch = (query: string) => {
    this.setState({ category_id: 'all', query: query })
    this.lastQueryUpdateTime = new Date()
    setTimeout(() => {
      if (
        this.lastQueryUpdateTime &&
        new Date().getTime() - this.lastQueryUpdateTime.getTime() > 1000
      ) {
        this.props.reset()
        this.props.fetchProductCategories()
        if (query == '') {
          this.setState({ searchState: true, searchType: true })
          this.props.fetchFeaturedProducts(0, this.state.perPage)
          this.props.fetchFiveStarProducts(0, this.state.perPage)
        } else {
          this.setState({ searchState: false, searchType: true })
          this.props.fetchSearchProductsByText(query)
        }
      }
    }, 1000)
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToRight = 15
    return (
      layoutMeasurement.width + contentOffset.x >=
      contentSize.width - paddingToRight
    )
  }

  onFeaturedProductEndReached = () => {
    if (this.props.featuredProductsScrollEnded === true) return
    this.props.fetchFeaturedProducts(
      (this.props.paginationFeaturedProducts === undefined
        ? 0
        : this.props.paginationFeaturedProducts.skip) + this.state.perPage,
      this.state.perPage,
    )
  }

  renderFeaturedProduct = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ marginStart: 15 }}
        onPress={() => this.onItemViewDetailPress(item.post._id)}>
        <FastImage
          style={[styles.featuredMediaWrapper, styles.featuredMedia]}
          source={
            item.post.attachments.length
              ? { uri: item.post.attachments[0].url }
              : require('../../assets/images/empty_image.png')
          }>
          <View
            style={[
              styles.bottomLay,
              { justifyContent: 'space-between', flex: 1 },
            ]}>
            <Text style={[styles.countText, { width: '60%' }]}>
              {item.name}
            </Text>

            <NumberFormat
              value={item.salePrice ? item.salePrice.toFixed(0) : '0'}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={(value) => (
                <Text
                  style={[
                    styles.countText,
                    {
                      width: '30%',
                      textAlign: 'right',
                      alignSelf: 'flex-end',
                      color: '#00c569',
                      fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
                    },
                  ]}>
                  {value}
                </Text>
              )}
            />
          </View>

          <View style={styles.bottomLay}>
            <Icon
              type={IconType.Entypo}
              name={'eye'}
              color={COLORS.white}
              size={15}
            />
            <Text style={styles.countText}>
              {item.post ? item.post.viewsCount : 0}
            </Text>
            <Icon
              type={IconType.Entypo}
              name={'star'}
              color={COLORS.white}
              size={15}
            />
            <Text style={styles.countText}>
              {item.post ? item.post.ratingAvg : 0}
            </Text>
          </View>
        </FastImage>
      </TouchableOpacity>
    )
  }

  onFiveStarProductEndReached = () => {
    if (this.props.fiveStarProductsScrollEnded === true) return
    this.props.fetchFiveStarProducts(
      (this.props.paginationFiveStarProducts === undefined
        ? 0
        : this.props.paginationFiveStarProducts.skip) + this.state.perPage,
      this.state.perPage,
    )
  }

  onAllProductsEndReached = () => {
    if (this.props.allProductsScrollEnded === true) return
    this.props.fetchAllProducts(
      (this.props.paginationAllProducts === undefined
        ? 0
        : this.props.paginationAllProducts.skip) + this.state.perPage,
      this.state.perPage,
    )
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.onItemViewDetailPress(item.post._id)}>
        {item.post ? (
          <View style={styles.productItem}>
            <FastImage
              style={[styles.productImage, styles.productImageStyle]}
              source={
                item.post.attachments.length
                  ? { uri: item.post.attachments[0].url }
                  : require('../../assets/images/empty_image.png')
              }
            />

            <View style={styles.productTextContainer}>
              <View style={styles.productTextView1}>
                <Text style={styles.productNameText}>{item.name}</Text>

                <NumberFormat
                  value={item.salePrice ? item.salePrice.toFixed(0) : '0'}
                  displayType={'text'}
                  thousandSeparator={true}
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
        ) : (
          <View />
        )}
      </TouchableOpacity>
    )
  }

  render() {
    const localization = localizedStrings.marketplace
    const {
      featuredProducts,
      fiveStarProducts,
      allproducts,
      searchProductsByText,
      searchProductByCategories,
      success,
      error,
      Categories,
    } = this.props
    const { query, searchState, searchType, category_id } = this.state
    const title = localizedStrings.marketplace.headerTitle
    const navigation = this.props.navigation
    let pickerItems = []

    {
      Categories.map((item, index) => {
        pickerItems.push({
          label: item.name,
          value: item._id,
        })
      })
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.left}>
            <TouchableOpacity
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
          </View>

          <View style={styles.middle}>
            <Text
              style={{
                fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
                color: COLORS.black,
                fontSize: 21,
              }}>
              {title}
            </Text>
          </View>
        </View>

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

        <ScrollView
          style={styles.scrollView}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps={'handled'}>
          {searchState ? (
            <View style={styles.wrapper}>
              <View style={styles.headerTitle}>
                <Text style={styles.subTitle}>{localization.featured}</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.onAllproductsPress(localization.featured)
                  }>
                  <Text style={styles.seeAll}>{localization.seeAll}</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal={true}
                style={styles.list}
                keyExtractor={(item, index) => item._id}
                onEndReached={this.onFeaturedProductEndReached}
                onEndReachedThreshold={0.7}
                data={featuredProducts}
                renderItem={this.renderFeaturedProduct}
              />

              <View style={styles.headerTitle}>
                <Text style={styles.subTitle}>
                  {localization.fiveStarProducts}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.onAllproductsPress(localization.fiveStarProducts)
                  }
                  style={{ flex: 1, width: 100 }}>
                  <Text style={styles.seeAll}>{localization.seeAll}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal={true}
                onScroll={({ nativeEvent }) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                    this.onFiveStarProductEndReached()
                  }
                }}
                scrollEventThrottle={400}>
                <View style={styles.productContainer}>
                  {fiveStarProducts.map((data, index) => {
                    return this.renderItem({ item: data })
                  })}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.wrapper}>
              {searchType ? (
                <View>
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
                      }}>
                      {/* <Text>searchType true</Text> */}
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {searchProductByCategories.length != 0 ? (
                    <FlatList
                      style={[styles.list, { marginTop: 15 }]}
                      keyExtractor={(item, index) => item._id}
                      onEndReachedThreshold={0.7}
                      data={searchProductByCategories}
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
                      }}>
                      {/* <Text>searchType false</Text> */}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
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
    borderTopColor: COLORS.grey,
    borderColor: COLORS.white,
    borderWidth: 2,
  },

  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  header: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: COLORS.white,
  },
  left: {
    alignItems: 'flex-start',
    marginHorizontal: 15,
  },
  middle: {
    flex: 5,
    alignItems: 'flex-start',
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
    fontSize: 21,
    marginLeft: -10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },

  wrapper: {
    marginBottom: 15,
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
  seeAll: {
    textAlign: 'right',
    color: COLORS.easternBlue,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    flex: 1,
    margin: 15,
  },
  headerTitle: {
    flexDirection: 'row',
  },

  // items
  featuredMediaWrapper: {
    width: 175,
    height: 175,
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
  productContainer: {
    height: 2800,
    flexWrap: 'wrap',
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
  itemViewContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemview: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
    borderRadius: 5,
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: '#53adb2',
  },
  pickeritem: {
    width: 145,
    height: 35,
    marginRight: -10,
  },

  pickeritem1: {
    width: 150,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    paddingLeft: 10,
    borderColor: COLORS.grey,
    fontSize: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },

  pickeritemstyle: {
    fontSize: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  pickeritem2: {
    width: 150,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -80,
    right: 10,
    zIndex: 2,
    borderColor: 'gray',
    fontSize: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },
})
export default MarketPlace
