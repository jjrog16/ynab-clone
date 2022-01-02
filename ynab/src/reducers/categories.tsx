import { QueryDocumentSnapshot } from "@firebase/firestore";

// Contains all Categories
const categoriesReducer = (
  state: QueryDocumentSnapshot[] = [],
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "ADD_CATEGORY":
      return [...state, action.payload];
  }
};

export default categoriesReducer;
