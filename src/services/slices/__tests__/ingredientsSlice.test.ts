import reducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '60d3b41abdacab0026a733c6',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_large: 'https://example.com/bun-large.png',
    image_mobile: 'https://example.com/bun-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  describe('асинхронный запрос fetchIngredients', () => {
    it('при вызове pending должен устанавливать isLoading в true', () => {
      const state = reducer(
        undefined,
        fetchIngredients.pending('request-id', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при вызове fulfilled должен записывать данные в items и устанавливать isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchIngredients.pending('request-id', undefined)
      );
      const state = reducer(
        pendingState,
        fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('при вызове rejected должен записывать ошибку и устанавливать isLoading в false', () => {
      const pendingState = reducer(
        undefined,
        fetchIngredients.pending('request-id', undefined)
      );
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const state = reducer(
        pendingState,
        fetchIngredients.rejected(
          new Error(errorMessage),
          'request-id',
          undefined
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
