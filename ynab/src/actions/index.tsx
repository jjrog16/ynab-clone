import { QueryDocumentSnapshot, QuerySnapshot } from "@firebase/firestore";

export const setBankAccounts = (bankAccount: QueryDocumentSnapshot[]) => {
  return {
    type: "bankAccount/addAccount",
    payload: bankAccount,
  };
};

export const setEditAccountNameInput = (input: string) => {
  return {
    type: "editAccountNumberInput/updateInputValue",
    payload: input,
  };
};

export const setEditAccountWorkingBalanceInput = (input: string) => {
  return {
    type: "editAccountWorkingBalanceInput/updateInputValue",
    payload: input,
  };
};

export const setAllTransactions = (transactions: QueryDocumentSnapshot[]) => {
  return {
    type: "transactions/addTransaction",
    payload: transactions,
  };
};

export const setCategoryGroups = (categoryGroups: QuerySnapshot) => {
  return {
    type: "categoryGroups/addCategoryGroup",
    payload: categoryGroups,
  };
};
