import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import {
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading
} from '../../services/selectors/orderDetailsSelectors';
import { fetchOrderByNumber } from '../../services/slices/orderDetailsSlice';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const ingredients = useSelector(selectIngredients);
  const orderData = useSelector(selectOrderDetails);
  const isLoading = useSelector(selectOrderDetailsLoading);
  const error = useSelector(selectOrderDetailsError);

  useEffect(() => {
    const n = Number(number);
    if (Number.isFinite(n)) {
      dispatch(fetchOrderByNumber(n));
    }
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки заказа: {error}
      </p>
    );
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
