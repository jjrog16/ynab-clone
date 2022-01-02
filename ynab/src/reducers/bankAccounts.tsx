import { QueryDocumentSnapshot } from "@firebase/firestore";

// Holds all bank accounts
const bankAccountsReducer = (
  state: QueryDocumentSnapshot[] = [],
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case "ADD_ACCOUNT":
      return [...state, action.payload];
  }
};

export default bankAccountsReducer;
