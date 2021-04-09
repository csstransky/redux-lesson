import C from '../constants'

export const goal = (state=10, action) => 
    (action.type === C.SET_GOAL) ?
   	    parseInt(action.payload) :
        state


export const skiDay = (state, action) =>
    (action.type === C.ADD_DAY) ?
        action.payload :
        state
