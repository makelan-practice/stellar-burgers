import reducer, { fetchFeeds } from '../feedSlice';
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

const mockPayload = {
  success: true,
  orders: mockOrders,
  total: 100,
  totalToday: 5
};

describe('feedSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  describe('fetchFeeds (асинхронный запрос)', () => {
    it('при вызове pending должен устанавливать isLoading в true', () => {
      const state = reducer(
        undefined,
        fetchFeeds.pending('request-id', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать данные в store и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchFeeds.pending('request-id', undefined)
      );
      const state = reducer(
        pendingState,
        fetchFeeds.fulfilled(mockPayload, 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(5);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchFeeds.pending('request-id', undefined)
      );
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const state = reducer(
        pendingState,
        fetchFeeds.rejected(
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
