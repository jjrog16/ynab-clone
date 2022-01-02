// Account passed at the current time

import { QueryDocumentSnapshot } from "@firebase/firestore";

const accountReducer = (
  state: QueryDocumentSnapshot,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      return (state = action.payload);
  }
};

export default accountReducer;
