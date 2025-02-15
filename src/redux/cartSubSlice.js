import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of items, each with its own subscriptionType, dates, and startDate
};

export const cartSubSlice = createSlice({
  name: 'cartSub',
  initialState,
  reducers: {
    ADD_TO_CART: (state, action) => {
      const itemIndex = state.items.findIndex(item => item._id === action.payload._id);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        const newQuantity = action.payload.quantity;

        if (newQuantity <= 0) {
          state.items.splice(itemIndex, 1); // Remove item if quantity <= 0
        } else {
          state.items[itemIndex].quantity = newQuantity; // Update quantity
        }
      } else {
        state.items.push({
          ...action.payload,
          subscriptionType: null,
          dates: {},
          startDate: null,
        }); // Add new item with default subscription details
      }
    },

    SET_SUBSCRIPTION_TYPE: (state, action) => {
      const { _id, subscriptionType } = action.payload;
      const item = state.items.find(item => item._id === _id);
      if (item) {
        item.subscriptionType = subscriptionType;
      }
    },

    SET_DATES: (state, action) => {
      const { _id, dates } = action.payload;
      console.log("dates",dates);
      console.log("id",_id);
      
      
      const item = state.items.find(item => item._id === _id);
      console.log("item",item);
      
      if (item) {
        item.dates = dates;
      }
    },

    SET_START_DATE: (state, action) => {
      const { _id, startDate } = action.payload;
      const item = state.items.find(item => item._id === _id);
      if (item) {
        item.startDate = startDate;
      }
    },

    RESET_ITEM: (state, action) => {
      const { _id } = action.payload;
      state.items = state.items.filter(item => item._id !== _id);
    },

    RESET: () => initialState, // Reset everything
  },
});

export const { ADD_TO_CART, SET_SUBSCRIPTION_TYPE, SET_DATES, SET_START_DATE, RESET_ITEM, RESET } = cartSubSlice.actions;

export default cartSubSlice.reducer;
