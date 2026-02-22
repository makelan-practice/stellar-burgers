import reducer, { createOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2024-01-15T12:00:00.000Z',
  updatedAt: '2024-01-15T12:00:00.000Z',
  number: 12345,
  ingredients: []
};

describe('orderSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  describe('createOrder (асинхронный запрос)', () => {
    it('при вызове pending должен устанавливать orderRequest в true', () => {
      const state = reducer(
        undefined,
        createOrder.pending('request-id', undefined)
      );
      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать заказ в orderModalData и orderRequest в false', () => {
      const pendingState = reducer(
        undefined,
        createOrder.pending('request-id', undefined)
      );
      const state = reducer(
        pendingState,
        createOrder.fulfilled(mockOrder, 'request-id', undefined)
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и orderRequest в false', () => {
      const pendingState = reducer(
        undefined,
        createOrder.pending('request-id', undefined)
      );
      const errorMessage = 'Ошибка оформления заказа';
      const state = reducer(
        pendingState,
        createOrder.rejected(
          new Error(errorMessage),
          'request-id',
          undefined
        )
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });
});
