import reducer, { fetchOrderByNumber } from '../orderDetailsSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Бургер',
  createdAt: '2024-01-15T12:00:00.000Z',
  updatedAt: '2024-01-15T12:00:00.000Z',
  number: 12345,
  ingredients: []
};

describe('orderDetailsSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  describe('fetchOrderByNumber (асинхронный запрос)', () => {
    it('при вызове pending должен устанавливать isLoading в true', () => {
      const state = reducer(
        undefined,
        fetchOrderByNumber.pending('request-id', 12345)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать заказ в order и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchOrderByNumber.pending('request-id', 12345)
      );
      const state = reducer(
        pendingState,
        fetchOrderByNumber.fulfilled(mockOrder, 'request-id', 12345)
      );
      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchOrderByNumber.pending('request-id', 12345)
      );
      const errorMessage = 'Ошибка загрузки заказа';
      const state = reducer(
        pendingState,
        fetchOrderByNumber.rejected(
          new Error(errorMessage),
          'request-id',
          12345
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.order).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });
});
