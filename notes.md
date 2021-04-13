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
+ Thunks are higher order functions (Action Creators in our case) that let us choose when to dispatch Actions 
+ `redux-thunk` is a Middleware that will be used by us as our Thunks

Console output
```
$ npm install redux-thunk --save
```
+ If we apply `thunk` to our Middleware, we can allow asynchronous calls that gives us the ability to use `dispatch`
and `getState` freely
  
store/index.js
```
import thunk from 'redux-thunk'

...

export default (initialState={}) => {
	return applyMiddleware(thunk, consoleMessages)(createStore)(appReducer, initialState)
}
```

actions.js
```
// this is really using our Thunk functionality, notice the higher order 
// function of (dispatch, getState) being added, they act as expected
export const randomGoals = () => (dispatch, getState) => {
	if (!getState().resortNames.fetching) {
		dispatch({
			type: C.FETCH_RESORT_NAMES
		})

		setTimeout(() => {
			dispatch({
				type: C.CANCEL_FETCHING
			})
		}, 1500)
	}
}
```

src/index.js
```
import storeFactory from './store'
import { randomGoals } from "./actions";

const store = storeFactory();

store.dispatch(randomGoals());
store.dispatch(randomGoals()); // because of our If statement, this only happens once
```

+ An Express Server is added in the files that can be used like this:

Console output
```
$ npm install

// I personally ran into some trouble here because of new updates and had to run
// these 2 following commands:
$ npm uninstall babel
$ npm install --save-dev babel-cli

$ npm run suggestions
```

URL Bar
```
localhost:3333/resorts
// shows all ski resort names
localhost:3333/resorts/h
// shows all the ski resort names that start with "h"
```

+ `isomorphic-fetch` is used to make fetch requests by the URL

Console output
```
$ npm install isomorphic-fetch --save
```

+ We will match an async fetch call Action that will grab resort names and save them in the Store

actions.js
```
import fetch from 'isomorphic-fetch'

export const suggestResortNames = value => dispatch => {
	dispatch({
		type: C.FETCH_RESORT_NAMES
	})

	fetch('http://localhost:3333/resorts/' + value)
		.then(response => response.json())
		.then(suggestions => dispatch(changeSuggestions(suggestions)))
		.catch(error => {
			dispatch(addError(error.message))
			dispatch({
				type: C.CANCEL_FETCHING
			})
		})
}
```

index.js
```
import storeFactory from './store'
import { suggestResortNames } from "./actions";

const store = storeFactory();

store.dispatch(suggestResortNames("hea"));
```

Console output (suggestions server running)
```
dispatching action => FETCH_RESORT_NAMES

		ski days: 0
		goal: 10
		fetching: true
		suggestions: 
		errors: 0

dispatching action => CHANGE_SUGGESTIONS

		ski days: 0
		goal: 10
		fetching: false
		suggestions: Heavenly Ski Resort,Heavens Sonohara
		errors: 0
```

Console output (suggestions server **NOT running**)
```
dispatching action => FETCH_RESORT_NAMES
GET http://localhost:3333/resorts/hea net::ERR_CONNECTION_REFUSED
dispatching action => ADD_ERROR

		ski days: 0
		goal: 10
		fetching: true
		suggestions: 
		errors: 1

dispatching action => CANCEL_FETCHING

		ski days: 0
		goal: 10
		fetching: false
		suggestions: 
		errors: 1
```

# Incorporating React

+ 'react-redux' will be a library that integrates the Store with React components

Console output
```
$ npm install react-redux --save-dev
```

+ Below is the index file that stores Redux Store state so we can look at it:

index.js
```
import React from 'react'
import { render } from 'react-dom'
import routes from './routes'
import sampleData from './initialState'
import storeFactory from './store'
import { Provider } from 'react-redux'

// stores the Redux Store inside the JS browser localStorage that can be queried any time
const initialState = (localStorage["redux-store"]) ?
    JSON.parse(localStorage["redux-store"]) :
    sampleData

// puts the state of the Store into localStorage whenever we want
const saveState = () => 
    localStorage["redux-store"] = JSON.stringify(store.getState())

// creates a Redux Store with the initialState object
const store = storeFactory(initialState);

// this will callback the saveState function any time an Action is dispatched
store.subscribe(saveState);

// Allows both the entire React components and Redux Store to be global,
// so we can call them in the console
window.React = React
window.store = store
```

