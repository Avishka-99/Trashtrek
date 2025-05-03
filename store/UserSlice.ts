import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILocale, IUser, IUserState, IUserWaste } from "./interfaces";
import { act } from "react";


const initialState: IUserState = {
    user: null,
    waste: [],
    locale: null,
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;

        },
        setWaste: (state, action: PayloadAction<IUserWaste[]>) => {
            state.waste.push(...action.payload);
        },
        setLocale: (state, action: PayloadAction<ILocale>) => {
            state.locale = action.payload;
        },

    },
})
export const { setUser, setWaste, setLocale } = UserSlice.actions;
export default UserSlice.reducer;