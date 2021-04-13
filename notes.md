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

constants.js
```
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

initialState.json
```
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

Console
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

.babelrc
```
{
	"presets": ["latest", "stage-0"]
}
```
+ npm will need a start script, so make sure to include that:

package.json
```
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

store/reducers.js
```
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

index.js
```
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

Console output
```
    initial state: null
    action: {"type":"ADD_DAY","payload":{"resort":"Heavenly","data":"2021-10","powder":true,"backcountry":false}}
    new state: {"resort":"Heavenly","data":"2021-10","powder":true,"backcountry":false}
```
+ Don't forget the use of ternary operators

reducers.js
```
export const goal = (state=10, action) => 
    (action.type === C.SET_GOAL) ?
   	    parseInt(action.payload) :
        state
```
+ Always make sure to return a new state, instead of mutating the old one

reducers.js
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

reducers.js
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

reducers.js
```
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
```
index.js
```
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

reducers.js
```
export default combineReducers({
  allSkiDays,
  goal,
  errors,
  resortNames: combineReducers({
    fetching,
    suggestions
  })
});
```
index.js
```
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
# Webpack & In-Browser Code Execution
+ NodeJs has been used to run code in console, but we should focus on running it in the browser
+ Webpack and Babel will bundle all the code into one JavaScript file that can be run by the browser
+ Webpack can be installed as follows:

Console
```
$ npm install
// installs everything inside our package.json file, which includes Babel and presets
$ npm install webpack --save-dev
```
+ Webpack dev server will actually be used to listen to changes in the webcode, and will update accordingly  
  ```
  $  npm install webpack-dev-server --save-dev
  ```

	- Loaders are instructions that Webpacks follows while transpiling code
	```
  $ npm install babel-loader --save-dev
  $ npm install json-loader --save-dev
  // Just making sure that Babel core is installed
  $ npm install babel-core --save-dev
	```
+ A special webpack config file will need to be made:

webpack.config.js
```
module.exports = {
    entry: "./src/index.js", // where all the JS code will bundle into a single file
    output: {
        path: "dist/assets", // where the one JS file will be placed
        filename: "bundle.js", // name of the file
        publicPath: "assets" // where it's actually placed
    },
    devServer: {
        inline: true, // tells webpack to use a client entry point so we can use port 3000
        contentBase: "./dist", // says where our files will be found
        port: 3000 // port used to show things in-browser
    },
    module: {
        loaders: [ // any modules that have ES6 will be transpiled as ES5 with these
            {
                test: /\.js$/, // any file with a .js is included
                exclude: /(node_modules)/, // ignore our npm stuff of course
                loader: ['babel'], // we want to use the Babel loader 
                query: { 
                    presets: ['latest', 'stage-0'] // presets need to be stated here too 
                }
            },
            { // NodeJS automatically loads in JSON, but the browser and client do not
                test: /\.json$/, // any file with a .json file
                exclude: /(node_modules)/, // ignore our npm stuff of course
                loader: 'json-loader' // we want to use the Json loader
            }
        ]
    }
}
```
+ Now we'll use the `webpack-dev-server` to run our code in the client, but first the `package.json` file needs to 
  edit the start command
  
package.json
```
{
  ...
  "scripts": {
	"start": "./node_modules/.bin/webpack-dev-server"
  },
  ...
}
```
+ NOTE: Things didn't really turn out well for me because of the different versions of packages,
so that's a thing to keep in mind when using `webpack-dev-server` in the future. Configs are always picky

# The Store
+ We used to have a single State that we'd use Reducers on, but instead we'll have a Store that handles the State and 
simply call Actions on that State
+ Creating a store is done with a simple `createStore(...)` function, and getting the State with `getState()`:

index.js
```
const store = createStore(appReducer, initialState);
console.log('initial state', store.getState());
```
+ Actions can now be used on the State with `dispatch(...)` function:

index.js
```
store.dispatch({
    type: C.ADD_DAY,
    payload: {
        "resort": "Mt Shasta",
        "date": "2020-2-2",
        "powder": true,
        "backcountry": false
    }
})
console.log('next state', store.getState()); // Shows the day getting added
```
+ The `subscribe(...)` function can be used on the Store to use a specified Callback every time an Action is dispatched
on the Store
  
index.js
```
const store = createStore(appReducer);

