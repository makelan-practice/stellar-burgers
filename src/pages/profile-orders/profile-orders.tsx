import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '../../services/selectors/profileOrdersSelectors';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchProfileOrders());
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
        Ошибка загрузки заказов профиля: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
