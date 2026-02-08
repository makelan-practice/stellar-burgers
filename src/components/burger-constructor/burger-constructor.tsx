import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/selectors/burgerConstructorSelectors';
import { selectIsAuthenticated } from '../../services/selectors/authSelectors';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectOrderModalData,
  selectOrderError,
  selectOrderRequest
} from '../../services/selectors/orderSelectors';
import { clearOrderModal, createOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(selectConstructorItems);
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const orderError = useSelector(selectOrderError);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(createOrder());
  };
  const closeOrderModal = () => dispatch(clearOrderModal());

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      orderError={orderError}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
