import { QueryDocumentSnapshot } from "@firebase/firestore";

export const setBankAccounts = (bankAccount: QueryDocumentSnapshot[]) => {
  return {
    type: "bankAccount/addAccount",
    payload: bankAccount,
  };
};

export const setTotalAmount = (number: number) => {
  return {
    type: "moneyAccountTotal/addToTotal",
    payload: number,
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

export const setCategoryGroups = (categoryGroups: QueryDocumentSnapshot[]) => {
  return {
    type: "categoryGroups/addCategoryGroup",
    payload: categoryGroups,
  };
};

// Available is the available money in category group
export const setAllCategories = (amount: {
  title: string;
  available: number;
  position: number;
}) => {
  return {
    type: "allCategories/addToTotal",
    payload: amount,
  };
};

// Available is the available money in category group
export const updateAllCategories = (amount: {
  title: string;
  available: number;
  position: number;
  index: number;
}) => {
  return {
    type: "allCategories/update",
    payload: amount,
  };
};

// Available is now the available index to remove
export const removeFromAllCategories = (index: {
  title: "";
  available: number;
  index: number;
}) => {
  return {
    type: "allCategories/remove",
    payload: index,
  };
};

export const setIsValidToLoad = (flag: boolean) => {
  return {
    type: "isValidToLoad/setState",
    payload: flag,
  };
};
export const setIsComponentEdited = (flag: boolean) => {
  return {
    type: "isComponentEdited/setState",
    payload: flag,
  };
};
