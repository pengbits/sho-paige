import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { reducer as formReducer } from 'redux-form'
import { filters } from './filters'
import { pagination } from './pagination'
import { datetimes } from './datetimes'
import { search } from './search'
import { sort } from './sort'
import { promos } from './promos/reducers'
import { configs } from './configs'
import { contentBlock} from './content-block'
import { formDefaults } from './form-defaults'
import { app } from './app'
import crossCuttingReducer from './cross-cutting-reducer'

export const indexReducer = {
  configs,
  filters,
  pagination,
  search,
  promos,
  contentBlock,
  sort,
  formDefaults,
  app,
  datetimes
}

export const rootReducer = reduceReducers(combineReducers({
  ...indexReducer,
  form: formReducer
}), crossCuttingReducer);

export default rootReducer