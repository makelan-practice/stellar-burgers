/// <reference types="cypress" />
/// <reference path="../support/commands.d.ts" />

import {
  SELECTORS,
  INGREDIENT_NAMES,
  UI_TEXT,
  MOCK_ORDER,
  SAUCE_PRICE
} from '../support/constants';

describe('Страница конструктора бургера', () => {
  const FAKE_ACCESS_TOKEN = 'fake-access-token';
  const FAKE_REFRESH_TOKEN = 'fake-refresh-token';

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить один ингредиент (булку) в конструктор', () => {
      cy.addBunToConstructor();
      cy.contains(INGREDIENT_NAMES.bunTop).should('be.visible');
      cy.contains(INGREDIENT_NAMES.bunBottom).should('be.visible');
    });

    it('должен добавить булки и начинку в конструктор', () => {
      cy.addBunToConstructor();
      cy.addFillingToConstructor(INGREDIENT_NAMES.filling);
      cy.contains(INGREDIENT_NAMES.bunTop).should('be.visible');
      cy.contains(INGREDIENT_NAMES.filling).should('be.visible');
      cy.contains(INGREDIENT_NAMES.bunBottom).should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент', () => {
      cy.openIngredientModal(INGREDIENT_NAMES.bun);
      cy.contains(UI_TEXT.modalIngredientTitle).should('be.visible');
      cy.contains(INGREDIENT_NAMES.bun).should('be.visible');
    });

    it('должно отображать данные того ингредиента, по которому кликнули', () => {
      cy.contains(INGREDIENT_NAMES.sauce).click();
      cy.get(SELECTORS.modalOverlay).should('exist');
      cy.contains(UI_TEXT.modalIngredientTitle).should('be.visible');
      cy.contains(INGREDIENT_NAMES.sauce).should('be.visible');
      cy.contains(SAUCE_PRICE).should('be.visible');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.openIngredientModal(INGREDIENT_NAMES.bun);
      cy.get(SELECTORS.modalOverlay).as('modal');
      cy.get(SELECTORS.modalClose).click();
      cy.get('@modal').should('not.exist');
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.openIngredientModal(INGREDIENT_NAMES.bun);
      cy.get(SELECTORS.modalOverlay).as('modal');
      cy.get('@modal').click({ force: true });
      cy.get(SELECTORS.modalOverlay).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
    });

    it('оформление заказа: модальное окно с номером, закрытие, пустой конструктор', () => {
      cy.setFakeAuth(FAKE_ACCESS_TOKEN, FAKE_REFRESH_TOKEN);
      cy.visit('/');

      cy.addBunToConstructor();
      cy.addFillingToConstructor(INGREDIENT_NAMES.filling);

      cy.contains(UI_TEXT.orderButton).click();

      cy.get(SELECTORS.orderNumber, { timeout: 15000 }).should(
        'have.text',
        MOCK_ORDER.number
      );
      cy.contains(UI_TEXT.orderIdLabel).should('be.visible');

      cy.closeModal();
      cy.get(SELECTORS.orderNumber).should('not.exist');

      cy.contains(UI_TEXT.constructorEmptyBuns).should('be.visible');
      cy.contains(UI_TEXT.constructorEmptyFilling).should('be.visible');
    });

    afterEach(() => {
      cy.clearFakeAuth();
    });
  });
});
