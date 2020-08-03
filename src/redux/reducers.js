import {combineReducers, createStore} from "redux";

export const phoneNumberReduce = (state = [], action) => {
    switch (action.type) {
        case 'phoneNumber':
            return state.concat([action.payload])
        default:
            return state
    }
}