import { call, put, takeLatest, all } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { marketPlaceApi } from '../../../api'
import { get } from 'lodash'


function* all_products(action: any) {
    try {
        const { skip, limit } = action.payload

        const res = yield call(marketPlaceApi.getAllProducts, skip, limit)
        yield put(Actions.all_products_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.all_products_failure(errMessage))
    }
}

function* product_categories(action: any) {
    try {
        const res = yield call(marketPlaceApi.getProductCategories)
        yield put(Actions.product_categories_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.product_categories_failure(errMessage))
    }
}

function* search_products_by_categories(action: any) {
    try {
        const { categoryId } = action.payload
        const res = yield call(marketPlaceApi.getSearchProductsByCategory, categoryId)
        yield put(Actions.search_products_by_categories_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.search_products_by_categories_failure(errMessage))
    }
}

function* featured_products(action: any) {
    try {
        const { skip, limit } = action.payload

        const res = yield call(marketPlaceApi.getFeaturedProducts, skip, limit)
        yield put(Actions.featured_products_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.featured_products_failure(errMessage))
    }
}

function* five_star_products(action: any) {
    try {
        const { skip, limit } = action.payload

        const res = yield call(marketPlaceApi.getFiveStarProducts, skip, limit)
        yield put(Actions.five_star_products_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.five_star_products_failure(errMessage))
    }
}

function* new_arrival_products(action: any) {
    try {
        const { skip, limit } = action.payload

        const res = yield call(marketPlaceApi.getNewArrivalProducts, skip, limit)
        yield put(Actions.new_arrival_products_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.new_arrival_products_failure(errMessage))
    }
}

function* search_products_by_text(action: any) {
    try {
        const { skip, limit, query } = action.payload

        const res = yield call(marketPlaceApi.getSearchProductsByText, query, 0)
        yield put(Actions.search_products_by_text_success(res.data))
    } catch (error) {
        const errMessage = get(error, 'message', null)
        yield put(Actions.search_products_by_text_failure(errMessage))
    }
}

function* marketPlaceSaga() {
    yield takeLatest(
        ActionTypes.ALL_PRODUCTS,
        all_products
    )
    yield takeLatest(
        ActionTypes.PRODUCT_CATEGORIES,
        product_categories
    )
    yield takeLatest(
        ActionTypes.SEARCH_PRODUCTS_BY_CATEGORIES,
        search_products_by_categories
    )
    yield takeLatest(
        ActionTypes.FEATURED_PRODUCTS,
        featured_products
    )
    yield takeLatest(
        ActionTypes.FIVE_STAR_PRODUCTS,
        five_star_products
    )
    yield takeLatest(
        ActionTypes.NEW_ARRIVAL_PRODUCTS,
        new_arrival_products
    )
    yield takeLatest(
        ActionTypes.SEARCH_PRODUCTS_BY_TEXT,
        search_products_by_text
    )
}

export default marketPlaceSaga
