/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  const FAKE_ACCESS_TOKEN = 'fake-access-token';
  const FAKE_REFRESH_TOKEN = 'fake-refresh-token';

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить один ингредиент (булку) в конструктор', () => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Добавить').first().click();
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должен добавить булки и начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Добавить').first().click();
      cy.contains('Начинки').click();
      cy.contains('Филе Люминесцентного тетраодонтимформа').should(
        'be.visible'
      );
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .parent()
        .within(() => cy.contains('Добавить').click());
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should(
        'be.visible'
      );
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal-overlay"]').should('exist');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должно отображать данные того ингредиента, по которому кликнули', () => {
      cy.contains('Соус традиционный галактический').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Соус традиционный галактический').should('be.visible');
      cy.contains('15').should('be.visible');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal-overlay"]').should('exist');
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal-overlay"]').should('not.exist');
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal-overlay"]').should('exist');
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal-overlay"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
    });

    it('оформление заказа: модальное окно с номером, закрытие, пустой конструктор', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', FAKE_REFRESH_TOKEN);
      });
      cy.setCookie('accessToken', FAKE_ACCESS_TOKEN);
      cy.visit('/');

      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Добавить').first().click();
      cy.contains('Начинки').click();
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parent()
        .parent()
        .within(() => cy.contains('Добавить').click());

      cy.contains('Оформить заказ').click();

      cy.get('[data-testid="order-number"]', { timeout: 15000 }).should(
        'have.text',
        '12345'
      );
      cy.contains('идентификатор заказа').should('be.visible');

      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal-overlay"]').should('not.exist');
      cy.get('[data-testid="order-number"]').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookies();
    });
  });
});
