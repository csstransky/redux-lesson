import C from './constants'
import storeFactory from './store'
import {addDay, removeDay, setGoal} from "./actions";

const store = storeFactory();

store.dispatch(
	addDay("Heavenly", "2020-2-2")
)

store.dispatch(removeDay("2020-2-2"));
store.dispatch(setGoal(13));