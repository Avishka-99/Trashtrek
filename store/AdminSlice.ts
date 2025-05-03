import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUsers, IAdminState } from "./interfaces";

const initialState: IAdminState = {
    users: null,
}
const AdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<IUsers[]>) => {
            state.users = action.payload;

        },
    },
})
export const { setUsers } = AdminSlice.actions;
export default AdminSlice.reducer;
