import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'bun')
);
export const selectMains = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'main')
);
export const selectSauces = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'sauce')
);

export const selectIngredientById =
  (id: string | undefined) => (state: RootState) =>
    state.ingredients.items.find((i) => i._id === id) || null;
