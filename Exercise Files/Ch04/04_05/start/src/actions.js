import C, { SERVER_URL } from './constants'
import fetch from 'isomorphic-fetch'

export const suggestResortNames = value => dispatch => {
	dispatch({
		type: C.FETCH_RESORT_NAMES
	})

	fetch(SERVER_URL + value)
		.then(response => response.json())
		.then(suggestions => dispatch(changeSuggestions(suggestions)))
		.catch(error => {
			dispatch(addError(error.message))
			dispatch({
				type: C.CANCEL_FETCHING
			})
		})
}

export function addDay(resort, date, powder=false, backcountry=false) {

	return {
		type: C.ADD_DAY,
		payload: {resort,date,powder,backcountry}
	}

}

export const removeDay = function(date) {

	return {
		type: C.REMOVE_DAY,
		payload: date
	}

}

export const setGoal = (goal) => 
	({
		type: C.SET_GOAL,
		payload: goal
	})

export const addError = (message) => 
   ({
   	  type: C.ADD_ERROR,
   	  payload: message
   })

export const clearError = index => 
	({
		type: C.CLEAR_ERROR,
		payload: index
	})   

export const changeSuggestions = suggestions => 
  ({
  	type: C.CHANGE_SUGGESTIONS,
  	payload: suggestions
  })

export const clearSuggestions = () => 
	({
		type: C.CLEAR_SUGGESTIONS
	})



