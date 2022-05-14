import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const initialState = {
    loading: false,
    success: false,
    error: false,

    searchProductsByText: [],
}

const resetToDefault = () => {
    return initialState
}

const handlesearchProductsRequest = (state: any, action: any) => {
    const { skip } = action.payload
    return update(state, {
        loading: { $set: true },
        success: { $set: false },
        error: { $set: false },
    })
}

const handlesearchProductsSuccess = (state: any, action: any) => {
    const searchProductsByText = get(action, 'payload.results', {})

    return update(state, {
        loading: { $set: false },
        success: { $set: true },
        error: { $set: false },
        searchProductsByText: { $push: searchProductsByText },
    })
}

const handlesearchProductsFailure = (state: any, action: any) => {
    return update(state, {
        loading: { $set: false },
        success: { $set: false },
        error: { $set: action.payload.error },
    })
}

const allproductsReducer = createReducer(initialState, {
    [ActionTypes.RESET_ITEMS]: resetToDefault,

    [ActionTypes.SEARCH_PRODUCTS]: handlesearchProductsRequest,
    [ActionTypes.SEARCH_PRODUCTS_SUCCESS]: handlesearchProductsSuccess,
    [ActionTypes.SEARCH_PRODUCTS_FAILURE]: handlesearchProductsFailure,

})
export default allproductsReducer
