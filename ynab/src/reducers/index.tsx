import { combineReducers } from "redux";
import accountReducer from "./account";
import bankAccountsReducer from "./bankAccounts";
import categoryGroupsReducer from "./categoryGroups";
import categoriesReducer from "./categories";
import categoryGroupAmountTotalReducer from "./categoryGroupAmountTotal";
import editAccountNameInputReducer from "./editAccountNameInput";
import editAccountWorkingBalanceInputReducer from "./editAccountWorkingBalance";
import moneyAmountTotalReducer from "./moneyAmountTotal";
import transactionsReducer from "./transactions";
import isValidToLoadReducer from "./isValidToLoad";

// Root of all reducers
const rootReducer = combineReducers({
  accountReducer,
  bankAccountsReducer,
  categoryGroupsReducer,
  categoriesReducer,
  categoryGroupAmountTotalReducer,
  editAccountNameInputReducer,
  editAccountWorkingBalanceInputReducer,
  moneyAmountTotalReducer,
  transactionsReducer,
  isValidToLoadReducer,
});

export default rootReducer;
