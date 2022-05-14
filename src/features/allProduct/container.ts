import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Allproducts from './Allproducts'
import { resetItems, search_products } from './ducks/actions'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const mapStateToProps = (state: any) => {
  const {
    loading,
    success,
    error,
    Categories,
    searchProductsByText,
    paginationSearchProductsByText,
  } = state.allProducts

  const authUser = state.auth.currentUser

  return {
    authUser,
    loading,
    success,
    error,
    Categories,
    searchProductsByText,
    paginationSearchProductsByText,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => {
    dispatch(resetItems())
  },

  fetchSearchProductsByText: (query: string, type: int) =>
    dispatch(search_products(query, type)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Allproducts)
