import C from '../constants'

export const goal = (state=10, action) => 
	(action.type === C.SET_GOAL) ? 
		 parseInt(action.payload) :
		 state


export const skiDay = (state=null, action) => 
  (action.type === C.ADD_DAY) ?
  	action.payload :
  	state

export const errors = (state=[], action) => {
	switch(action.type) {
		case C.ADD_ERROR:
			// DANGER: Don't do this as you're mutating the original state
			// state.push(action.payload)
			return [
				...state,
				action.payload
			]
		case C.CLEAR_ERROR:
			return state.filter((message, index) => index !== action.payload)
		default:
			return state
	}
}