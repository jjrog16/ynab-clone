import { QueryDocumentSnapshot } from "@firebase/firestore";

const transactionsReducer = (
  state: QueryDocumentSnapshot[] = [],
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return [...state, action.payload];
  }
};

export default transactionsReducer;
