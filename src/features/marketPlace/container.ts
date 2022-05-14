import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import MarketPlace from './MarketPlace'
import {
  resetItems,
  all_products,
  product_categories,
  search_products_by_categories,
  featured_products,
  five_star_products,
  new_arrival_products,
  search_products_by_text,
} from './ducks/actions'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const mapStateToProps = (state: any) => {
  const {
    loading,
    success,
    error,
    allproducts,
    paginationAllProducts,
    Categories,
    searchProductByCategories,
    paginationSearchProductByCategories,
    featuredProducts,
    paginationFeaturedProducts,
    fiveStarProducts,
    paginationFiveStarProducts,
    newArrivalProducts,
    paginationnewArrivalProducts,
    searchProductsByText,
    paginationSearchProductsByText,
  } = state.marketPlace
  const authUser = state.auth.currentUser
  return {
    authUser,
    loading,
    success,
    error,
    allproducts,
    paginationAllProducts,
    Categories,
    searchProductByCategories,
    paginationSearchProductByCategories,
    featuredProducts,
    paginationFeaturedProducts,
    fiveStarProducts,
    paginationFiveStarProducts,
    newArrivalProducts,
    paginationnewArrivalProducts,
    searchProductsByText,
    paginationSearchProductsByText,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => {
    dispatch(resetItems())
  },

  fetchAllProducts: (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
  ) => dispatch(all_products(skip, limit)),

  fetchProductCategories: () => dispatch(product_categories()),

  fetchSearchProductsByCategory: (categoryId: string) =>
    dispatch(search_products_by_categories(categoryId)),

  fetchFeaturedProducts: (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
  ) => dispatch(featured_products(skip, limit)),

  fetchFiveStarProducts: (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
  ) => dispatch(five_star_products(skip, limit)),

  fetchNewArrivalProducts: (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
  ) => dispatch(new_arrival_products(skip, limit)),

  fetchSearchProductsByText: (query: string, type: int) =>
    dispatch(search_products_by_text(query, 0)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlace)
