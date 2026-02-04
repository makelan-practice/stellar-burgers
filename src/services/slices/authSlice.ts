import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  updateUserError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async () => {
    const hasToken = Boolean(
      getCookie('accessToken') || localStorage.getItem('refreshToken')
    );
    if (!hasToken) {
      return null;
    }

    const data = await getUserApi();
    if (!data?.success) {
      throw new Error('Не удалось получить данные пользователя');
    }
    return data.user;
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    if (!res?.success) {
      throw new Error('Не удалось выполнить вход');
    }
    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    if (!res?.success) {
      throw new Error('Не удалось выполнить регистрацию');
    }
    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  clearTokens();
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    if (!res?.success) {
      throw new Error('Не удалось обновить данные пользователя');
    }
    return res.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.error = action.error?.message || 'Ошибка авторизации';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Ошибка входа';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Ошибка регистрации';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserError =
          action.error?.message || 'Ошибка обновления профиля';
      });
  }
});

export default authSlice.reducer;
