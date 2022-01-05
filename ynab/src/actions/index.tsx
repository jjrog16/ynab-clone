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

export const enableEditAccountPopup = () => {
  return {
    type: "editAccountPopupStatus/enable",
  };
};

export const disableEditAccountPopup = () => {
  return {
    type: "editAccountPopupStatus/disable",
  };
};

export const enableAddComponentPopup = () => {
  return {
    type: "addComponentPopupStatus/enable",
  };
};

export const disableAddComponentPopup = () => {
  return {
    type: "addComponentPopupStatus/disable",
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

export const setTotalCategoryGroupAmount = (amount: number) => {
  return {
    type: "categoryGroupAmountTotal/addToTotal",
    payload: amount,
  };
};

export const toggleAddComponentPopup = () => {
  return {
    type: "addComponentPopupStatus/toggle",
  };
};

export const setReadyToAssignTotal = (amount: number) => {
  return {
    type: "readyToAssignTotal/addToTotal",
    payload: amount,
  };
};

export const enableEditComponentPopup = () => {
  return {
    type: "editComponentPopupStatus/enable",
  };
};
export const disableEditComponentPopup = () => {
  return {
    type: "editComponentPopupStatus/disable",
  };
};
export const toggleEditComponentPopup = () => {
  return {
    type: "editComponentPopupStatus/toggle",
  };
};
