# What Is Redux?
+ Redux based on Flux, a design pattern alternative to MVC
+ Developed in 2015 by Dan Abramov & Andrew Clark
+ Flux designed by Facebook, a variation to MVC
+ The original issue was having many models and many views that could each 
interact with one another and cause unintended consequences because a model
change could mess with the model for another view
+ Flux: Action -> Dispatcher -> Store -> View -> Action -> etc...
+ DATA FLOWS IN ONE DIRECTION
+ All changes will begin with an Action, and end on the View  
  
+ Redux isn't exactly Flux, it's Flux-lite
+ Redux combines the Dispatcher and Store into simply a Store, this means that
you can only do Actions on 1 Store (instead of a Dispatcher being able to 
affect multiple Stores at once)
+ All data is stored in one State, and instead of breaking that State into
multiple Objects, multiple Functions are used instead to mess with specific
Leaves in the State tree
+ This means that Redux (as well as JS and React) use the 
Functional Programming paradigm
+ Redux uses the idea of composition, where the inputs and outputs of each 
subsequent function affects the final result:
```
import { compose } from 'redux'

const getPercent = compose(
	convertToDecimal,
	decimalToPercent,
	addPercentSign
);
getPercent(1, 4); // Output is '25%'
```
+ Redux will use reducers inside its Store to mutate its values


+ Wireframes: Drawing out what your webpage will look like with Action words
	- Focus on the "verbs" rather than the "nouns" because we're Functional
+ Actions:
	- ADD_DAY
	- REMOVE_DAY
	- SET_GOAL
	- ADD_ERROR
	- CLEAR_ERROR
	- FETCH_RESORT_NAMES
	- CANCEL_FETCHING

+ Redux Actions are really Strings, but it's good practice to use an Object with String values instead to allow less errors and better development:
```
//constants.js
const constants = {
	ADD_DAY: "ADD_DAY",
	REMOVE_DAY: "REMOVE_DAY",
	SET_GOAL: "SET_GOAL",
	ADD_ERROR: "ADD_ERROR",
	CLEAR_ERROR: "CLEAR_ERROR",
	FETCH_RESORT_NAMES: "FETCH_RESORT_NAMES",
	CANCEL_FETCHING: "CANCEL_FETCHING",
	CHANGE_SUGGESTIONS: "CHANGE_SUGGESTIONS",
	CLEAR_SUGGESTIONS: "CLEAR_SUGGESTIONS"
}

export default constants
```
+ Redux works directly with React, so make sure to use States, and always make sure to have an initialState of some kind:
```
// initialState.json
{
	"allSkiDays": [...],
	"goal": 10,
	"errors": [],
	"resortNames": {
		"fetching": false,
		"suggestions": ["Squaw Valley", "Snowbird", "Stowe", "Steamboat"]
	}
}
```
+ This lesson uses NodeJS and Babel 
	- NodeJS is mainly used to run code and handle packages
	- Babel is used to make all our code ES5 backwards-compatible
```
$ npm init
// Just put in "ski-day-counter" for package name, default for the rest
$ npm install babel-cli --save-dev
// "--save-dev" makes sure to add dependencies to package.json
$ npm install babel-preset-latest --save-dev
// This will install all of the latest ES6 features
$ npm install babel-preset-stage-0 --save-dev
// Adds all experimental features
```
+ We need to tell Babel which presets to use when transpiling our code:
```
// .babelrc
{
	"presets": ["latest", "stage-0"]
}
```
+ npm will need a start script, so make sure to include that:
```
// package.json
{
	...
	"scripts": {
		"start": "./node_modules/.bin/babel-node ./src/"
		// Babel will automatically choose the index.js file in the src folder
	}
	...
}
```
+ install Redux with the following:
```
$ npm install redux --save-dev
```
# Understanding Reducers
+ When creating a reducer, make sure to use ES6 syntax of arrow functions
```
// store/reducers.js
export const goal = (state, action) => {
    if (action.type === C.SET_GOAL) {
        return parseInt(action.payload);
    } else {
        return state;
    }
}
```
+ Setting a reducer as `const` allows the reducer to be unchangable, which is what we want
+ A reducer mainly works by getting a State and Action, and acting upon it
```
// index.js
const state = 10;

const action = {
   type: C.SET_GOAL,
   payload: 15
}

const nextState = goal(state, action)

console.log(`
   intial goal: ${state}
   action: ${JSON.stringify(action)}
   new goal: ${nextState}
