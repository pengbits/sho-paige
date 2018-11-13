import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'
import { reducer as formReducer } from 'redux-form'
import { filters } from './filters'
import { search } from './search'
import { sort } from './sort'
import { promos } from './promos'
import { configs } from './configs'
import { contentBlock} from './content-block'
import { app } from './app'
import crossCuttingReducer from './cross-cutting-reducer'

export const indexReducer = {
  configs,
  filters,
  search,
  promos,
  contentBlock,
  sort,
  app
}

export const rootReducer = reduceReducers(combineReducers({
  ...indexReducer,
  form: formReducer
}), crossCuttingReducer);

export default rootReducer