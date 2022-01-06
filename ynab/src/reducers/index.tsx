import { combineReducers } from "redux";
import accountReducer from "./account";
import addComponentPopupStatusReducer from "./addComponentPopupStatus";
import bankAccountsReducer from "./bankAccounts";
import categoryGroupsReducer from "./categoryGroups";
import categoriesReducer from "./categories";
import categoryGroupAmountTotalReducer from "./categoryGroupAmountTotal";
import editAccountNameInputReducer from "./editAccountNameInput";
import editAccountWorkingBalanceInputReducer from "./editAccountWorkingBalance";
import editComponentPopupStatusReducer from "./editComponentPopupStatus";
import moneyAmountTotalReducer from "./moneyAmountTotal";
import readyToAssignTotalReducer from "./readyToAssignTotal";
import transactionsReducer from "./transactions";
import editAccountPopupStatusReducer from "./editAccountPopupStatus";

// Root of all reducers
const rootReducer = combineReducers({
  accountReducer,
  addComponentPopupStatusReducer,
  bankAccountsReducer,
  categoryGroupsReducer,
  categoriesReducer,
  categoryGroupAmountTotalReducer,
  editAccountNameInputReducer,
  editAccountWorkingBalanceInputReducer,
  editAccountPopupStatusReducer,
  editComponentPopupStatusReducer,
  moneyAmountTotalReducer,
  readyToAssignTotalReducer,
  transactionsReducer,
});

export default rootReducer;
