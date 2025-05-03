
import { combineReducers, Reducer } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import customerReducer from './CustomerSlice';


const rootReducer: Reducer = combineReducers({
    userReducer, customerReducer
})
export const store = configureStore({
    reducer: {
        root: rootReducer,
    }
});
//export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = typeof store.dispatch;
//export default persistStore(store);