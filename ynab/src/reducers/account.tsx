// Account passed at the current time

import { QueryDocumentSnapshot } from "@firebase/firestore";

interface Account {
  value: QueryDocumentSnapshot | null;
}

const accountReducer = (
  state: Account = { value: null },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "account/setAccount":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default accountReducer;
