import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' as const };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toBeDefined();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profileOrders');
    expect(state).toHaveProperty('orderDetails');

    expect(state.auth).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      updateUserError: null
    });
    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
    expect(state.order).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
    expect(state.profileOrders).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
    expect(state.orderDetails).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });
});
