import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';
import orderDetailsReducer from './slices/orderDetailsSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  orderDetails: orderDetailsReducer
});
