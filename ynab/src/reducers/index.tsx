import { combineReducers } from "redux";
import accountReducer from "./account";
import bankAccountsReducer from "./bankAccounts";
import categoryGroupsReducer from "./categoryGroups";
import allCategories from "./allCategories";
import editAccountNameInputReducer from "./editAccountNameInput";
import editAccountWorkingBalanceInputReducer from "./editAccountWorkingBalance";
import moneyAmountTotalReducer from "./moneyAmountTotal";
import transactionsReducer from "./transactions";
import isValidToLoadReducer from "./isValidToLoad";
import isComponentEditedReducer from "./isComponentEdited";
import allCategoriesReducer from "./allCategories";

// Root of all reducers
const rootReducer = combineReducers({
  accountReducer,
  bankAccountsReducer,
  categoryGroupsReducer,
  allCategoriesReducer,
  editAccountNameInputReducer,
  editAccountWorkingBalanceInputReducer,
  moneyAmountTotalReducer,
  transactionsReducer,
  isValidToLoadReducer,
  isComponentEditedReducer,
});

export default rootReducer;
