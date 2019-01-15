import axios from 'axios'
import $ from 'jquery'

export default class {
  // todo: how about baseURL option...
  static instance(){
    // pull these values right out of the dom, since by all appearances 
    // putting them in the store doesn't do us any good
    const el         = $('[data-csrf-token]')
    const token      = el.data('csrfToken')
    const headerName = el.data('csrfHeaderName')
    const headers = {
      [headerName] : token
    }
    
    return axios.create({
      headers
    })
  }
}