import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILocale, IUser, IUserState, IUserWaste } from "./interfaces";
import { act } from "react";


const initialState: IUserState = {
    user: null,
    waste: [],
    locale: null,
    penalty: null,
}

const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.user = action.payload;

        },
        setWaste: (state, action: PayloadAction<IUserWaste[]>) => {
            state.waste = action.payload;
        },
        setLocale: (state, action: PayloadAction<ILocale>) => {
            state.locale = action.payload;
        },
        setPenalty: (state, action: PayloadAction<number | null>) => {
            state.penalty = action.payload;
        },

    },
})
export const { setUser, setWaste, setLocale, setPenalty } = UserSlice.actions;
export default UserSlice.reducer;