import reducer, { fetchProfileOrders } from '../profileOrdersSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Бургер',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    number: 1,
    ingredients: []
  }
];

describe('profileOrdersSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  describe('fetchProfileOrders (асинхронный запрос)', () => {
    it('при вызове pending должен устанавливать isLoading в true', () => {
      const state = reducer(
        undefined,
        fetchProfileOrders.pending('request-id', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать заказы в store и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchProfileOrders.pending('request-id', undefined)
      );
      const state = reducer(
        pendingState,
        fetchProfileOrders.fulfilled(mockOrders, 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchProfileOrders.pending('request-id', undefined)
      );
      const errorMessage = 'Ошибка загрузки заказов профиля';
      const state = reducer(
        pendingState,
        fetchProfileOrders.rejected(
          new Error(errorMessage),
          'request-id',
          undefined
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
