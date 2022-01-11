import { QueryDocumentSnapshot } from "@firebase/firestore";

interface Categories {
  value: QueryDocumentSnapshot[];
}

// Contains all Categories
const categoriesReducer = (
  state: Categories = { value: [] },
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "categories/addCategory":
      return { ...state, value: action.payload };
    default:
      return state;
  }
};

export default categoriesReducer;
