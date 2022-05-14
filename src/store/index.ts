import { applyMiddleware, compose, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import rootReducer from '../reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'
import { rehydrationComplete } from '../sagas/actions'
import { addRefStore } from './root-store'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
)

sagaMiddleware.run(rootSaga)

const persistor = persistStore(store, null, () => {
  store.dispatch(rehydrationComplete())
})

addRefStore(store)

export { store, persistor }
