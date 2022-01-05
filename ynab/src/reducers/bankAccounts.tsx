import { QueryDocumentSnapshot } from "@firebase/firestore";

interface BankAccounts {
  value: { arr: QueryDocumentSnapshot[] };
}
// Holds all bank accounts
const bankAccountsReducer = (
  state: BankAccounts = { value: { arr: [] } },
  action: { type: string; payload: QueryDocumentSnapshot[] }
) => {
  switch (action.type) {
    case "bankAccount/addAccount":
      return { ...state, value: { ...state.value, arr: action.payload } };
    default:
      return state;
  }
};

export default bankAccountsReducer;
