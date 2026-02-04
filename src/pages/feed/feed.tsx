import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '../../services/selectors/feedSelectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchFeeds());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки ленты заказов: {error}
      </p>
    );
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