`)
```
Console output
```
   intial goal: 10
   action: {"type":"SET_GOAL","payload":15}
   new goal: 15
```
+ This of course is most opitimal for Objects being used as States:
```
// Console output
    initial state: null
    action: {"type":"ADD_DAY","payload":{"resort":"Heavenly","data":"2021-10","powder":true,"backcountry":false}}
    new state: {"resort":"Heavenly","data":"2021-10","powder":true,"backcountry":false}
```
+ Don't forget the use of ternary operators
```
// reducers.js
export const goal = (state=10, action) => 
    (action.type === C.SET_GOAL) ?
   	    parseInt(action.payload) :
        state
```
+ Always make sure to return a new state, instead of mutating the old one
```
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
```
+ An intereting thing to note is that Babel will not like `state.filter(...)` if the initial argument is not given a default value of an Array of some kind, because it won't know that it's an Array and can use an Array function otherwise
+ Don't forget to try and coalesce Reducers together whenever possible:
```
export const allSkiDays = (state=[], action) => {
	switch(action.type) {
		case C.ADD_DAY:
			return [
				...state,
				skiDay(null, action)
			]
		default:
			state
	}
}
```
+ The same actions can be used on different reducers that aren't related, so make sure to have cases for them:
```
// reducers.js
export const fetching = (state=false, action) => {
  switch(action.type) {
    case C.FETCH_RESORT_NAMES:
      return true;

    case C.CANCEL_FETCHING:
      return false;

	// Even though this isn't directly related to fetching, we still want our
	// fetching to be false whenever it's time to make changes
    case C.CHANGE_SUGGESTIONS:
      return false;

    default:
      return state;
  }
}

// index.js
const action = {
    type: C.CHANGE_SUGGESTIONS,
    payload: ['Heavenly Ski Resort', 'Heavens Sonohara']
}

const state = {
	fetching: true,
	suggestions: []
}

const actualState = {
	fetching: fetching(state.fetching, action),
	suggestions: suggestions(state.suggestions, action)
}

expect(actualState.suggestions).toEqual(expectedState.suggestions)
expect(actualState.fetching).toEqual(expectedState.fetching)
```
Console output
```
const expectedState = {
	fetching: false,
	suggestions: ['Heavenly Ski Resort', 'Heavens Sonohara']
}
```
+ All of our Reducers so far take in multiple kinds of arguments, Redux allows you to combine them to deal with the entire State object with `combineReducers(...)`
```
// reducers.js
export default combineReducers({
  allSkiDays,
  goal,
  errors,
  resortNames: combineReducers({
    fetching,
    suggestions
  })
});

// index.js
import C from './constants'
import appReducer from './store/reducers'
import initialState from './initialState.json'

let state = initialState;

state = appReducer(state, {
    type: C.SET_GOAL,
    payload: 2
});

state = appReducer(state, {
    type: C.ADD_DAY,
    payload: {
        "resort": "Mt Shasta",
        "date": "2021-10-2",
        "powder": true,
        "backcountry": true
    }
})

state = appReducer(state, {
    type: C.CHANGE_SUGGESTIONS,
    payload: ["Mt Tallac", "Mt Hood", "Gunstock"]
})
```
Console output
```
    Initital State
    ====================
    goal: 10
    resorts: [{"resort":"Kirkwood","date":"2016-12-7","powder":true,"backcountry":false},{"resort":"Squaw Valley","date":"2016-12-8","powder":false,"backcountry":false},{"resort":"Mt Tallac","date":"2016-12-9","powder":false,"backcountry":true}]
    fetching: false
    suggestions: Squaw Valley,Snowbird,Stowe,Steamboat


    Changed State
    ====================
    goal: 2
    resorts: [{"resort":"Mt Shasta","date":"2021-10-2","powder":true,"backcountry":true},{"resort":"Mt Tallac","date":"2016-12-9","powder":false,"backcountry":true},{"resort":"Squaw Valley","date":"2016-12-8","powder":false,"backcountry":false},{"resort":"Kirkwood","date":"2016-12-7","powder":true,"backcountry":false}]
    fetching: false
    suggestions: Mt Tallac,Mt Hood,Gunstock
```