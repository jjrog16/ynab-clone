/* eslint-disable jest/valid-expect-in-promise */
import { v4 as uuidv4 } from "uuid";
describe("accounts", () => {
  it("User can add and remove an account", () => {
    // Visit the site
    cy.visit("localhost:3000/");

    // Review account balance
    let oldBalance;
    cy.get(".budget-total-amount").then(
      (balance) => (oldBalance = balance.text())
    );

    // Review RTA balance
    let oldRta;
    cy.get(".ready-to-assign-amount").then(($rta) => (oldRta = $rta.text()));

    // Click add account
    cy.findByRole("button", {
      name: /add account/i,
    }).click();

    // Enter name and starting amount
    const name = uuidv4();
    cy.get("#et-account-name").type(name);
    cy.get("#et-working-balance").type(100);

    // Click save
    cy.findByRole("button", {
      name: /Save/i,
    }).click();

    // New account with name and starting balance should be visible on screen
    cy.findByText(name);
    let balanceChangeAmount;
    cy.get(`#${name}amount`).then(
      (amount) => (balanceChangeAmount = amount.text())
    );

    // Review account balance went up by new account start balance amount
    cy.get(".budget-total-amount").then((currentBalance) => {
      const convertedCurrentBalance = parseFloat(
        currentBalance.text().replace(/\$/g, "")
      );
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$/g, ""));
      const convertedBalanceChangeAmount = parseFloat(
        balanceChangeAmount.replace(/\$/g, "")
      );
      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentBalance - convertedOldBalance).to.equal(
        convertedBalanceChangeAmount
      );
    });

    // Review RTA balance went up by new account start balance amount
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));
      const convertedBalanceChangeAmount = parseFloat(
        balanceChangeAmount.replace(/\$/g, "")
      );

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentRta - convertedOldRta).to.equal(
        convertedBalanceChangeAmount
      );
    });
    // Find account that was just created
    cy.get(`#${name}amount`).rightclick();

    // Click Delete
    cy.findByRole("button", {
      name: /delete/i,
    }).click();

    // Click ok for the prompt
    cy.on("window:confirm", () => true);

    // Review that account is no longer in view
    cy.get(`#${name}amount`).should("not.exist");

    // Review account balance went down and equals old amount

    cy.get(".budget-total-amount").then((currentBalance) => {
      const convertedCurrentBalance = parseFloat(
        currentBalance.text().replace(/\$/g, "")
      );
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentBalance).to.equal(convertedOldBalance);
    });

    // Review RTA balance went down and equals old amount
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentRta).to.equal(convertedOldRta);
    });
  });
});
