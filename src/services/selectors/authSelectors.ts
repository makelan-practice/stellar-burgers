import { RootState } from '../store';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.user);
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUpdateUserError = (state: RootState) =>
  state.auth.updateUserError;
