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
# Reducers
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
