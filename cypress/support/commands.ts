import { SELECTORS, INGREDIENT_NAMES, UI_TEXT } from './constants';

/**
 * Добавляет булку в конструктор (клик по кнопке «Добавить» у булки).
 * Страница конструктора должна быть загружена, ингредиенты видны.
 */
Cypress.Commands.add('addBunToConstructor', () => {
  cy.contains(INGREDIENT_NAMES.bun)
    .should('be.visible')
    .parent()
    .parent()
    .within(() => cy.contains(UI_TEXT.addButton).click());
});

/**
 * Переключается на вкладку «Начинки» и добавляет указанный ингредиент в конструктор.
 */
Cypress.Commands.add('addFillingToConstructor', (ingredientName: string) => {
  cy.contains(UI_TEXT.tabFillings).click();
  cy.contains(ingredientName)
    .should('be.visible')
    .parent()
    .parent()
    .within(() => cy.contains(UI_TEXT.addButton).click());
});

/**
 * Открывает модальное окно ингредиента по клику на карточку с указанным названием.
 */
Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.contains(ingredientName).click();
  cy.get(SELECTORS.modalOverlay).should('exist');
});

/**
 * Закрывает модальное окно по клику на крестик.
 */
Cypress.Commands.add('closeModal', () => {
  cy.get(SELECTORS.modalClose).click();
  cy.get(SELECTORS.modalOverlay).should('not.exist');
});

/**
 * Закрывает модальное окно по клику на оверлей.
 */
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(SELECTORS.modalOverlay).click({ force: true });
  cy.get(SELECTORS.modalOverlay).should('not.exist');
});

/**
 * Подставляет фейковые токены авторизации (localStorage + cookie).
 * После теста вызвать clearFakeAuth() в afterEach.
 */
Cypress.Commands.add(
  'setFakeAuth',
  (accessToken: string, refreshToken: string) => {
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', refreshToken);
    });
    cy.setCookie('accessToken', accessToken);
  }
);

/**
 * Удаляет фейковые токены авторизации.
 */
Cypress.Commands.add('clearFakeAuth', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
  cy.clearCookies();
});

/** Маркер загрузки команд (для корректной работы declare global в модуле). */
export const CYPRESS_COMMANDS_LOADED = true;
