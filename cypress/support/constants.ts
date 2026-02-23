/**
 * Селекторы и тексты, используемые в e2e-тестах конструктора.
 * Повторяющиеся значения вынесены в константы для единой точки изменения.
 */
export const SELECTORS = {
  modalOverlay: '[data-testid="modal-overlay"]',
  modalClose: '[data-testid="modal-close"]',
  orderNumber: '[data-testid="order-number"]',
} as const;

/** Тексты ингредиентов из fixtures/ingredients.json */
export const INGREDIENT_NAMES = {
  bun: 'Краторная булка N-200i',
  bunTop: 'Краторная булка N-200i (верх)',
  bunBottom: 'Краторная булка N-200i (низ)',
  filling: 'Филе Люминесцентного тетраодонтимформа',
  sauce: 'Соус традиционный галактический',
} as const;

/** Тексты кнопок и вкладок */
export const UI_TEXT = {
  addButton: 'Добавить',
  tabFillings: 'Начинки',
  orderButton: 'Оформить заказ',
  modalIngredientTitle: 'Детали ингредиента',
  constructorEmptyBuns: 'Выберите булки',
  constructorEmptyFilling: 'Выберите начинку',
  orderIdLabel: 'идентификатор заказа',
} as const;

/** Мок-данные заказа из fixtures/order.json */
export const MOCK_ORDER = {
  number: '12345',
} as const;

/** Цена соуса из fixtures (для проверки в модалке) */
export const SAUCE_PRICE = '15';
