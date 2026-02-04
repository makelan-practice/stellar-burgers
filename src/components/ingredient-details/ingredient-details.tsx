import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredientById,
  selectIngredients,
  selectIngredientsError
} from '../../services/selectors/ingredientsSelectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = useSelector(selectIngredientById(id));
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (!ingredientData && error) {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки ингредиентов: {error}
      </p>
    );
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
