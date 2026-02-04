import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { fetchProfileOrders } from './profileOrdersSlice';
import { resetConstructor } from './burgerConstructorSlice';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const bunId = state.burgerConstructor.bun?._id;

    if (!bunId) {
      throw new Error('Не выбрана булка');
    }

    const ingredientIds = state.burgerConstructor.ingredients.map((i) => i._id);
    const ids = [bunId, ...ingredientIds, bunId];

    const res = await orderBurgerApi(ids);
    if (!res?.success) {
      throw new Error('Не удалось оформить заказ');
    }

    thunkApi.dispatch(resetConstructor());
    thunkApi.dispatch(fetchProfileOrders());

    return res.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error?.message || 'Ошибка оформления заказа';
      });
  }
});

export const { clearOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
