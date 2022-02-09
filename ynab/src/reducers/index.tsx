import { combineReducers } from "redux";
import bankAccountsReducer from "./bankAccounts";
import categoryGroupsReducer from "./categoryGroups";
import editAccountNameInputReducer from "./editAccountNameInput";
import editAccountWorkingBalanceInputReducer from "./editAccountWorkingBalance";
import transactionsReducer from "./transactions";
import allCategoriesReducer from "./allCategories";

// Root of all reducers
const rootReducer = combineReducers({
  bankAccountsReducer,
  categoryGroupsReducer,
  allCategoriesReducer,
  editAccountNameInputReducer,
  editAccountWorkingBalanceInputReducer,
  transactionsReducer,
});

export default rootReducer;
