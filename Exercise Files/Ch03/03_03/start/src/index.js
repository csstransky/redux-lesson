import C from './constants'
import appReducer from './store/reducers'
import { createStore } from 'redux'

const initialState = localStorage['redux-store'] ?
	JSON.parse(localStorage['redux-store']) :
	{};

const store = createStore(appReducer, initialState);
const dude = "dude";

window.store = store;
window.dude = dude;

store.subscribe(() => {
	const state = JSON.stringify(store.getState());
	localStorage['redux-store'] = state;
});

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
	type: C.SET_GOAL,
	payload: 13
})

