import reducer, { checkUserAuth } from '../authSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('authSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      updateUserError: null
    });
  });

  describe('checkUserAuth (асинхронный запрос)', () => {
    it('при вызове pending должен устанавливать isLoading в true', () => {
      const state = reducer(
        undefined,
        checkUserAuth.pending('request-id', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать user в store и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        checkUserAuth.pending('request-id', undefined)
      );
      const state = reducer(
        pendingState,
        checkUserAuth.fulfilled(mockUser, 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        checkUserAuth.pending('request-id', undefined)
      );
      const errorMessage = 'Ошибка авторизации';
      const state = reducer(
        pendingState,
        checkUserAuth.rejected(
          new Error(errorMessage),
          'request-id',
          undefined
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });
});
