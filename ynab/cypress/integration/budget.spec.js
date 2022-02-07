import { v4 as uuidv4 } from "uuid";

let name = uuidv4();

describe("category group", () => {
  it("User can add a category group", () => {
    // Visit the site
    cy.visit("localhost:3000/");

    // Account Balance should not change
    let oldBalance;
    cy.get(".budget-total-amount").then(
      (balance) => (oldBalance = balance.text())
    );

    // RTA balance should not change
    let oldRta;
    cy.get(".ready-to-assign-amount").then(($rta) => (oldRta = $rta.text()));

    // Click add category group
    cy.findByText(/\+ category group/i).click();
    cy.get("#et-add-new-component").type(name);
    cy.findByRole("button", {
      name: /ok/i,
    }).click();

    // Category group should appear on screen
    cy.findByText(name).should("exist");
  });

  it("User can edit category group name", () => {
    // Find the Category Group and right click
    cy.findByText(name).rightclick();

    name = `${name}test`;

    // Clear the field
    cy.get("#et-edit-new-component").focus().clear({ force: true });

    // Enter new name
    cy.get("#et-edit-new-component").type(name);

    // Save the edited role
    cy.findByRole("button", {
      name: /ok/i,
    }).click({ force: true });

    // Category group should appear on screen
    cy.findByText(name).should("exist");
  });

  it("User can delete category group", () => {
    // Right click the entry
    cy.findByText(name).rightclick();

    // Click Delete
    cy.findByRole("button", {
      name: /delete/i,
    }).click();

    // Click ok for the prompt
    cy.on("window:confirm", () => true);

    // Review that account is no longer in view
    cy.findByText(name).should("not.exist");
  });
});

describe("categories", () => {
  it.skip("User can add a category group");
  it.skip("User can add a category");
  it.skip("User can edit a category name");
  it.skip("User can add money to a category");
  it.skip("User can subtract money from a category");
  it.skip("User can delete category");
  it.skip("User can delete category group");
});
