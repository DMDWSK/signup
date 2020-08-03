import {combineReducers, createStore} from "redux";
import {phoneNumberReduce} from "./reducers";

const rootReducer = combineReducers({
    phone: phoneNumberReduce
});
const store = createStore(rootReducer);
export default store;