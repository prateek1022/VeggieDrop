import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAddress: null, // Not persistent
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
  },
});

export const { setSelectedAddress, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
