import C from './constants'
import { errors } from './store/reducers'

const state = [
	"user not aurthorized",
	"server not happy"
]

const action = {
	type: C.ADD_ERROR,
	payload: "cannot connect to server"
}

const nextState = errors(state, action);

const action2 = {
	type: C.CLEAR_ERROR,
	payload: 1
}

const nextState2 = errors(nextState2, action2);

console.log(`

    initial state: ${state}
    action: ${JSON.stringify(action2)}
    new state: ${JSON.stringify(nextState2)}

`)