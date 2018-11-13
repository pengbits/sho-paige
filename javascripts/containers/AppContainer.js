import { connect } from 'react-redux';
import App from '../components/App';
import { newPromo } from '../redux/promos'
import { setConfig } from '../redux/configs'
import { setContext } from '../redux/app'
import { setContentBlock } from '../redux/content-block'

const mapStateToProps = (state) => {
  const {
    contentBlock,
    search
  } = state
  
  const {
    context
  } = state.app
  
  return {
    contentBlock,
    search,
    context
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setContext: function(context){
      dispatch(setContext(context))
    },
    setConfig: function(cfg){
      dispatch(setConfig(cfg))
    },
    setContentBlock: function(cb) {
      dispatch(setContentBlock(cb))
    },
    addPromo: function(){
      dispatch(newPromo())
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
