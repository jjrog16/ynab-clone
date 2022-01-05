import { QueryDocumentSnapshot } from "@firebase/firestore";

interface Transaction {
  value: QueryDocumentSnapshot[];
}

const transactionsReducer = (
  state: Transaction = { value: [] },
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case "transactions/addTransaction":
      return { ...state, value: [...state.value, action.payload] };
    default:
      return state;
  }
};

export default transactionsReducer;
