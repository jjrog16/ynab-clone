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

export const setCategories = (categories: QueryDocumentSnapshot[]) => {
  return {
    type: "categories/addCategory",
    payload: categories,
  };
};

export const setTotalCategoryGroupAmount = (amount: {
  title: string;
  available: number;
}) => {
  return {
    type: "categoryGroupAmountTotal/addToTotal",
    payload: amount,
  };
};

export const setIsValidToLoad = (flag: boolean) => {
  return {
    type: "isValidToLoad/setState",
    payload: flag,
  };
};
