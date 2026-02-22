import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://example.com/meat.png',
  image_large: 'https://example.com/meat-large.png',
  image_mobile: 'https://example.com/meat-mobile.png'
};

const initialState = {
  bun: null as TIngredient | null,
  ingredients: [] as Array<TIngredient & { id: string }>
};

describe('burgerConstructorSlice', () => {
  it('должен иметь корректное начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  describe('добавление ингредиента', () => {
    it('должен добавить булку в конструктор', () => {
      const state = reducer(undefined, addIngredient(mockBun));
      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавить начинку в конструктор (с уникальным id)', () => {
      const state = reducer(undefined, addIngredient(mockMain));
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('main-1');
      expect(state.ingredients[0].name).toBe(mockMain.name);
      expect(state.ingredients[0].id).toBeDefined();
      expect(typeof state.ingredients[0].id).toBe('string');
    });

    it('должен добавить несколько начинок', () => {
      let state = reducer(undefined, addIngredient(mockMain));
      state = reducer(state, addIngredient(mockMain));
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('удаление ингредиента', () => {
    it('должен удалить начинку по id', () => {
      let state = reducer(undefined, addIngredient(mockMain));
      const idToRemove = state.ingredients[0].id;
      state = reducer(state, removeIngredient(idToRemove));
      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен менять состояние при удалении несуществующего id', () => {
      let state = reducer(undefined, addIngredient(mockMain));
      const before = state.ingredients.length;
      state = reducer(state, removeIngredient('non-existent-id'));
      expect(state.ingredients).toHaveLength(before);
    });
  });

  describe('изменение порядка ингредиентов', () => {
    it('должен переместить ингредиент с одного индекса на другой', () => {
      let state = reducer(undefined, addIngredient(mockMain));
      state = reducer(state, addIngredient({ ...mockMain, _id: 'main-2' }));
      state = reducer(state, addIngredient({ ...mockMain, _id: 'main-3' }));
      const [firstId, secondId, thirdId] = state.ingredients.map((i) => i._id);

      state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));
      expect(state.ingredients.map((i) => i._id)).toEqual([secondId, thirdId, firstId]);
    });

    it('не должен менять порядок при некорректных индексах', () => {
      let state = reducer(undefined, addIngredient(mockMain));
      state = reducer(state, addIngredient({ ...mockMain, _id: 'main-2' }));
      const before = state.ingredients.map((i) => i._id);

      state = reducer(state, moveIngredient({ fromIndex: -1, toIndex: 0 }));
      expect(state.ingredients.map((i) => i._id)).toEqual(before);

      state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 10 }));
      expect(state.ingredients.map((i) => i._id)).toEqual(before);
    });
  });
});
