import { default as SearchScreen } from './container'
import homeReducer from 'features/home/ducks/reducer'
import searchReducer from './ducks/reducer'
import homeSaga from 'features/home/ducks/sagas'
import searchSaga from './ducks/sagas'

export { SearchScreen, homeReducer, searchReducer, homeSaga, searchSaga }
