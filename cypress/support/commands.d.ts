/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      addBunToConstructor(): Chainable<void>;
      addFillingToConstructor(ingredientName: string): Chainable<void>;
      openIngredientModal(ingredientName: string): Chainable<void>;
      closeModal(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
      setFakeAuth(
        accessToken: string,
        refreshToken: string
      ): Chainable<void>;
      clearFakeAuth(): Chainable<void>;
    }
  }
}

export {};