store.subscribe(() => console.log(store.getState()));

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

// The console will automatically print the State twice, right after both Dispatches respectively 
```
+ `localStorage` is native within ES6 that allows you to store (as a Map) objects inside of it,
and use freely within the console
+ `window.*` can be used to globally assign variables that can be called in the console:

index.js
```
const store = createStore(appReducer, initialState);
const dude = "dude";
window.store = store;
window.dude = dude;
```
+ Using both of those previous points, we can log the current State after each Action as follows:

index.js
```
const initialState = localStorage['redux-store'] ?
	JSON.parse(localStorage['redux-store']) :
	{};

const store = createStore(appReducer, initialState);

window.store = store;

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
```

Console output
```
localStorage
Storage {redux-store: "{"allSkiDays":[{"resort":"Mt Shasta","date":"2020-…resortNames":{"fetching":false,"suggestions":[]}}", length: 1}
store.getState()
{allSkiDays: Array(1), goal: 13, errors: Array(0), resortNames: {…}}
```
+ Just as we can subscribe to Actions, we can also unsubscribe with by calling the method again to turn the subscription off

index.js
```
const store = createStore(appReducer);

const unsubscribeGoalLogger = store.subscribe(
	() => console.log(`Goal: ${store.getState().goal}`)
);

setInterval(() => {
	store.dispatch({
		type: C.SET_GOAL,
		payload: Math.floor(Math.random() * 100)
	})
}, 250)

setTimeout(() => {
	unsubscribeGoalLogger();
}, 3000)
```

Console output
```
Goal: 88
Goal: 98
Goal: 2
Goal: 89
Goal: 8
Goal: 43
Goal: 29
Goal: 28
Goal: 90
Goal: 64
Goal: 52
Goal: 10
```
+ Middleware gives us the ability to add functionality to the pipeline of how Actions are dispatched, 
  with the Redux function `applyMiddleware`
+ Middleware functions needs to be a higher order function that takes 3 functions in order
  `const function = store => next => action => {...}`:

store/index.js
```
import { createStore, applyMiddleware } from 'redux';

const consoleMessages = store => next => action => {
    let result;
    console.groupCollapsed(`dispatching action => ${action.type}`);
    console.log('ski days', store.getState().allSkiDays.length);
    result = next(action);

    let { allSkiDays, goal, errors, resortNames } = store.getState();

    console.log(`
        ski days: ${allSkiDays.length}
        goal: ${goal}
        fetching: ${resortNames.fetching}
        suggestions: ${resortNames.suggestions}
        errors: ${errors.length}
    `);
    console.groupEnd();
    
    return result;
}

export default (initialState={}) => {
    return applyMiddleware(consoleMessages)(createStore)(appReducer, initialState);
}
```
+  `console.groupCollapsed(...)` and `console.groupEnd()` are used to make
   automatically collapsed console messages
+ Because we exported the default function above, we can create a Store and apply Middleware at the same time:

src/index.js
```
import storeFactory from './store'

const initialState = (localStorage['redux-store']) ?
	JSON.parse(localStorage['redux-store']) :
	{}

const store = storeFactory(initialState);

store.dispatch({
	type: C.ADD_DAY,
	payload: {
		"resort": "Mt Shasta",
		"date": "2020-2-2",
		"powder": true,
		"backcountry": false
	}
})
```
# Action Creators

+ It's important to note that the Application should not BE the Store, it should simply use the Store
	- Examples of what the Store SHOULDN'T do are reading and writing file data, fetching data from an API, etc.
	
+ Action Creators are functions that encapsulate the logic of Store Actions:

actions.js
```
export const addDay = (resort, date, powder=false, backcountry=false) => {

    // Add additional App logic here...

    return {
        type: C.ADD_DAY,
        payload: { resort, date, powder, backcountry }
    }
}
```

index.js
```
import storeFactory from './store'
import { addDay } from "./actions";

const store = storeFactory();

store.dispatch(
	addDay("Heavenly", "2020-2-2")
)
```
+ For our purposes, if can be neatly wrapped in this syntax:

index.js
```
import storeFactory from './store'
import { setGoal } from "./actions";

const store = storeFactory();
store.dispatch(setGoal(13));
```

actions.js
```
export const setGoal = (goal) => ({
    type: C.SET_GOAL,
    payload: goal
})
```