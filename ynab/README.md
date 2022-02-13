# You Need A Budget (YNAB) Replica

This project showcases the following technologies:
React,
Redux,
TypeScript,
Firebase (NoSQL DB),
SCSS

## Outline of Features:

### Accounts
User is able to add an account (title and amount of money allocated to that amount)
To add an account, select the Add Account button. User can enter a title for the name of the account and the starting balance. The balance will be 0 if no value is entered. 

To Edit or remove an Account, right-click the account.

### Category Groups
User is able to create a group of related categories under a certain type (Immediate Obligations, Fixed Expenses, etc.)
To add a Category Group, select "+ Category Group". 

To Edit or remove a Category Group, right-click the account.

### Categories
User is able to add a specific category to a Category Group, add money to that Category, and subtract money from that category.
To add a Category, hover over a Category Group and select the "+" Icon. 

To add money to a Category, hover over a category, select the "+" icon on the category, enter a nummeric amount to be added to the category, then hit "Enter" on the keyboard.

To subtract money from a Category, hover over a category, select the "-" icon on the category, enter a number amount to be subtracted from the category, then hit "Enter" on the keyboard. 

To Edit or remove a Category, right-click the account.

### Ready To Assign
Ready to Assign automatically adjusts based on the available money in your bank account and the money that has not yet been budgeted to your categories. If you enter a new Account, you will have more money to assign. If you add more money to categories, you will have less money to assign. 
