import C from './constants'
import { allSkiDays } from './store/reducers'

const state = [
	{
		"resort": "Kirkwood",
		"date": "2021-10-2",
		"powder": true,
		"backcountry": false
	}
]

const action = {
	type: C.ADD_DAY,
	payload: {
		"resort": "Boreal",
		"date": "2021-10-3",
		"powder": false,
		"backcountry": true
	}
}

const nextState = allSkiDays(state, action)

const action2 = {
	type: C.ADD_DAY,
	payload: {
		"resort": "Boreal",
		"date": "2021-10-3",
		"powder": false,
		"backcountry": true
	}
}

const nextState2 = allSkiDays(nextState, action2);

const action3 = { 
	type: C.REMOVE_DAY,
	payload: "2021-10-3"
}

const nextState3 = allSkiDays(nextState2, action3);

console.log(`

	initial state: ${JSON.stringify(state)}
	action: ${JSON.stringify(action)}
	new state: ${JSON.stringify(nextState)}

    action: ${JSON.stringify(action2)}
    new state: ${JSON.stringify(nextState2)}

    action: ${JSON.stringify(action3)}
    new state: ${JSON.stringify(nextState3)}

`)

