import { v4 as uuidv4 } from "uuid";

let name = uuidv4();
let categoryName = uuidv4();
let oldBalance;
let oldRta;
const addedValue = 100;
const subtractedValue = 50;
describe("category group", () => {
  it("User can add a category group", () => {
    // Visit the site
    cy.visit("localhost:3000/");

    // Account Balance should not change
    cy.get(".budget-total-amount").then(
      (balance) => (oldBalance = balance.text())
    );

    // RTA balance should not change
    cy.get(".ready-to-assign-amount").then(($rta) => (oldRta = $rta.text()));

    // Click add category group
    cy.findByText(/\+ category group/i).click();
    cy.get("#et-add-new-component").type(name);
    cy.findByRole("button", {
      name: /ok/i,
    }).click();

    // Category group should appear on screen
    cy.findByText(name).should("exist");

    // Compare RTA and Account Balance values
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".budget-total-amount").then((currentBalance) => {
      const convertedCurrentBalance = parseFloat(
        currentBalance.text().replace(/\$/g, "")
      );

      const convertedOldBalance = parseFloat(oldBalance.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentBalance).to.equal(convertedOldBalance);
    });

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentRta).to.equal(convertedOldRta);
    });
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

  it("RTA and Account Balances should not change", () => {
    // Compare RTA and Account Balance values
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".budget-total-amount").then((currentBalance) => {
      const convertedCurrentBalance = parseFloat(
        currentBalance.text().replace(/\$/g, "")
      );

      const convertedOldBalance = parseFloat(oldBalance.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentBalance).to.equal(convertedOldBalance);
    });

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentRta).to.equal(convertedOldRta);
    });
  });

  it("User can delete category group", () => {
    // Right click the entry
    cy.findByText(name).rightclick();

    // Click Delete
    cy.findByRole("button", {
      name: /delete/i,
    }).click({ force: true });

    // Click ok for the prompt
    cy.on("window:confirm", () => true);

    // Review that account is no longer in view
    cy.findByText(name).should("not.exist");
  });

  it("RTA and Account Balances should not change after delete", () => {
    // Compare RTA and Account Balance values
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".budget-total-amount").then((currentBalance) => {
      const convertedCurrentBalance = parseFloat(
        currentBalance.text().replace(/\$/g, "")
      );

      const convertedOldBalance = parseFloat(oldBalance.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedCurrentBalance).to.equal(convertedOldBalance);
    });

    // eslint-disable-next-line jest/valid-expect-in-promise
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

describe("categories", () => {
  it("User can add a category group", () => {
    // Account Balance should not change
    cy.get(".budget-total-amount").then(
      (balance) => (oldBalance = balance.text())
    );

    // RTA balance should not change
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
  it("User can add a category", () => {
    // Hover over category group title
    cy.findByText(name).trigger("mouseover");

    // Click to add new category name
    cy.get(`#${name}-add-category`).click({ force: true });

    // Enter categoryName
    cy.get("#et-add-new-component").type(categoryName);

    // Save the category
    cy.findByRole("button", {
      name: /ok/i,
    }).click({ force: true });

    // Review that the category exists
    cy.findByText(categoryName).should("exist");
  });
  it("User can edit a category name", () => {
    // Open context menu for category
    cy.findByText(categoryName).rightclick();

    // New category name
    categoryName = `${categoryName}test`;

    // Enter new categoryName
    cy.get("#et-edit-new-component").focus().clear();
    cy.get("#et-edit-new-component").type(categoryName);

    // Save the category
    cy.findByRole("button", {
      name: /ok/i,
    }).click({ force: true });

    // Review that the category exists
    cy.findByText(categoryName).should("exist");
  });
  it("User can add money to a category", () => {
    // Hover over category title
    cy.findByText(categoryName).trigger("mouseover");
    // Click to add money to a group
    cy.get(`#${categoryName}-plus`).click({ force: true });

    // Enter 100 for category to add
    cy.get(`#${categoryName}et-edit-available`).invoke("show").type(addedValue);
    cy.get(`#${categoryName}et-edit-available`).invoke("show").type("{enter}");

    // New amount should appear for category
    cy.get(`#${categoryName}amount`).should("contain", "$100");
  });
  it("Old RTA minus new RTA should equal added amount", () => {
    // Compare RTA before and after values

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedOldRta - convertedCurrentRta).to.equal(addedValue);
    });
  });
  it("User can subtract money from a category", () => {
    // Hover over category title
    cy.findByText(categoryName).trigger("mouseover");
    // Click to add money to a group
    cy.get(`#${categoryName}-minus`).click({ force: true });

    // Enter 50 for category to add
    cy.get(`#${categoryName}et-edit-available`)
      .invoke("show")
      .type(subtractedValue);
    cy.get(`#${categoryName}et-edit-available`).invoke("show").type("{enter}");

    // New amount should appear for category
    cy.get(`#${categoryName}amount`).should("contain", "$50");
  });
  it("User can delete category", () => {
    // Right click the entry
    cy.findByText(categoryName).rightclick();

    // Click Delete
    cy.findByRole("button", {
      name: /delete/i,
    }).click({ force: true });

    // Click ok for the prompt
    cy.on("window:confirm", () => true);

    // Review that account is no longer in view
    cy.findByText(categoryName).should("not.exist");
  });
  it("User can add a new category in its place", () => {
    categoryName = `${categoryName}ver2`;

    // Hover over category group title
    cy.findByText(name).trigger("mouseover");

    // Click to add new category name
    cy.get(`#${name}-add-category`).click({ force: true });

    // Enter categoryName
    cy.get("#et-add-new-component").type(categoryName);

    // Save the category
    cy.findByRole("button", {
      name: /ok/i,
    }).click({ force: true });

    // Review that the category exists
    cy.findByText(categoryName).should("exist");
  });
  it("User can assign money to the new category", () => {
    // Hover over category title
    cy.findByText(categoryName).trigger("mouseover");
    // Click to add money to a group
    cy.get(`#${categoryName}-plus`).click({ force: true });

    // Enter 100 for category to add
    cy.get(`#${categoryName}et-edit-available`).invoke("show").type(addedValue);
    cy.get(`#${categoryName}et-edit-available`).invoke("show").type("{enter}");

    // New amount should appear for category
    cy.get(`#${categoryName}amount`).should("contain", "$100");
  });
  it("Old RTA minus new RTA should equal added amount on new category", () => {
    // Compare RTA before and after values

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.get(".ready-to-assign-amount").then((currentRta) => {
      const convertedCurrentRta = parseFloat(
        currentRta.text().replace(/\$/g, "")
      );
      const convertedOldRta = parseFloat(oldRta.replace(/\$/g, ""));

      // eslint-disable-next-line jest/valid-expect
      expect(convertedOldRta - convertedCurrentRta).to.equal(addedValue);
    });
  });
  it("User can delete category group", () => {
    // Right click the entry
    cy.findByText(name).rightclick();

    // Click Delete
    cy.findByRole("button", {
      name: /delete/i,
    }).click({ force: true });

    // Click ok for the prompt
    cy.on("window:confirm", () => true);

    // Review that account is no longer in view
    cy.findByText(name).should("not.exist");
  });
  it("RTA amount should equal old amount", () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
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
