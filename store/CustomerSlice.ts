import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICustomer, ICustomerState } from "./interfaces";

const initialState: ICustomerState = {
    customer: null,
}
const CustomerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<ICustomer>) => {
            state.customer = action.payload;

        },
    },
})
export const { setCustomer } = CustomerSlice.actions;
export default CustomerSlice.reducer;
