import {createAction} from 'redux-actions'
import moment from 'moment'

export const OPEN_PICKER  = 'datetimes/OPEN_PICKER'
export const CLOSE_PICKER = 'datetimes/CLOSE_PICKER'
export const SET_DATETIME = 'datetimes/SET_DATETIME'


// actions
export const openPicker             = createAction(OPEN_PICKER)
export const closePicker            = createAction(CLOSE_PICKER)
export const setDateTime            = createAction(SET_DATETIME)


const today         = new Date()
const startDateTime = moment(today).hour(0).minutes(0)
const endDateTime   = moment(today).hour(23).minute(59)

const initialState = {
  startDate: {
    isOpen: false,
    defaultDateTime: startDateTime
  },
  endDate: {
    isOpen: false,
    defaultDateTime: endDateTime
  }
}


export const datetimes = (state={}, action={}) => {
  // use initialState if empty object is passed as first argument
  state = Object.keys(state).length == 0 ? initialState : state;
  const {name} = (action.payload || {}) 

  switch(action.type){
    case OPEN_PICKER:
      return {
        ...state,
        [name]: {
          ...state[name],
          isOpen: true
        }
      }

    case CLOSE_PICKER: 
      return {
        ...state,
        [name]: {
          ...state[name],
          isOpen: false
        }
      }

    default:
     return state
  }
}

export default datetimes