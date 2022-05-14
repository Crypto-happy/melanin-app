import * as ActionTypes from './action-types'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const resetItems = () => ({
    type: ActionTypes.RESET_ITEMS,
    showLoading: false,
})

export const all_products = (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
) => ({
    type: ActionTypes.ALL_PRODUCTS,
    payload: { skip, limit },
    showLoading: true,
})

export const all_products_success = (results: any) => ({
    type: ActionTypes.ALL_PRODUCTS_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const all_products_failure = (error: any) => ({
    type: ActionTypes.ALL_PRODUCTS_FAILURE,
    payload: { error },
    showLoading: false,
})

export const product_categories = () => ({
    type: ActionTypes.PRODUCT_CATEGORIES,
    showLoading: true,
})

export const product_categories_success = (results: any) => ({
    type: ActionTypes.PRODUCT_CATEGORIES_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const product_categories_failure = (error: any) => ({
    type: ActionTypes.PRODUCT_CATEGORIES_FAILURE,
    payload: { error },
    showLoading: false,
})

export const search_products_by_categories = (
    categoryId: string,

) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES,
    payload: { categoryId },
    showLoading: true,
})

export const search_products_by_categories_success = (results: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const search_products_by_categories_failure = (error: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES_FAILURE,
    payload: { error },
    showLoading: false,
})

export const featured_products = (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
) => ({
    type: ActionTypes.FEATURED_PRODUCTS,
    payload: {  skip, limit },
    showLoading: true,
})

export const featured_products_success = (results: any) => ({
    type: ActionTypes.FEATURED_PRODUCTS_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const featured_products_failure = (error: any) => ({
    type: ActionTypes.FEATURED_PRODUCTS_FAILURE,
    payload: { error },
    showLoading: false,
})

export const five_star_products = (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
) => ({
    type: ActionTypes.FIVE_STAR_PRODUCTS,
    payload: { skip, limit },
    showLoading: true,
})

export const five_star_products_success = (results: any) => ({
    type: ActionTypes.FIVE_STAR_PRODUCTS_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const five_star_products_failure = (error: any) => ({
    type: ActionTypes.FIVE_STAR_PRODUCTS_FAILURE,
    payload: { error },
    showLoading: false,
})

export const new_arrival_products = (
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
) => ({
    type: ActionTypes.NEW_ARRIVAL_PRODUCTS,
    payload: {  skip, limit, },
    showLoading: true,
})

export const new_arrival_products_success = (results: any) => ({
    type: ActionTypes.NEW_ARRIVAL_PRODUCTS_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const new_arrival_products_failure = (error: any) => ({
    type: ActionTypes.NEW_ARRIVAL_PRODUCTS_FAILURE,
    payload: { error },
    showLoading: false,
})

export const search_products_by_text = (
    query: string,
    type: int

) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_TEXT,
    payload: {  query, type },
    showLoading: true,
})

export const search_products_by_text_success = (results: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_TEXT_SUCCESS,
    payload: { results },
    showLoading: false,
})

export const search_products_by_text_failure = (error: any) => ({
    type: ActionTypes.SEARCH_PRODUCTS_BY_TEXT_FAILURE,
    payload: { error },
    showLoading: false,
})

