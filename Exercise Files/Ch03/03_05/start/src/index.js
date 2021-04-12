import C from './constants'
import storeFactory from './store'

const initialState = (localStorage['redux-store']) ?
	JSON.parse(localStorage['redux-store']) :
	{}

const saveState = () => {
	const state = JSON.stringify(store.getState())
	localStorage['redux-store'] = state
}

const store = storeFactory(initialState);

store.subscribe(saveState);

store.dispatch({
	type: C.ADD_DAY,
	payload: {
		"resort": "Mt Shasta",
		"date": "2020-2-2",
		"powder": true,
		"backcountry": false
	}
})
store.dispatch({
	type: C.ADD_DAY,
	payload: {
		"resort": "Mt Shasta",
		"date": "2020-2-21",
		"powder": true,
		"backcountry": false
	}
})
store.dispatch({
	type: C.ADD_DAY,
	payload: {
		"resort": "Mt Shasta",
		"date": "2020-2-5",
		"powder": true,
		"backcountry": false
	}
})