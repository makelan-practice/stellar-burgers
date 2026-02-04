import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeed = createSelector(
  [
    (state: RootState) => state.feed.total,
    (state: RootState) => state.feed.totalToday
  ],
  (total, totalToday) => ({ total, totalToday })
);
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;
