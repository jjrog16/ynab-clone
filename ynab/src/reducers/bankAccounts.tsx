import { QueryDocumentSnapshot } from "@firebase/firestore";

interface BankAccounts {
  value: QueryDocumentSnapshot[];
}
// Holds all bank accounts
const bankAccountsReducer = (
  state: BankAccounts = { value: [] },
  action: { type: string; payload: QueryDocumentSnapshot[] }
) => {
  switch (action.type) {
    case "bankAccount/addAccount":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default bankAccountsReducer;
