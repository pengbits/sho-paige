import React, { Component } from 'react';
import PromoList from '../containers/PromoListContainer'
import Header from './Header'
import { CONTENT_BLOCK_CONTEXT, SEARCH_CONTEXT } from '../redux/app'

class App extends Component {
  
  componentWillMount() {
    this.setContext()
    this.setConfigs()
  }
  
  setContext(){
    const {
      search, 
      contentBlock,
      setContext
    } = this.props
    
    if(search && search.query){
      setContext(SEARCH_CONTEXT)

    } else if(contentBlock && contentBlock.id) {
      setContext(CONTENT_BLOCK_CONTEXT)
      
    } else {
      throw new Error('must provide a search query or content block id')
    }
      
  }
  
  setConfigs(){
    if(window.paige && window.paige.configs){
      this.props.setConfig(window.paige.configs)
    }
  }
  
  render() {
    return (
    <article className="paige-app">
      <Header 
        addPromo={this.props.addPromo}
         context={this.props.context}
      />
      <section className="paige-app__body">
        <PromoList />
      </section>
    </article>)
  }
}

export default App