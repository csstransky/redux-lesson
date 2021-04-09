import C from './constants'
import { allSkiDays, goal } from './initialState.json'

console.log(`
    Ski Day Counter
    ================
    This goal is ${goal}
    Initially there are ${allSkiDays.length} ski days in state
    
    Contants
    ================
    ${Object.keys(C).join('\n    ')}
`)