+ `Provider` passes the Store around the React tree's routes as you're moving through web pages, meaning
this allows any React child component to interact with the Redux Store if they want to
  
index.js
```
import { Provider } from 'react-redux'

...

render(
	<Provider store={store}>
		{routes}
	</Provider>,
    document.getElementById('react-container')
)
```
+ `connect` is a react-redux function that will create a component that will grab the Store out of state and 
map the State onto the component from the Store

components/containers/SkiDayCount.js
```
import SkiDayCount from '../ui/SkiDayCount'
import { connect } from 'react-redux'

// This object is used to map the Store onto the React component below
const mapStateToProps = (state) => {
	return {
		total: state.allSkiDays.length,
		powder: state.allSkiDays.filter(day => day.powder).length,
		backcountry: state.allSkiDays.filter(day => day.backcountry).length
	}
}

// higher order function that first needs the map State to put into the UI component,
// and then the second arg is the actual UI component itself
const Container = connect(mapStateToProps)(SkiDayCount)

export default Container

// This is the old way of doing it and what we're replacing
// export default () =>	<SkiDayCount total={100} powder={25} backcountry={10} />
```
+ `connect` can also take dispatch Action functions from the Store and attach them to React components

components/containers/ShowErrors.js
```
import ShowErrors from '../ui/ShowErrors'
import { clearError } from './actions'
import { connect } from 'react-redux'

const mapStateToProps = state => {
	return {
		errors: state.errors
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onClearError(index) {
			dispatch(clearError(index));
		}
	}
}

// The first arg expects State first, then the dispatch Callbacks, order matters
export default connect(mapStateToProps, mapDispatchToProps)(ShowErrors)

/* This is the React component we're replacing
export default () =>
  <ShowErrors errors={['sample error']}
    onClearError={index => console.log('todo: clear error at', index)} />
*/
```
+ In this case we'll want the App to always listen for Errors so that they can be displayed whenever they occur

index.js
```
import { addError } from "./actions";

const handleError = error => {
	store.dispatch(addError(error));
}

window.addEventListener("error", handleError);
```
+ `connect`'s `mapStateToProps` function can actually take in both the State **AND** 
  the Component's props and use them accordingly
  
components/containers/SkiDayList.js
```
import SkiDayList from '../ui/SkiDayList'
import { connect } from 'react-redux'
import { removeDay } from "../../actions";

// notice the two input args state AND props being used
const mapStateToProps = (state, props) => ({
    days: state.allSkiDays,
    filter: props.params.filter
})

const mapDispatchToProps = dispatch => ({
    onRemoveDay(date) {
        dispatch(removeDay(date))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SkiDayList);

/* What we're replacing, we can even use props as well
export default (props) =>
    <SkiDayList days={sample}
                filter={props.params.filter}
                onRemoveDay={date => console.log('remove day on', date)} />
*/
```
+ React can handle forms with a `withRouter` function that's a Container that will wrap the Component with a Router 
that navigates the user back to the page after submitting the form
  
+ Even with this wrapped Container, you can still use the Container from `connect` to be wrapped by `withRouter`,
meaning we still can use the Redux Store

components/containers/AddDayForm.js
```
import AddDayForm from '../ui/AddDayForm'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { addDay, suggestResortNames, clearSuggestions } from "../../actions";

const mapStateToProps = (state, props) => ({
    suggestions: state.resortNames.suggestions,
    fetching: state.resortNames.fetching,
    router: props.router
})

const mapDispatchToProps = dispatch => ({
    onNewDay({ resort, date, powder, backcountry }) {
        dispatch(addDay(resort, date, powder, backcountry))
    },
    onChange(value) {
        if (value) {
            dispatch(suggestResortNames(value))
        } else {
            dispatch(clearSuggestions())
        }
    },
    onClear() {
        dispatch(clearSuggestions())
    }
})

const Container = connect(mapStateToProps, mapDispatchToProps)(AddDayForm)

export default withRouter(Container)

/* What we're replacing, BUT we still keep and use the withRouter(...) Container
export default withRouter(
    (props) => 
        <AddDayForm suggestions={[]} 
                fetching={false} 
                router={props.router} 
                onNewDay={day => console.log('todo: add day', day)}
                onChange={value => console.log('todo: suggest', value)}
                onClear={() => console.log('todo: clear suggestions')} />
)
 */
```