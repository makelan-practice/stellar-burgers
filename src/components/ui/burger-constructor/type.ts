import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

export type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderError?: string | null;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
