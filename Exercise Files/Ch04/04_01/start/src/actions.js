import C from './constants'

export const addDay = (resort, date, powder=false, backcountry=false) => {

    // Add additional App logic here...

    return {
        type: C.ADD_DAY,
        payload: { resort, date, powder, backcountry }
    }
}

export const removeDay = (date) => {
    return {
        type: C.REMOVE_DAY,
        payload: date
    }
}

export const setGoal = (goal) => ({
    type: C.SET_GOAL,
    payload: goal
})