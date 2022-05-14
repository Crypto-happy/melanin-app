import * as ActionTypes from './action-types'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const resetItems = () => ({
    type: ActionTypes.RESET_ITEMS,
    showLoading: false,
})

export const search_products = (
    query: string,
    type: int
) => ({
    type: ActionTypes.SEARCH_PRODUCTS,
    payload: { query, type },
    showLoading: true,
})

export const search_products_success = (results: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const search_products_failure = (error: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_FAILURE,
    payload: { error },
    showLoading: false,
})
