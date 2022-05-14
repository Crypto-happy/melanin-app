import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const initialState = {
    loading: false,
    success: false,
    error: false,

    allproducts: [],
    paginationAllProducts: {
        skip: 0,
        endReached: false,
    },
    allProductsScrollEnded: false,

    Categories: [],

    searchProductByCategories: [],
    paginationSearchProductByCategories: {
        skip: 0,
        endReached: false,
    },
    SearchProductByCategoriesScrollEnded: false,

    featuredProducts: [],
    paginationFeaturedProducts: {
        skip: 0,
        endReached: false,
    },
    featuredProductsScrollEnded: false,

    fiveStarProducts: [],
    paginationFiveStarProducts: {
        skip: 0,
        endReached: false,
    },
    fiveStarProductsScrollEnded: false,

    newArrivalProducts: [],
    paginationnewArrivalProducts: {
        skip: 0,
        endReached: false,
    },
    newArrivalProductsScrollEnded: false,
    
    searchProductsByText: [],
    paginationSearchProductsByText: {
        skip: 0,
        endReached: false,
    },
    searchProductsByTextScrollEnded: false,

}

const resetToDefault = () => {
    return initialState
}

const handleAllproductsRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationAllProducts: {
            skip: { $set: skip },
        },
    })
}

const handleeAllproductsSuccess = (state: any, action: any) => {
    const allproducts = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        allproducts: { $set: allproducts },
        paginationAllProducts: {
            endReached: { $set: allproducts.length < DEFAULT_ITEMS_PER_PAGE },
        },
        allProductsScrollEnded: { $set: allproducts.length == 0 }
    })
}

const handleAllproductsFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handleCategoriesRequest = (state: any, action: any) => {
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
    })
}

const handleCategoriesSuccess = (state: any, action: any) => {
    const results = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        Categories: { $push: results },
    })
}

const handleCategoriesFailure = (state: any, action: any) => {

    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handlesearchProductByCategoriesRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationSearchProductByCategories: {
            skip: { $set: skip },
        },
    })
}

const handlesearchProductByCategoriesSuccess = (state: any, action: any) => {
    const searchProductByCategories = get(action, 'payload.results', {})
    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        searchProductByCategories: { $set: searchProductByCategories },
    })
}

const handlesearchProductByCategoriesFailure = (state: any, action: any) => {

    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handlefeaturedProductsRequest = (state: any, action: any) => {
    const { skip } = action.payload

    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationFeaturedProducts: {
            skip: { $set: skip },
        },
    })
}

const handlefeaturedProductsSuccess = (state: any, action: any) => {
    const featuredProducts = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        featuredProducts: { $set: featuredProducts },
        paginationFeaturedProducts: {
            endReached: { $set: featuredProducts.length < DEFAULT_ITEMS_PER_PAGE },
        },
        featuredProductsScrollEnded: { $set: featuredProducts.length == 0 }
    })
}

const handlefeaturedProductsFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handlefiveStarProductsRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationFiveStarProducts: {
            skip: { $set: skip },
        },
    })
}

const handlefiveStarProductsSuccess = (state: any, action: any) => {
    const fiveStarProducts = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        fiveStarProducts: { $set: fiveStarProducts },
        paginationFiveStarProducts: {
            endReached: { $set: fiveStarProducts.length < DEFAULT_ITEMS_PER_PAGE },
        },
        fiveStarProductsScrollEnded: { $set: fiveStarProducts.length == 0 }
    })
}

const handlefiveStarProductsFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handlenewArrivalProductsRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationnewArrivalProducts: {
            skip: { $set: skip },
        },
    })
}

const handlenewArrivalProductsSuccess = (state: any, action: any) => {
    const newArrivalProducts = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        newArrivalProducts: { $set: newArrivalProducts },
        paginationnewArrivalProducts: {
            endReached: { $set: newArrivalProducts.length < DEFAULT_ITEMS_PER_PAGE },
        },
        newArrivalProductsScrollEnded: { $set: newArrivalProducts.length == 0 }
    })
}

const handlenewArrivalProductsFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const handlesearchProductsByTextRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
        paginationSearchProductsByText: {
            skip: { $set: skip },
        },
    })
}

const handlesearchProductsByTextSuccess = (state: any, action: any) => {
    const searchProductsByText = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        searchProductsByText: { $set: searchProductsByText },
        paginationSearchProductsByText: {
            endReached: { $set: searchProductsByText.length < DEFAULT_ITEMS_PER_PAGE },
        },
        searchProductsByTextScrollEnded: { $set: searchProductsByText.length == 0 }
    })
}

const handlesearchProductsByTextFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}


const marketPlaceReducer = createReducer(initialState, {
    [ActionTypes.RESET_ITEMS]: resetToDefault,

    [ActionTypes.ALL_PRODUCTS]: handleAllproductsRequest,
    [ActionTypes.ALL_PRODUCTS_SUCCESS]: handleeAllproductsSuccess,
    [ActionTypes.ALL_PRODUCTS_FAILURE]: handleAllproductsFailure,

    [ActionTypes.PRODUCT_CATEGORIES]: handleCategoriesRequest,
    [ActionTypes.PRODUCT_CATEGORIES_SUCCESS]: handleCategoriesSuccess,
    [ActionTypes.PRODUCT_CATEGORIES_FAILURE]: handleCategoriesFailure,

    [ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES]: handlesearchProductByCategoriesRequest,
    [ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES_SUCCESS]: handlesearchProductByCategoriesSuccess,
    [ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES_FAILURE]: handlesearchProductByCategoriesFailure,

    [ActionTypes.FEATURED_PRODUCTS]: handlefeaturedProductsRequest,
    [ActionTypes.FEATURED_PRODUCTS_SUCCESS]: handlefeaturedProductsSuccess,
    [ActionTypes.FEATURED_PRODUCTS_FAILURE]: handlefeaturedProductsFailure,

    [ActionTypes.FIVE_STAR_PRODUCTS]: handlefiveStarProductsRequest,
    [ActionTypes.FIVE_STAR_PRODUCTS_SUCCESS]: handlefiveStarProductsSuccess,
    [ActionTypes.FIVE_STAR_PRODUCTS_FAILURE]: handlefiveStarProductsFailure,

    [ActionTypes.NEW_ARRIVAL_PRODUCTS]: handlenewArrivalProductsRequest,
    [ActionTypes.NEW_ARRIVAL_PRODUCTS_SUCCESS]: handlenewArrivalProductsSuccess,
    [ActionTypes.NEW_ARRIVAL_PRODUCTS_FAILURE]: handlenewArrivalProductsFailure,

    [ActionTypes.SEARCH_PRODUCTS_BY_TEXT]: handlesearchProductsByTextRequest,
    [ActionTypes.SEARCH_PRODUCTS_BY_TEXT_SUCCESS]: handlesearchProductsByTextSuccess,
    [ActionTypes.SEARCH_PRODUCTS_BY_TEXT_FAILURE]: handlesearchProductsByTextFailure,

})
export default marketPlaceReducer
